const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth.middleware');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Order
router.post('/create-order', authMiddleware, async (req, res) => {
    try {
        const { planType } = req.body;
        let amount = 0;

        switch (planType) {
            case 'monthly':
                amount = 399 * 100; // in paise
                break;
            case 'yearly':
                amount = 3999 * 100; // in paise
                break;
            default:
                return res.status(400).json({ error: 'Invalid plan type' });
        }

        const options = {
            amount: amount,
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        // Create a pending payment record
        const payment = new Payment({
            userId: req.user.userId,
            razorpayOrderId: order.id,
            amount: amount / 100,
            currency: 'INR',
            status: 'created',
            planType: planType
        });
        await payment.save();

        res.json({ order, key_id: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        console.error("Create Order Error", error);
        res.status(500).json({ error: error.message });
    }
});

// Verify Payment
router.post('/verify', authMiddleware, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            // Success
            const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
            if (payment) {
                payment.razorpayPaymentId = razorpay_payment_id;
                payment.razorpaySignature = razorpay_signature;
                payment.status = 'captured';
                await payment.save();

                // Update User Plan
                const startDate = new Date();
                const endDate = new Date();
                if (payment.planType === 'monthly') {
                    endDate.setMonth(endDate.getMonth() + 1);
                } else if (payment.planType === 'yearly') {
                    endDate.setFullYear(endDate.getFullYear() + 1);
                }

                await User.findByIdAndUpdate(req.user.userId, {
                    planType: payment.planType,
                    planStartDate: startDate,
                    planEndDate: endDate,
                    isActivePlan: true
                });

                res.json({ status: 'success', message: 'Payment verified and plan updated' });
            } else {
                res.status(404).json({ error: 'Payment record not found' });
            }
        } else {
            res.status(400).json({ error: 'Invalid signature' });
        }
    } catch (error) {
        console.error("Verify Error", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
