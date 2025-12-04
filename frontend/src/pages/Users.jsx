import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUtils";

export default function Users() {
  const { user: currentUser, baseURL } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/users?search=${encodeURIComponent(searchTerm)}`);
      setUsers(res.data.users || []);
      setFilteredUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      setCurrentPage(1);
      return;
    }

    const filtered = users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDelete = async (userId, userName) => {
    // Prevent deleting yourself
    if (userId === currentUser?.id) {
      alert("You cannot delete your own account!");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(userId);
    try {
      await axios.delete(`/api/users/${userId}`);
      alert("User deleted successfully!");
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete user");
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="d-flex bg-light" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <div className="container-fluid mt-4 px-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">All Users</h2>
              <p className="text-muted mb-0">Manage and monitor all registered users</p>
            </div>
            <div className="badge bg-primary fs-6 px-3 py-2">
              Total: {filteredUsers.length}
            </div>
          </div>

          {/* Search Bar */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-3">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">🔍</span>
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Search by name, email, state, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary border-0"
                    onClick={() => setSearchTerm("")}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              {loading ? (
                <div className="p-5 text-center">
                  <Loader />
                </div>
              ) : users.length === 0 ? (
                <div className="p-5 text-center text-muted">
                  <p className="mb-0">No users found</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "60px" }}>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>State</th>
                        <th>City</th>
                        <th>Role</th>
                        <th className="text-end" style={{ width: "200px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((u) => (
                        <tr key={u._id}>
                          <td>
                            <img
                              src={getImageUrl(baseURL, u.profile_image)}
                              alt={u.name}
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
                          <td className="fw-semibold">{u.name}</td>
                          <td className="text-muted small">{u.email}</td>
                          <td className="text-muted small">{u.phone || "-"}</td>
                          <td>{u.state || "-"}</td>
                          <td>{u.city || "-"}</td>
                          <td>
                            <span
                              className={`badge ${
                                u.role === "admin" ? "bg-danger" : "bg-primary"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="btn-group" role="group">
                              <Link
                                to={`/users/view/${u._id}`}
                                className="btn btn-sm btn-outline-info"
                                title="View"
                              >
                                👁️
                              </Link>
                              <Link
                                to={`/users/edit/${u._id}`}
                                className="btn btn-sm btn-outline-warning"
                                title="Edit"
                              >
                                ✏️
                              </Link>
                              <button
                                onClick={() => handleDelete(u._id, u.name)}
                                disabled={deleting === u._id || u._id === currentUser?.id}
                                className="btn btn-sm btn-outline-danger"
                                title={u._id === currentUser?.id ? "Cannot delete yourself" : "Delete"}
                              >
                                {deleting === u._id ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  "🗑️"
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {filteredUsers.length > usersPerPage && (
                <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center py-3">
                  <div className="text-muted small">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                  </div>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, idx) => {
                        const page = idx + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <li
                              key={page}
                              className={`page-item ${currentPage === page ? "active" : ""}`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </button>
                            </li>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <li key={page} className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          );
                        }
                        return null;
                      })}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
