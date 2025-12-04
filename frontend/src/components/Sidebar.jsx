import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUtils";

export default function Sidebar() {
  const { user, baseURL, logout } = useAuth();
  const loc = useLocation();
  const navigate = useNavigate();
  if (!user || user.role !== "admin") return null;

  const isActive = (p) => loc.pathname === p || loc.pathname.startsWith(p + "/");
  
  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/users", label: "Users", icon: "👥" }
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <div 
      style={{ 
        width: 280, 
        minHeight: "100vh", 
        background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)", 
        borderRight: "1px solid #e9ecef",
        boxShadow: "2px 0 15px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column"
      }} 
      className="p-4"
    >
      {/* Header */}
      <div className="mb-4 pb-4 border-bottom">
        <div className="d-flex align-items-center mb-3">
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              marginRight: "12px"
            }}
          >
            ⚡
          </div>
          <div>
            <h5 className="fw-bold text-dark mb-0" style={{ fontSize: "1.1rem" }}>
              Admin Panel
            </h5>
            <small className="text-muted">Control Center</small>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="d-flex flex-column gap-2 flex-grow-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-decoration-none p-3 rounded-3 d-flex align-items-center ${
              isActive(item.path)
                ? "text-white fw-semibold"
                : "text-dark"
            }`}
            style={{
              background: isActive(item.path)
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "transparent",
              transition: "all 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = "#f8f9fa";
                e.currentTarget.style.transform = "translateX(4px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateX(0)";
              }
            }}
          >
            <span className="me-3" style={{ fontSize: "1.2rem", width: "24px", textAlign: "center" }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
            {isActive(item.path) && (
              <span className="ms-auto">●</span>
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="mt-auto pt-4 border-top">
        <div 
          className="p-3 rounded-3 mb-3"
          style={{ background: "#f8f9fa", cursor: "pointer" }}
          onClick={() => navigate("/profile")}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e9ecef";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f8f9fa";
          }}
        >
          <div className="d-flex align-items-center">
            <img
              src={getImageUrl(baseURL, user.profile_image)}
              alt={user.name}
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #fff",
                marginRight: "12px"
              }}
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='45' height='45'%3E%3Crect fill='%23ddd' width='45' height='45'/%3E%3C/svg%3E";
              }}
            />
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <div className="fw-semibold text-dark small text-truncate">
                {user.name}
              </div>
              <div className="text-muted small text-truncate">
                {user.email}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
          style={{ borderRadius: "8px" }}
        >
          <span className="me-2">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}
