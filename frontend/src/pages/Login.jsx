import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(identifier.trim(), password);
    } catch (error) {
      setErr(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ background: "linear-gradient(135deg,#4e54c8,#8f94fb)" }}>
      <div className="card p-4" style={{ width: 420, borderRadius: 14, background: "rgba(255,255,255,0.08)" }}>
        <h3 className="text-center text-white mb-1">Welcome Back</h3>
        <p className="text-center text-white-50">Login to continue</p>
        {err && <div className="alert alert-danger">{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input className="form-control" placeholder="Email or phone" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} required />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-light w-100">Login</button>
        </form>
        <p className="text-center mt-3 text-white-50">Don't have account? <Link to="/register" className="text-white">Register</Link></p>
      </div>
    </div>
  );
}
