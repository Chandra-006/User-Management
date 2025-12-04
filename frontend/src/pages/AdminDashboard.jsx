import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUtils";

export default function AdminDashboard() {
  const { baseURL } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/users");
        const users = res.data.users || [];
        
        const totalUsers = users.length;
        const adminUsers = users.filter(u => u.role === "admin").length;
        const regularUsers = totalUsers - adminUsers;
        // Users are already sorted by createdAt desc from backend, just take first 5
        const recentUsers = users.slice(0, 5);

        setStats({
          totalUsers,
          adminUsers,
          regularUsers,
          recentUsers
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex bg-light" style={{ minHeight: "100vh" }}>
        <Sidebar />
        <div className="flex-grow-1">
          <Navbar />
          <div className="container mt-4">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "primary",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "Admin Users",
      value: stats.adminUsers,
      icon: "👨‍💼",
      color: "danger",
      bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "Regular Users",
      value: stats.regularUsers,
      icon: "👤",
      color: "success",
      bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  return (
    <div className="d-flex bg-light" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <div className="container-fluid mt-4 px-4">
          {/* Welcome Section */}
          <div className="mb-4">
            <h2 className="fw-bold text-dark mb-2">Dashboard Overview</h2>
            <p className="text-muted">Welcome back! Here's what's happening with your users.</p>
          </div>

          {/* Statistics Cards */}
          <div className="row g-4 mb-4">
            {statCards.map((card, idx) => (
              <div key={idx} className="col-md-4">
                <div 
                  className="card border-0 text-white shadow-sm h-100"
                  style={{ 
                    background: card.bgGradient,
                    borderRadius: "16px",
                    overflow: "hidden"
                  }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="mb-1 text-white-50 small fw-semibold text-uppercase">{card.title}</p>
                        <h2 className="mb-0 fw-bold">{card.value}</h2>
                      </div>
                      <div 
                        style={{ 
                          fontSize: "3rem",
                          opacity: 0.3,
                          lineHeight: 1
                        }}
                      >
                        {card.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Users & Quick Actions */}
          <div className="row g-4">
            {/* Recent Users */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 pt-4 px-4 pb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">Recent Users</h5>
                    <Link to="/users" className="btn btn-sm btn-outline-primary">
                      View All
                    </Link>
                  </div>
                </div>
                <div className="card-body px-4 pb-4">
                  {stats.recentUsers.length === 0 ? (
                    <p className="text-muted text-center py-4 mb-0">No users found</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead>
                          <tr className="text-muted small">
                            <th style={{ width: "50px" }}>Avatar</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentUsers.map((user) => (
                            <tr key={user._id}>
                              <td>
                                <img
                                  src={getImageUrl(baseURL, user.profile_image)}
                                  alt={user.name}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                  }}
                                  onError={(e) => {
                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23ddd' width='40' height='40'/%3E%3C/svg%3E";
                                  }}
                                />
                              </td>
                              <td className="fw-semibold">{user.name}</td>
                              <td className="text-muted small">{user.email}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    user.role === "admin"
                                      ? "bg-danger"
                                      : "bg-primary"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="text-end">
                                <Link
                                  to={`/users/view/${user._id}`}
                                  className="btn btn-sm btn-outline-info me-2"
                                >
                                  View
                                </Link>
                                <Link
                                  to={`/users/edit/${user._id}`}
                                  className="btn btn-sm btn-outline-warning"
                                >
                                  Edit
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white border-0 pt-4 px-4 pb-2">
                  <h5 className="fw-bold mb-0">Quick Actions</h5>
                </div>
                <div className="card-body px-4 pb-4">
                  <Link
                    to="/users"
                    className="btn btn-primary w-100 mb-3 d-flex align-items-center justify-content-between"
                  >
                    <span>👥 Manage All Users</span>
                    <span>→</span>
                  </Link>
                  <div className="list-group list-group-flush">
                    <div className="list-group-item border-0 px-0 py-2">
                      <small className="text-muted d-block mb-1">Total Users</small>
                      <strong>{stats.totalUsers}</strong>
                    </div>
                    <div className="list-group-item border-0 px-0 py-2">
                      <small className="text-muted d-block mb-1">Admins</small>
                      <strong className="text-danger">{stats.adminUsers}</strong>
                    </div>
                    <div className="list-group-item border-0 px-0 py-2">
                      <small className="text-muted d-block mb-1">Regular Users</small>
                      <strong className="text-primary">{stats.regularUsers}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Info Card */}
              <div className="card border-0 shadow-sm" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                <div className="card-body p-4 text-white">
                  <h6 className="fw-bold mb-3">System Status</h6>
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2">🟢</span>
                    <span className="small">All systems operational</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2">📊</span>
                    <span className="small">Database connected</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="me-2">🔒</span>
                    <span className="small">Security enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
