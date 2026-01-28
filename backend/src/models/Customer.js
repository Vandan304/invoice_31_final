const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    createdBy: { type: String } // Clerk User ID
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
