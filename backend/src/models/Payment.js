const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    method: { type: String, enum: ['Cash', 'Bank Transfer', 'Credit Card', 'PayPal', 'Other'], default: 'Cash' },
    note: String,
    recordedBy: String
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
