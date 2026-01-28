const mongoose = require('mongoose');

const BusinessProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    gstNumber: String,
    logoUrl: String,
    signature: String, // Added as per requirements
    website: String,
    defaultTaxRate: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BusinessProfile', BusinessProfileSchema);
