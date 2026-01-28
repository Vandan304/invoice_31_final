const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const authMiddleware = require('../middlewares/auth.middleware');

// Create Invoice
router.post('/', authMiddleware, async (req, res) => {
    try {
        const invoiceData = req.body;
        // Generate Invoice Number if not provided
        // Generate Invoice Number if not provided
        if (!invoiceData.invoiceNumber) {
            const lastInvoice = await Invoice.findOne({ userId: req.user.userId }).sort({ createdAt: -1 });
            let nextNum = 1;
            if (lastInvoice && lastInvoice.invoiceNumber.startsWith('INV-')) {
                const parts = lastInvoice.invoiceNumber.split('-');
                if (parts.length === 3) {
                    nextNum = parseInt(parts[2]) + 1;
                }
            }
            invoiceData.invoiceNumber = `INV-${new Date().getFullYear()}-${nextNum.toString().padStart(4, '0')}`;
        }

        // Sanitize items: Ensure productId is valid ObjectId or null
        if (invoiceData.items && Array.isArray(invoiceData.items)) {
            invoiceData.items = invoiceData.items.map(item => ({
                ...item,
                productId: (item.productId && item.productId !== '') ? item.productId : null
            }));
        }

        // Sanitize customerId
        if (invoiceData.customer && invoiceData.customer.customerId === '') {
            invoiceData.customer.customerId = null;
        }

        const newInvoice = new Invoice({
            ...invoiceData,
            userId: req.user.userId,
            createdBy: req.user.userId // Save the user ID to link with business profile
        });
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (error) {
        console.error("Invoice Create Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get All Invoices
router.get('/', authMiddleware, async (req, res) => {
    try {
        const invoices = await Invoice.find({ userId: req.user.userId })
            .populate('customer.customerId', 'name email') // If using ref
            .sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Single Invoice
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Invoice
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true }
        );
        if (!updatedInvoice) return res.status(404).json({ error: 'Invoice not found' });
        res.json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Invoice
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deleted = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!deleted) return res.status(404).json({ error: 'Invoice not found' });
        res.json({ message: 'Invoice deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Download PDF
router.get('/:id/pdf', authMiddleware, async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);

        const { generateInvoicePDF } = require('../utils/pdfGenerator');
        // Pass invoice and response object
        // We might need to fetch the business profile inside the generator or pass it here
        // The generator now handles fetching profile based on invoice.createdBy
        await generateInvoicePDF(invoice, res);
    } catch (error) {
        console.error("PDF Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
