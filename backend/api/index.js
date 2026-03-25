const app = require('../src/app');
const mongoose = require('mongoose');

// Cache the DB connection to optimize serverless function execution
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }
    
    // Fallback check if already connected
    if (mongoose.connection.readyState >= 1) {
        isConnected = true;
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log('MongoDB connected via Vercel Serverless');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        throw error;
    }
};

module.exports = async (req, res) => {
    await connectToDatabase();
    return app(req, res);
};
