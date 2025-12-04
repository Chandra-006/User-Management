import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "linear-gradient(135deg,#4e54c8,#8f94fb)" }}>
      <div className="container-fluid">
        <span className="navbar-brand fw-bold">{user?.role === "admin" ? "Admin Panel" : "User Panel"}</span>
        <div className="d-flex align-items-center">
          <span className="text-white me-3">{user?.name}</span>
          <button className="btn btn-light btn-sm" onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
