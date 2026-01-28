const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdBy: { type: String } // Deprecated, keeping for backward compat if needed
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
