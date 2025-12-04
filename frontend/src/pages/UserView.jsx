import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { getImageUrl } from "../utils/imageUtils";

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { baseURL, user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/users/${id}`)
      .then((res) => setUser(res.data.user))
      .catch(console.error);
  }, [id]);

  const handleDelete = async () => {
    // Prevent deleting yourself
    if (id === currentUser?.id) {
      alert("You cannot delete your own account!");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete user "${user.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await axios.delete(`/api/users/${id}`);
      alert("User deleted successfully!");
      navigate("/users");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete user");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (!user)
    return (
      <div>
        <Navbar />
        <div className="container mt-4">
          <Loader />
        </div>
      </div>
    );

  const img = getImageUrl(baseURL, user.profile_image);
  const canDelete = id !== currentUser?.id;

  return (
    <div className="d-flex bg-light">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <div className="container-fluid mt-4 px-4">
          <div className="mb-3">
            <Link to="/users" className="text-decoration-none text-muted">
              ← Back to Users
            </Link>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex flex-wrap align-items-start gap-4">
                <img
                  src={img}
                  alt="profile"
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 16,
                    objectFit: "cover",
                    border: "4px solid #f0f0f0"
                  }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h3 className="fw-bold mb-1">{user.name}</h3>
                      <span
                        className={`badge ${
                          user.role === "admin" ? "bg-danger" : "bg-primary"
                        } fs-6 px-3 py-2`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/users/edit/${user._id}`}
                        className="btn btn-warning"
                      >
                        ✏️ Edit User
                      </Link>
                      {canDelete && (
                        <button
                          onClick={handleDelete}
                          disabled={deleting}
                          className="btn btn-danger"
                        >
                          {deleting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              🗑️ Delete User
                            </>
                          )}
                        </button>
                      )}
                      {!canDelete && (
                        <button
                          className="btn btn-secondary"
                          disabled
                          title="You cannot delete your own account"
                        >
                          🗑️ Delete (Disabled)
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="row g-3 mt-2">
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted d-block mb-1">Email</small>
                        <strong>{user.email}</strong>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted d-block mb-1">Phone</small>
                        <strong>{user.phone || "-"}</strong>
                      </div>
                    </div>
                    {user.address && (
                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded">
                          <small className="text-muted d-block mb-1">Address</small>
                          <strong>{user.address}</strong>
                        </div>
                      </div>
                    )}
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted d-block mb-1">State</small>
                        <strong>{user.state || "-"}</strong>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted d-block mb-1">City</small>
                        <strong>{user.city || "-"}</strong>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted d-block mb-1">Country</small>
                        <strong>{user.country || "-"}</strong>
                      </div>
                    </div>
                    {user.pincode && (
                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded">
                          <small className="text-muted d-block mb-1">Pincode</small>
                          <strong>{user.pincode}</strong>
                        </div>
                      </div>
                    )}
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
