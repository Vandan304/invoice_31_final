const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    role: { type: String, enum: ['admin', 'staff'], default: 'admin' },
    planType: { type: String, enum: ['free', 'monthly', 'yearly'], default: 'free' },
    planStartDate: { type: Date, default: Date.now },
    planEndDate: { type: Date },
    isActivePlan: { type: Boolean, default: true },
    razorpayCustomerId: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
