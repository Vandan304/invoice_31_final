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
        const { businessName, email, phone, address, gstNumber, logoUrl, defaultTaxRate, currency } = req.body;

        let profile = await BusinessProfile.findOne({ userId: req.user.userId });

        if (profile) {
            // Update
            profile = await BusinessProfile.findOneAndUpdate(
                { userId: req.user.userId },
                { $set: req.body, updatedAt: Date.now() },
                { new: true }
            );
        } else {
            // Create
            profile = new BusinessProfile({
                userId: req.user.userId,
                ...req.body
            });
            await profile.save();
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
