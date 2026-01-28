const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true }
});

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    customer: {
        name: String,
        email: String,
        address: String,
        // Can also reference Customer model if needed, but embedding for snapshot is good
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }
    },
    items: [InvoiceItemSchema],
    subTotal: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountRate: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'pending', 'paid', 'overdue'], default: 'draft' },
    dueDate: Date,
    issueDate: { type: Date, default: Date.now },
    notes: String,
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
    createdBy: { type: String } // Clerk ID of user
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
