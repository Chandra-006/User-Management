/**
 * Authentication Context
 * Provides authentication state and methods to all components
 * 
 * This context manages:
 * - User authentication state
 * - Login/logout functionality
 * - Token storage in localStorage
 * - Automatic navigation after login based on user role
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

// Create AuthContext for sharing auth state across components
export const AuthContext = createContext();

// Custom hook to access AuthContext
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider Component
 * Wraps the application and provides authentication context to all children
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components that need access to auth context
 */
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Initialize user state from localStorage if available
  // This allows user to stay logged in after page refresh
  // useState with function initializer runs only once on mount
  const [user, setUser] = useState(() => {
    try {
      // Try to parse user data from localStorage
      // localStorage stores strings, so we need to parse JSON
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      // If parsing fails (corrupted data), return null
      return null;
    }
  });

  // Sync user state with localStorage on mount
  // This ensures state is consistent with stored data
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  /**
   * Login Function
   * Authenticates user with email/phone and password
   * 
   * @param {string} identifier - Email or phone number
   * @param {string} password - User password
   * @returns {Promise<Object>} User object
   */
  const login = async (identifier, password) => {
    // Send login request to backend API
    const res = await axios.post("/api/auth/login", { identifier, password });
    
    // Extract user data and tokens from response
    const { user: u, accessToken, refreshToken } = res.data;

    // Store user data and tokens in localStorage
    // localStorage persists data across browser sessions
    localStorage.setItem("user", JSON.stringify(u));           // User info (name, email, role, etc.)
    localStorage.setItem("accessToken", accessToken);           // JWT access token (1 hour expiry)
    localStorage.setItem("refreshToken", refreshToken);         // JWT refresh token (7 days expiry)

    // Update user state in context
    // This triggers re-render of components using useAuth()
    setUser(u);

    // Navigate user based on their role
    // Admin users go to admin dashboard, regular users go to profile
    if (u.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/profile");
    }

    return u;
  };

  /**
   * Logout Function
   * Clears authentication data and redirects to login page
   */
  const logout = () => {
    // Remove all authentication data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Clear user state
    setUser(null);

    // Redirect to login page
    navigate("/login");
  };

  // Provide auth context value to all children
  // Components can access: user, login, logout, baseURL
  return (
    <AuthContext.Provider 
      value={{ 
        user,           // Current user object or null
        login,          // Login function
        logout,         // Logout function
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"  // API base URL
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
