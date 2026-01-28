require('dotenv').config();
const mongoose = require('mongoose');

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('invoices');

        // 1. Drop existing global unique index on invoiceNumber
        const indexes = await collection.indexes();
        const invoiceNumIndex = indexes.find(idx => idx.name === 'invoiceNumber_1');

        if (invoiceNumIndex) {
            console.log('Dropping global index "invoiceNumber_1"...');
            await collection.dropIndex('invoiceNumber_1');
            console.log('Dropped "invoiceNumber_1".');
        }

        // 2. Create compound unique index (userId + invoiceNumber)
        console.log('Creating compound index { userId: 1, invoiceNumber: 1 }...');
        await collection.createIndex({ userId: 1, invoiceNumber: 1 }, { unique: true });
        console.log('Compound index created successfully.');

        // Verify
        const newIndexes = await collection.indexes();
        console.log('Current Indexes:', newIndexes.map(i => i.name));

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
};

fixIndexes();
