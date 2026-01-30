const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const authMiddleware = require('../middlewares/auth.middleware');
const mongoose = require('mongoose');

router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Validate userId just in case
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Dashboard Stats Error: Invalid User ID:', userId);
            return res.status(400).json({ error: 'Invalid User ID token' });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const totalInvoices = await Invoice.countDocuments({ userId });
        const totalCustomers = await Customer.countDocuments({ userId });
        const totalProducts = await Product.countDocuments({ userId });

        // Calculate Total Revenue (Sum of all invoices for this user)
        const revenueAgg = await Invoice.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        // Pending Payments
        const pendingAgg = await Invoice.aggregate([
            { $match: { userId: userObjectId, status: 'pending' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const pendingrevenue = pendingAgg.length > 0 ? pendingAgg[0].total : 0;

        // Recent Invoices (Last 5)
        const recentInvoices = await Invoice.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('customer.customerId', 'name');

        res.json({
            totalInvoices,
            totalCustomers,
            totalProducts,
            totalRevenue,
            pendingrevenue, // Note: kept 'pendingrevenue' casing to match frontend expectation if any
            recentInvoices
        });
    } catch (error) {
        console.error('Error in GET /api/dashboard/stats:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
