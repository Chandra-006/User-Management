/**
 * Authentication Controller
 * Handles user registration, login, and token refresh operations
 */

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require("../utils/token.util");

/**
 * Register a new user
 * POST /api/auth/register
 * 
 * @param {Object} req - Express request object containing user data and optional file
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and user data (without password)
 */
exports.registerUser = async (req, res) => {
  try {
    // Extract user data from request body
    // req.body contains form data (name, email, phone, etc.)
    const { name, email, phone, password, address, state, city, country, pincode } = req.body;

    // Check if email already exists in database
    // Prevents duplicate email registrations
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if phone number already exists in database
    // Prevents duplicate phone registrations
    if (await User.findOne({ phone })) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    // Handle profile image upload
    // req.file is set by Multer middleware if a file was uploaded
    // Store relative path: uploads/<filename> for easy serving via static middleware
    const profile_image = req.file ? `uploads/${req.file.filename}` : null;

    // Hash password using bcrypt with 10 salt rounds
    // Never store plain text passwords - always hash them
    // 10 rounds is a good balance between security and performance
    const hashed = await bcrypt.hash(password, 10);

    // Create new user in database with hashed password
    // User.create() validates data according to User model schema
    const user = await User.create({
      name, email, phone, password: hashed, profile_image, address, state, city, country, pincode
    });

    // Return success response with user data (excluding sensitive information)
    // Never send password or refreshToken in response
    return res.status(201).json({
      success: true,
      message: "User registered",
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        profile_image: user.profile_image 
      }
    });
  } catch (err) {
    // Log error for debugging (don't expose internal errors to client)
    console.error("registerUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


/**
 * Login user with email/phone and password
 * POST /api/auth/login
 * 
 * @param {Object} req - Express request object containing identifier (email/phone) and password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with JWT tokens and user data
 */
exports.loginUser = async (req, res) => {
  try {
    // Extract identifier (email or phone) and password from request
    const { identifier, password } = req.body;

    // Find user by email OR phone number
    // $or operator allows searching in multiple fields
    // Case-insensitive search would require additional configuration
    const user = await User.findOne({ 
      $or: [
        { email: identifier }, 
        { phone: identifier }
      ] 
    });

    // If user not found, return generic error message
    // Don't reveal whether email/phone exists (security best practice)
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare provided password with hashed password in database
    // bcrypt.compare() handles the comparison securely
    const match = await bcrypt.compare(password, user.password);

    // If password doesn't match, return generic error
    // Same error message as above to prevent user enumeration
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT tokens for authenticated user
    // Access token: short-lived (1 hour) for API requests
    // Refresh token: long-lived (7 days) for getting new access tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in database for validation
    // This allows token revocation and prevents token reuse
    user.refreshToken = refreshToken;
    await user.save();

    // Return tokens and user data (without sensitive information)
    return res.json({
      success: true,
      accessToken,      // Client should store this and send in Authorization header
      refreshToken,     // Client should store this for token refresh
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        role: user.role,      // Used for role-based access control
        profile_image: user.profile_image 
      }
    });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Refresh access token using refresh token
 * POST /api/auth/refresh
 * 
 * This implements refresh token rotation - a new refresh token is issued each time
 * This prevents token reuse if a token is compromised
 * 
 * @param {Object} req - Express request object containing refreshToken
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with new access and refresh tokens
 */
exports.refreshToken = async (req, res) => {
  try {
    // Extract refresh token from request body
    const { refreshToken: token } = req.body;

    // Validate that token was provided
    if (!token) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Verify and decode the refresh token
    // Uses JWT_REFRESH_SECRET (different from access token secret)
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    
    // Find user by ID from decoded token
    const user = await User.findById(decoded.id);

    // Validate token matches stored token in database
    // This ensures token hasn't been revoked or replaced
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new tokens (token rotation)
    // Both access and refresh tokens are regenerated for security
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Update stored refresh token in database
    // Old token becomes invalid, new token is stored
    user.refreshToken = newRefreshToken;
    await user.save();

    // Return new tokens to client
    return res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    // Handle JWT verification errors (expired, invalid signature, etc.)
    console.error("refreshToken error:", err);
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};
