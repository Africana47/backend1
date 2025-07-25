require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const chatRoutes = require('./routes/chat');

// Database connection
const connectDB = require('./config/db');

// Error handlers
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const retirementRoutes = require('./routes/retirementRoutes');
const insuranceRoutes = require('./routes/insuranceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const benchmarkRoutes = require('./routes/benchmarkRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const documentRoutes = require('./routes/documentRoutes');
const auditRoutes = require('./routes/auditRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const poolRoutes = require('./routes/poolRoutes');
const portfolioRoutes = require('./routes/portfolio');

// Initialize Express
const app = express();

// 1. Connect DB
connectDB();

// 2. Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// 3. Rate Limiter
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
  })
);

// 4. ✅ CORS (FULL PATCH + preflight OPTIONS support)
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Allow preflight

// 5. Body Parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 6. Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 7. Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 8. Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/retirement', retirementRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/benchmark', benchmarkRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/pools', poolRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/ai', chatRoutes);

// 9. Error Handlers
app.use(notFound);
app.use(errorHandler);

// 10. Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// 11. Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error(`🔥 Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
