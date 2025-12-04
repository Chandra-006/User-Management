/**
 * Token Utility Functions
 * Handles JWT token generation for authentication
 */

const jwt = require("jsonwebtoken");

/**
 * Generate Access Token
 * Short-lived token (1 hour) used for API authentication
 * 
 * Access tokens are sent with every API request in Authorization header
 * Short expiration time limits damage if token is compromised
 * 
 * @param {Object} user - User object from database
 * @param {string} user._id - User's MongoDB ID
 * @param {string} user.role - User's role (user/admin)
 * @returns {string} JWT access token
 */
exports.generateAccessToken = (user) => {
  // Sign JWT token with user ID and role
  // Payload: { id: user._id, role: user.role }
  // Secret: JWT_ACCESS_SECRET from environment variables
  // Expiration: 1 hour (3600 seconds)
  return jwt.sign(
    { id: user._id, role: user.role },  // Token payload (data stored in token)
    process.env.JWT_ACCESS_SECRET,      // Secret key for signing (must match verification)
    { expiresIn: "1h" }                  // Token expiration time
  );
};

/**
 * Generate Refresh Token
 * Long-lived token (7 days) used to obtain new access tokens
 * 
 * Refresh tokens are stored in database and can be revoked
 * Used when access token expires to get a new one without re-login
 * 
 * @param {Object} user - User object from database
 * @param {string} user._id - User's MongoDB ID
 * @param {string} user.role - User's role (user/admin)
 * @returns {string} JWT refresh token
 */
exports.generateRefreshToken = (user) => {
  // Sign JWT token with user ID and role
  // Uses different secret (JWT_REFRESH_SECRET) for additional security
  // Longer expiration (7 days) since it's used less frequently
  return jwt.sign(
    { id: user._id, role: user.role },  // Token payload
    process.env.JWT_REFRESH_SECRET,      // Different secret for refresh tokens
    { expiresIn: "7d" }                  // Token expiration: 7 days
  );
};
