const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// GET /api/public/stats
router.get('/stats', async (req, res) => {
    try {
        const invoiceCount = await Invoice.countDocuments();
        const result = await Invoice.aggregate([
            { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } }
        ]);
        const totalProcessed = result.length > 0 ? result[0].totalAmount : 0;

        res.json({
            invoiceCount,
            totalProcessed,
            uptime: '99.9%',
            rating: '4.9/5'
        });
    } catch (error) {
        console.error('Error fetching public stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;
