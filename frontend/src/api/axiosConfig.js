/**
 * Axios Configuration
 * Sets up HTTP client with base URL and automatic token injection
 * 
 * This file configures axios to:
 * - Use the correct API base URL
 * - Automatically add JWT token to all requests
 * - Handle authentication headers consistently
 */

import axios from "axios";

// Get API base URL from environment variable or use default
// VITE_API_URL is set in .env file or docker-compose.yml
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance with base URL configuration
// All requests using this instance will automatically prepend baseURL
const axiosInstance = axios.create({
  baseURL,
});

/**
 * Request Interceptor
 * Automatically adds JWT token to all API requests
 * 
 * This interceptor runs before every HTTP request
 * It checks for access token in localStorage and adds it to Authorization header
 * This way, we don't need to manually add tokens to each API call
 */
axiosInstance.interceptors.request.use((config) => {
  // Get access token from localStorage
  // Token was stored here during login
  const token = localStorage.getItem("accessToken");

  // If token exists and config.headers is available, add Authorization header
  // Format: "Bearer <token>" (required by backend authMiddleware)
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Return modified config (with Authorization header)
  return config;
});

// Export baseURL for use in other components (e.g., image URLs)
export { baseURL };

// Export configured axios instance as default
// Use this instead of plain axios for all API calls
export default axiosInstance;
