require('dotenv').config();
const mongoose = require('mongoose');
const Invoice = require('../src/models/Invoice');

// Mock Data mimicking Frontend Payload
const testInvoice = {
    invoiceNumber: "TEST-INV-" + Date.now(),
    customer: {
        name: "Debug Customer",
        email: "debug@example.com",
        address: "Debug Address",
        customerId: new mongoose.Types.ObjectId() // Valid ObjectId
    },
    items: [
        {
            description: "Test Item",
            quantity: 1,
            unitPrice: 100,
            total: 100,
            productId: null
        }
    ],
    subTotal: 100,
    taxRate: 0,
    taxAmount: 0,
    discountRate: 0,
    discountAmount: 0,
    totalAmount: 100,
    status: 'draft',
    userId: new mongoose.Types.ObjectId(), // Random User ID
    createdBy: "debug_user"
};

const runDebug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        console.log("Attempting to save invoice...");
        const inv = new Invoice(testInvoice);
        await inv.save();
        console.log("Invoice saved successfully:", inv._id);

        await Invoice.deleteOne({ _id: inv._id });
        console.log("Cleaned up test invoice.");

    } catch (error) {
        console.error("SAVE FAILED:", error);
    } finally {
        await mongoose.disconnect();
    }
};

runDebug();
