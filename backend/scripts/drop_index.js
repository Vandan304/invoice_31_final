require('dotenv').config();
const mongoose = require('mongoose');

const dropIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('businessprofiles');
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes);

        const ownerIndex = indexes.find(idx => idx.name === 'owner_1');
        if (ownerIndex) {
            console.log('Found obsolete index "owner_1". Dropping...');
            await collection.dropIndex('owner_1');
            console.log('Index "owner_1" dropped successfully.');
        } else {
            console.log('Index "owner_1" not found. No action needed.');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
};

dropIndex();
