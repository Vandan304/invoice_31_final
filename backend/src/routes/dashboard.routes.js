const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const totalInvoices = await Invoice.countDocuments();
        const totalCustomers = await Customer.countDocuments();
        const totalProducts = await Product.countDocuments();

        // Calculate Total Revenue (Sum of all invoices)
        // In a real app, maybe filter by status 'paid'
        const revenueAgg = await Invoice.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        // Pending Payments
        const pendingAgg = await Invoice.aggregate([
            { $match: { status: 'pending' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const pendingrevenue = pendingAgg.length > 0 ? pendingAgg[0].total : 0;

        // Recent Invoices (Last 5)
        const recentInvoices = await Invoice.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('customer.customerId', 'name');

        res.json({
            totalInvoices,
            totalCustomers,
            totalProducts,
            totalRevenue,
            pendingrevenue,
            recentInvoices
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
