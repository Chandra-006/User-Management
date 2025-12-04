import React, { useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k] || ""));
      if (file) fd.append("profile_image", file);
      await axios.post("/api/auth/register", fd, { headers: { "Content-Type": "multipart/form-data" }});
      nav("/login");
    } catch (e) {
      setErr(e?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ background: "linear-gradient(135deg,#4e54c8,#8f94fb)" }}>
      <div className="card p-4" style={{ width: 520, borderRadius: 14, background: "rgba(255,255,255,0.08)" }}>
        <h3 className="text-white">Create Account</h3>
        {err && <div className="alert alert-danger">{err}</div>}
        <form onSubmit={submit}>
          <div className="row">
            <div className="col-md-6 mb-2"><input name="name" onChange={handle} className="form-control" placeholder="Name" required/></div>
            <div className="col-md-6 mb-2"><input name="email" onChange={handle} className="form-control" placeholder="Email" required/></div>
          </div>
          <div className="mb-2"><input name="phone" onChange={handle} className="form-control" placeholder="Phone" required/></div>
          <div className="mb-2"><input name="password" type="password" onChange={handle} className="form-control" placeholder="Password" required/></div>
          <div className="row">
            <div className="col-md-4 mb-2"><input name="state" onChange={handle} className="form-control" placeholder="State" required/></div>
            <div className="col-md-4 mb-2"><input name="city" onChange={handle} className="form-control" placeholder="City" required/></div>
            <div className="col-md-4 mb-2"><input name="country" onChange={handle} className="form-control" placeholder="Country" required/></div>
          </div>
          <div className="mb-2"><input name="pincode" onChange={handle} className="form-control" placeholder="Pincode"/></div>
          <div className="mb-2"><input name="address" onChange={handle} className="form-control" placeholder="Address"/></div>
          <div className="mb-2"><input type="file" onChange={(e)=>setFile(e.target.files[0])} className="form-control"/></div>
          <button className="btn btn-light w-100">Register</button>
        </form>
      </div>
    </div>
  );
}
