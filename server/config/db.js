const mongoose = require('mongoose');

/**
 * Connect to MongoDB with connection pooling and error resilience
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agriconnect');
    console.log(`[AgriConnect] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[AgriConnect DB Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
