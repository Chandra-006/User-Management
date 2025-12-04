/**
 * Database Configuration
 * Handles MongoDB connection using Mongoose ODM
 * 
 * This module exports a function that connects to MongoDB database
 * Connection string is read from environment variable MONGO_URI
 */

const mongoose = require("mongoose");

/**
 * Connect to MongoDB Database
 * 
 * Establishes connection to MongoDB using connection string from environment variables
 * Exits process if connection fails (prevents app from running without database)
 * 
 * @returns {Promise<void>} Resolves when connection is established
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from .env file
    // MONGO_URI format: mongodb://localhost:27017/database-name
    // Or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database-name
    await mongoose.connect(process.env.MONGO_URI);
    
    // Log success message when connected
    console.log("MongoDB connected");
  } catch (err) {
    // Log error details for debugging
    console.error("MongoDB connection error:", err);
    
    // Exit process with error code if connection fails
    // This prevents the application from running without a database connection
    process.exit(1);
  }
};

// Export connectDB function to be called in app.js
module.exports = connectDB;
