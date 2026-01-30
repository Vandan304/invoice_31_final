const mongoose = require('mongoose');
const Invoice = require('./src/models/Invoice');
const Customer = require('./src/models/Customer');
const Product = require('./src/models/Product');
const User = require('./src/models/User'); // Assuming User model exists
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const user = await User.findOne();
        if (!user) {
            console.log('No user found');
            process.exit(1);
        }
        const userId = user._id.toString();
        console.log('Testing with userId:', userId);

        console.log('Counting docs...');
        const totalInvoices = await Invoice.countDocuments({ userId });
        const totalCustomers = await Customer.countDocuments({ userId });
        const totalProducts = await Product.countDocuments({ userId });
        console.log('Counts:', { totalInvoices, totalCustomers, totalProducts });

        console.log('Aggregating revenue...');
        const revenueAgg = await Invoice.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        console.log('Revenue Agg:', revenueAgg);

        console.log('Aggregating pending...');
        const pendingAgg = await Invoice.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'pending' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        console.log('Pending Agg:', pendingAgg);

        console.log('Fetching recent invoices...');
        const recentInvoices = await Invoice.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('customer.customerId', 'name');
        console.log('Recent Invoices:', recentInvoices);

        console.log('Success!');
    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
