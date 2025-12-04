/**
 * User Model (Mongoose Schema)
 * Defines the structure and validation rules for User documents in MongoDB
 * 
 * This schema defines:
 * - Field types and validation rules
 * - Required fields
 * - Unique constraints
 * - Default values
 * - Automatic timestamps
 */

const mongoose = require("mongoose");

/**
 * User Schema Definition
 * 
 * Defines the structure of a User document with validation rules:
 * - Required fields: name, email, phone, password, state, city, country
 * - Unique fields: email, phone (prevents duplicates)
 * - Optional fields: profile_image, address, pincode, refreshToken
 * - Role-based: enum restricts role to "user" or "admin"
 * - Timestamps: automatically adds createdAt and updatedAt fields
 */
const UserSchema = new mongoose.Schema(
  {
    // User's full name - minimum 3 characters, alphabets only (enforced by validation middleware)
    name: { type: String, required: true, minlength: 3 },
    
    // Email address - must be unique, validated by express-validator
    email: { type: String, required: true, unique: true },
    
    // Phone number - must be unique, 10-15 digits (validated by validation middleware)
    phone: { type: String, required: true, unique: true },
    
    // Password - stored as bcrypt hash, never plain text
    // Actual validation (min 6 chars, must contain number) is done in validation middleware
    password: { type: String, required: true },
    
    // Profile image path - relative path like "uploads/filename.jpg"
    // Optional - defaults to null if not provided
    profile_image: { type: String, default: null },
    
    // Address - optional, maximum 150 characters
    address: { type: String, maxlength: 150 },
    
    // State - required field
    state: { type: String, required: true },
    
    // City - required field
    city: { type: String, required: true },
    
    // Country - required field
    country: { type: String, required: true },
    
    // Pincode - optional, 4-10 digits (validated by validation middleware)
    pincode: { type: String },
    
    // User role - restricted to "user" or "admin"
    // Default is "user" - new users are regular users by default
    role: { type: String, enum: ["user", "admin"], default: "user" },
    
    // Refresh token - stored for token validation and revocation
    // Optional - only set when user logs in
    refreshToken: { type: String, default: null }
  },
  {
    // Enable automatic timestamps
    // Mongoose automatically adds:
    // - createdAt: Date when document was created
    // - updatedAt: Date when document was last updated
    timestamps: true
  }
);

// Create and export User model
// "User" is the collection name (MongoDB will pluralize to "users")
module.exports = mongoose.model("User", UserSchema);
