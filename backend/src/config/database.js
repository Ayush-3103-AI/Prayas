const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Atlas connection options
    const options = {
      // These options are default in Mongoose 7.x but kept for compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Additional options for MongoDB Atlas
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('\n📋 Troubleshooting Steps:');
    console.error('1. If using local MongoDB:');
    console.error('   - Install MongoDB: https://www.mongodb.com/try/download/community');
    console.error('   - Start MongoDB service: net start MongoDB (Windows) or mongod (Linux/Mac)');
    console.error('2. If using MongoDB Atlas (Recommended - No installation needed):');
    console.error('   - Sign up at: https://www.mongodb.com/cloud/atlas/register');
    console.error('   - Create a free cluster');
    console.error('   - Get connection string and update MONGODB_URI in .env file');
    console.error('   - Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prayas');
    console.error('\n💡 Quick Fix: Update MONGODB_URI in .env file with your MongoDB Atlas connection string');
    process.exit(1);
  }
};

module.exports = connectDB;

