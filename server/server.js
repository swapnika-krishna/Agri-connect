const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'AgriConnect Platform API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Resource API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/farms', require('./routes/farmRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/queries', require('./routes/queryRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 Route Catch-All
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[AgriConnect Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});
