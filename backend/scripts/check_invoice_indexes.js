require('dotenv').config();
const mongoose = require('mongoose');

const checkIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const collection = mongoose.connection.collection('invoices');
        const indexes = await collection.indexes();
        console.log('Invoice Indexes:', indexes);
        mongoose.connection.close();
    } catch (error) {
        console.error(error);
        mongoose.connection.close();
    }
};

checkIndexes();
