const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth.middleware');
const sendOTP = require('../utils/sendEmail');

// Helper to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
};

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        user = new User({
            username,
            email,
            password: hashedPassword,
            role: 'admin', // First user logic or default
            otpCode: otp,
            otpExpireTime: otpExpires,
            isVerified: false
        });

        await user.save();
        await sendOTP(email, otp);

        res.json({ message: 'Registration successful. OTP sent to email.', email });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Generate OTP
        const otp = generateOTP();
        user.otpCode = otp;
        user.otpExpireTime = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        await sendOTP(email, otp);

        res.json({ message: 'OTP sent to email.', email });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        if (user.otpCode !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        if (user.otpExpireTime < Date.now()) {
            return res.status(400).json({ error: 'OTP Expired' });
        }

        // OTP Valid
        user.isVerified = true;
        user.otpCode = undefined;
        user.otpExpireTime = undefined;
        await user.save();

        const payload = { userId: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });

        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Resend OTP
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const otp = generateOTP();
        user.otpCode = otp;
        user.otpExpireTime = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        await sendOTP(email, otp);

        res.json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Resend OTP Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Current User
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
