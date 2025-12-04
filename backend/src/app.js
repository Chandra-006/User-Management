/**
 * Main Express Application Entry Point
 * This file sets up the Express server, middleware, routes, and starts the server
 */

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Connect to MongoDB database
connectDB();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// CORS (Cross-Origin Resource Sharing) - Allows frontend to make requests from different origin
// This enables the React app (running on different port) to communicate with the backend
app.use(cors());

// Helmet - Security middleware that sets various HTTP headers to protect the app
// Configured to allow cross-origin images (needed for profile images)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Morgan - HTTP request logger middleware
// Logs all incoming requests in development format (useful for debugging)
app.use(morgan("dev"));

// Express JSON parser - Parses incoming JSON requests and makes data available in req.body
app.use(express.json());

// Express URL-encoded parser - Parses URL-encoded data (form data)
// extended: false means it uses the classic querystring library
app.use(express.urlencoded({ extended: false }));

// Cookie Parser - Parses cookies attached to the client request object
app.use(cookieParser());

// Static File Serving - Serves uploaded profile images
// This makes the uploads folder accessible via HTTP at /uploads/filename.jpg
// No authentication required - images are public
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ============================================
// ROUTE HANDLERS
// ============================================

// Authentication routes - Handles registration, login, and token refresh
// All routes under /api/auth are handled by auth.routes.js
app.use("/api/auth", require("./routes/auth.routes"));

// User management routes - Handles CRUD operations for users
// All routes under /api/users are handled by users.routes.js
// Most routes require admin authentication
app.use("/api/users", require("./routes/users.routes"));

// ============================================
// SERVER STARTUP
// ============================================

// Get port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
