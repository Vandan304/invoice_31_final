const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const customerRoutes = require('./routes/customer.routes');
const productRoutes = require('./routes/product.routes');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Invoice System API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/business', require('./routes/business.routes'));
app.use('/api/payments', require('./routes/payment.routes'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

module.exports = app;
