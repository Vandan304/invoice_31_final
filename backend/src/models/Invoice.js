const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true }
});

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true }, // Uniqueness handled by compound index with userId
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
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdBy: { type: String } // Clerk ID of user
}, { timestamps: true });

// Compound index for unique invoice number per user
InvoiceSchema.index({ userId: 1, invoiceNumber: 1 }, { unique: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
