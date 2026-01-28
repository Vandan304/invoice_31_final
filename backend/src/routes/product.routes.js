const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/', async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            userId: req.user.userId
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ userId: req.user.userId });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Product.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!deleted) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
