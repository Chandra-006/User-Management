/**
 * Authentication Middleware
 * Handles JWT token verification and role-based access control
 */

const jwt = require("jsonwebtoken");

/**
 * Authentication Middleware
 * Verifies JWT access token from Authorization header
 * 
 * This middleware should be used on protected routes
 * It extracts the token, verifies it, and attaches user info to req.user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.authMiddleware = (req, res, next) => {
  try {
    // Extract Authorization header from request
    // Format: "Bearer <token>"
    const header = req.headers.authorization;

    // Check if Authorization header exists and follows Bearer token format
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token from "Bearer <token>" format
    // Split by space and take the second part (index 1)
    const token = header.split(" ")[1];

    // Verify JWT token using access token secret
    // jwt.verify() checks signature and expiration
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      // If verification fails (expired, invalid signature, etc.)
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      // Attach decoded token data to request object
      // decoded contains: { id: user._id, role: user.role, iat: issued_at, exp: expiration }
      // This makes user info available to subsequent middleware and route handlers
      req.user = decoded;

      // Call next middleware/route handler
      next();
    });
  } catch (err) {
    // Handle any unexpected errors
    return res.status(500).json({ message: "Auth failed" });
  }
};

/**
 * Admin Authorization Middleware
 * Checks if authenticated user has admin role
 * 
 * This middleware should be used AFTER authMiddleware
 * It ensures only admin users can access certain routes
 * 
 * @param {Object} req - Express request object (should have req.user from authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.adminMiddleware = (req, res, next) => {
  // Check if user is authenticated (req.user should exist from authMiddleware)
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Check if user has admin role
  // req.user.role is set from JWT token payload
  if (req.user.role !== "admin") {
    // Return 403 Forbidden (not 401 Unauthorized)
    // 403 = authenticated but not authorized
    // 401 = not authenticated
    return res.status(403).json({ message: "Admins only" });
  }

  // User is authenticated and is an admin - proceed to route handler
  next();
};
