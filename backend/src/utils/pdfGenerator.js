const PDFDocument = require('pdfkit');
const BusinessProfile = require('../models/BusinessProfile');

const generateInvoicePDF = async (invoice, res) => {
    try {
        const doc = new PDFDocument({ margin: 50 });

        // Fetch Business Profile for Logo
        // Assuming the invoice creator is the business owner
        const profile = await BusinessProfile.findOne({ userId: invoice.createdBy || invoice.userId }); // fallback check

        doc.pipe(res);

        // --- Header ---

        // Logo
        if (profile && profile.logoUrl && profile.logoUrl.startsWith('data:image')) {
            try {
                // simple base64 handling for PDFKit
                const img = Buffer.from(profile.logoUrl.split(',')[1], 'base64');
                doc.image(img, 50, 45, { width: 50 });
            } catch (e) {
                console.error("Logo Error", e);
            }
        }

        // Business Details (Right aligned)
        doc.fontSize(20).text('INVOICE', 0, 50, { align: 'right' });
        doc.fontSize(10).text(invoice.invoiceNumber, 0, 75, { align: 'right' });

        doc.moveDown();

        // --- From & To ---
        const customer = invoice.customer || {};
        const businessParams = profile || { businessName: 'My Business', email: '', address: '' };

        doc.text('From:', 50, 150)
            .font('Helvetica-Bold').text(businessParams.businessName || 'Business Name')
            .font('Helvetica').text(businessParams.email || '')
            .text(businessParams.address || '')
            .text(businessParams.phone || '');

        doc.text('Bill To:', 300, 150)
            .font('Helvetica-Bold').text(customer.name || 'Client Name')
            .font('Helvetica').text(customer.email || '')
            .text(customer.address || '');

        // --- Items Table ---
        let i = 250;
        doc.font('Helvetica-Bold');
        doc.text('Description', 50, i);
        doc.text('Qty', 300, i, { width: 50, align: 'right' });
        doc.text('Price', 350, i, { width: 70, align: 'right' });
        doc.text('Total', 420, i, { width: 70, align: 'right' });

        doc.moveTo(50, i + 15).lineTo(550, i + 15).stroke();
        doc.font('Helvetica');

        i += 30;
        invoice.items.forEach(item => {
            doc.text(item.description, 50, i);
            doc.text(item.quantity, 300, i, { width: 50, align: 'right' });
            doc.text(item.unitPrice.toFixed(2), 350, i, { width: 70, align: 'right' });
            doc.text(item.total.toFixed(2), 420, i, { width: 70, align: 'right' });
            i += 20;
        });

        doc.moveTo(50, i + 10).lineTo(550, i + 10).stroke();

        // --- Totals ---
        i += 30;
        doc.text('Subtotal:', 350, i, { width: 70, align: 'right' });
        doc.text(invoice.subTotal?.toFixed(2) || '0.00', 420, i, { width: 70, align: 'right' });

        i += 20;
        doc.text('Tax:', 350, i, { width: 70, align: 'right' });
        doc.text(invoice.taxAmount?.toFixed(2) || '0.00', 420, i, { width: 70, align: 'right' });

        i += 20;
        doc.font('Helvetica-Bold').fontSize(12);
        doc.text('Total:', 350, i, { width: 70, align: 'right' });
        doc.text(invoice.totalAmount?.toFixed(2) || '0.00', 420, i, { width: 70, align: 'right' });

        // --- Footer ---
        doc.fontSize(10).font('Helvetica').text('Thank you for your business.', 50, 700, { align: 'center', width: 500 });

        doc.end();

    } catch (error) {
        console.error("PDF Gen Error", error);
        res.status(500).send("Error generating PDF");
    }
};

module.exports = { generateInvoicePDF };
