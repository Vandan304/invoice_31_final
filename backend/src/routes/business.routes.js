const express = require('express');
const router = express.Router();
const BusinessProfile = require('../models/BusinessProfile');
const authMiddleware = require('../middlewares/auth.middleware');

// Get Profile
router.get('/', authMiddleware, async (req, res) => {
    try {
        let profile = await BusinessProfile.findOne({ userId: req.user.userId });
        if (!profile) {
            return res.json({}); // Return empty if not created yet
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create or Update Profile
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Sanitize and validate payload
        const { businessName, email, phone, address, gstNumber, logoUrl, signature, defaultTaxRate, currency, website } = req.body;

        const payload = {
            businessName,
            email,
            phone,
            address,
            gstNumber,
            logoUrl,
            signature,
            defaultTaxRate: defaultTaxRate ? Number(defaultTaxRate) : 0,
            currency,
            website,
            // Ensure userId is part of the document if creating
            userId: req.user.userId
        };

        // Use findOneAndUpdate with upsert: true to handle both create and update atomically
        const profile = await BusinessProfile.findOneAndUpdate(
            { userId: req.user.userId },
            { $set: payload },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(profile);
    } catch (error) {
        console.error("Business Profile Save Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
