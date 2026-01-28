const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/', async (req, res) => {
    try {
        const customer = new Customer({
            ...req.body,
            userId: req.user.userId
        });
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await Customer.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Customer not found' });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Customer.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!deleted) return res.status(404).json({ error: 'Customer not found' });
        res.json({ message: 'Customer deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
