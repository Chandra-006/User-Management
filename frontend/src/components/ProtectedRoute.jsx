/**
 * Protected Route Component
 * Wraps routes that require authentication and/or specific roles
 * 
 * This component acts as a guard for protected routes:
 * - Checks if user is authenticated
 * - Checks if user has required role
 * - Redirects to login if not authenticated
 * - Redirects to profile if wrong role
 * 
 * Usage:
 * <ProtectedRoute roles={["admin"]}>
 *   <AdminComponent />
 * </ProtectedRoute>
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Component to render if user is authorized
 * @param {Array<string>} props.roles - Array of allowed roles (default: ["user", "admin"])
 * @returns {ReactNode} Either the protected component or redirect to login/profile
 */
export default function ProtectedRoute({ children, roles = ["user", "admin"] }) {
  // Get current user from AuthContext
  // user will be null if not logged in, or an object with user data if logged in
  const { user } = useAuth();

  // Check if user is authenticated
  // If no user, redirect to login page
  // replace prop replaces current history entry instead of adding new one
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  // If user's role is not in the allowed roles array, redirect to profile
  // This prevents unauthorized access (e.g., regular user accessing admin routes)
  if (!roles.includes(user.role)) {
    return <Navigate to="/profile" replace />;
  }

  // User is authenticated and has required role - render the protected component
  return children;
}
