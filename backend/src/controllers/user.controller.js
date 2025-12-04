/**
 * User Controller
 * Handles CRUD operations for user management (Admin only)
 */

const User = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * Get all users with optional search functionality
 * GET /api/users?search=query
 * 
 * Admin only - Requires authentication and admin role
 * 
 * @param {Object} req - Express request object
 * @param {string} req.query.search - Optional search query to filter users
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with array of users (without sensitive data)
 */
exports.getUsers = async (req, res) => {
  try {
    // Get search query from URL parameters (e.g., ?search=john)
    // Default to empty string if not provided
    const search = req.query.search || "";

    // Find users matching search criteria
    // $or operator searches across multiple fields
    // RegExp with "i" flag makes search case-insensitive
    // Searches in: name, email, state, city
    const users = await User.find({
      $or: [
        { name: new RegExp(search, "i") },      // Case-insensitive name search
        { email: new RegExp(search, "i") },      // Case-insensitive email search
        { state: new RegExp(search, "i") },      // Case-insensitive state search
        { city: new RegExp(search, "i") }        // Case-insensitive city search
      ]
    }).sort({ createdAt: -1 });  // Sort by creation date, newest first

    // Sanitize user data - remove sensitive information
    // Never send password or refreshToken to client
    const safe = users.map(u => ({
      _id: u._id, 
      name: u.name, 
      email: u.email, 
      phone: u.phone,
      profile_image: u.profile_image, 
      state: u.state, 
      city: u.city, 
      country: u.country, 
      pincode: u.pincode, 
      role: u.role,
      createdAt: u.createdAt  // Include creation date for sorting/filtering
    }));

    // Return sanitized user list
    res.json({ users: safe });
  } catch (err) {
    console.error("getUsers error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get a single user by ID
 * GET /api/users/:id
 * 
 * Requires authentication (user can view their own profile, admin can view any)
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.id - User ID from URL parameter
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data (without sensitive information)
 */
exports.getUserById = async (req, res) => {
  try {
    // Find user by MongoDB _id
    // req.params.id comes from URL (e.g., /api/users/507f1f77bcf86cd799439011)
    const u = await User.findById(req.params.id);

    // Return 404 if user not found
    if (!u) {
      return res.status(404).json({ message: "User not found" });
    }

    // Sanitize user data - exclude password and refreshToken
    // Include address field for detailed view
    const safe = {
      _id: u._id, 
      name: u.name, 
      email: u.email, 
      phone: u.phone,
      profile_image: u.profile_image, 
      address: u.address,      // Include address for detailed view
      state: u.state, 
      city: u.city, 
      country: u.country, 
      pincode: u.pincode, 
      role: u.role
    };

    // Return sanitized user data
    res.json({ user: safe });
  } catch (err) {
    console.error("getUserById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update user information
 * PUT /api/users/:id
 * 
 * Admin only - Requires authentication and admin role
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.id - User ID to update
 * @param {Object} req.body - Updated user data (name, email, phone, etc.)
 * @param {Object} req.file - Optional uploaded profile image file
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated user data
 */
exports.updateUser = async (req, res) => {
  try {
    // Copy all request body data to update object
    // Spread operator creates a new object to avoid mutating req.body
    const data = { ...req.body };

    // Handle profile image upload if file was provided
    // req.file is set by Multer middleware when file is uploaded
    // Store relative path for easy serving via static middleware
    if (req.file) {
      data.profile_image = "uploads/" + req.file.filename;
    }

    // Hash password if provided in update request
    // Only hash if password meets minimum length requirement
    // This allows updating user without changing password
    if (data.password && data.password.length >= 6) {
      // Hash new password with bcrypt (10 salt rounds)
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      // Remove password from update if not provided or invalid
      // Prevents accidentally clearing password
      delete data.password;
    }

    // Update user in database
    // { new: true } returns the updated document instead of the original
    // findByIdAndUpdate() updates the document and returns it
    const user = await User.findByIdAndUpdate(req.params.id, data, { new: true });

    // Return 404 if user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Sanitize response - exclude sensitive data
    const safe = {
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      phone: user.phone,
      profile_image: user.profile_image, 
      address: user.address, 
      state: user.state, 
      city: user.city, 
      country: user.country, 
      pincode: user.pincode, 
      role: user.role
    };

    // Return success response with updated user data
    res.json({ message: "User updated", user: safe });
  } catch (err) {
    console.error("updateUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a user
 * DELETE /api/users/:id
 * 
 * Admin only - Requires authentication and admin role
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.id - User ID to delete
 * @param {Object} req.user - Authenticated user (set by auth middleware)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 */
exports.deleteUser = async (req, res) => {
  try {
    // Security check: Prevent admin from deleting their own account
    // req.user.id is set by authMiddleware after JWT verification
    // This prevents accidental account deletion and maintains at least one admin
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    // Delete user from database
    // findByIdAndDelete() removes the document and returns it
    const u = await User.findByIdAndDelete(req.params.id);

    // Return 404 if user not found
    if (!u) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return success response
    // Note: Profile images are not automatically deleted
    // Consider adding cleanup logic for orphaned files
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
