require('dotenv').config();
const mongoose = require('mongoose');
const Invoice = require('../src/models/Invoice');

const runDebug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const testInvoice = {
            // invoiceNumber: "TEST-INV-FAIL-" + Date.now(), // Let's try to verify generation too if possible, but simpler first
            invoiceNumber: "TEST-INV-FAIL-" + Date.now(),
            customer: {
                name: "Debug Customer",
                customerId: null
            },
            items: [
                {
                    description: "Faulty Item",
                    quantity: 1,
                    unitPrice: 100,
                    total: 100,
                    productId: "" // THIS SHOULD CAUSE ERROR
                }
            ],
            totalAmount: 100,
            status: 'draft',
            userId: new mongoose.Types.ObjectId(),
        };

        console.log("Attempting to save invoice with productId: ''...");
        const inv = new Invoice(testInvoice);
        await inv.save();
        console.log("Invoice saved successfully (Unexpected!)");

    } catch (error) {
        console.error("EXPECTED ERROR CAUGHT:", error.message);
        if (error.name === 'ValidationError') {
            console.log("Validation Error Details:", JSON.stringify(error.errors, null, 2));
        }
    } finally {
        await mongoose.disconnect();
    }
};

runDebug();
