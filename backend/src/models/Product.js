const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    sku: String,
    category: String,
    createdBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
