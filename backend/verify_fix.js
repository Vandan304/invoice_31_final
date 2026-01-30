const mongoose = require('mongoose');
const User = require('./src/models/User');
const jwt = require('jsonwebtoken');
const app = require('./src/app');
const http = require('http');
require('dotenv').config();

const PORT = 54321; // Random port to avoid conflict

const run = async () => {
    let server;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const user = await User.findOne();
        if (!user) {
            console.log('No user found to test with');
            process.exit(1);
        }

        const payload = { userId: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
        console.log('Generated token for user:', user._id);

        server = http.createServer(app);
        await new Promise((resolve) => server.listen(PORT, resolve));
        console.log(`Test server running on port ${PORT}`);

        // Make request
        const response = await fetch(`http://localhost:${PORT}/api/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(`Response Status: ${response.status}`);
        const data = await response.json();

        if (response.ok) {
            console.log('Success! Data received:', Object.keys(data));
        } else {
            console.error('Failed:', data);
            process.exit(1);
        }

    } catch (error) {
        console.error('Test Error:', error);
        process.exit(1);
    } finally {
        if (server) server.close();
        await mongoose.disconnect();
    }
};

run();
