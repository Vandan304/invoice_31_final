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
        if (!invoiceData.invoiceNumber) {
            const count = await Invoice.countDocuments();
            invoiceData.invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
        }

        const newInvoice = new Invoice({
            ...invoiceData,
            createdBy: req.user.userId // Save the user ID to link with business profile
        });
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Invoices
router.get('/', authMiddleware, async (req, res) => {
    try {
        const invoices = await Invoice.find()
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
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Invoice
router.put('/:id', async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Invoice
router.delete('/:id', async (req, res) => {
    try {
        await Invoice.findByIdAndDelete(req.params.id);
        res.json({ message: 'Invoice deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Download PDF
router.get('/:id/pdf', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
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
