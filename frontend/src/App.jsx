/**
 * Main App Component
 * Defines all routes for the application using React Router
 * 
 * This component sets up client-side routing and protects routes based on user roles
 */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import page components
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Users from "./pages/Users";
import UserView from "./pages/UserView";
import UserEdit from "./pages/UserEdit";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * App Component
 * Main routing component that defines all application routes
 * 
 * Routes are protected using ProtectedRoute component which checks authentication
 * and role-based access control before rendering the component
 */
export default function App() {
  return (
    <Routes>
      {/* Public Routes - No authentication required */}
      
      {/* Login page - Public access */}
      <Route path="/login" element={<Login />} />
      
      {/* Registration page - Public access */}
      <Route path="/register" element={<Register />} />

      {/* Protected Routes - Require authentication */}
      
      {/* User Profile - Accessible by both regular users and admins */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute roles={["user", "admin"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard - Admin only */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Users List - Admin only */}
      <Route
        path="/users"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Users />
          </ProtectedRoute>
        }
      />

      {/* View Single User - Admin only */}
      {/* :id is a URL parameter that will be available in UserView component */}
      <Route
        path="/users/view/:id"
        element={
          <ProtectedRoute roles={["admin"]}>
            <UserView />
          </ProtectedRoute>
        }
      />

      {/* Edit User - Admin only */}
      {/* :id is a URL parameter that will be available in UserEdit component */}
      <Route
        path="/users/edit/:id"
        element={
          <ProtectedRoute roles={["admin"]}>
            <UserEdit />
          </ProtectedRoute>
        }
      />

      {/* Default Route - Redirects to login page */}
      {/* replace prop replaces the current entry in history instead of adding a new one */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
