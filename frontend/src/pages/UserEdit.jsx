import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUtils";

export default function UserEdit(){
  const { id } = useParams();
  const nav = useNavigate();
  const { baseURL } = useAuth();

  const [form,setForm] = useState({});
  const [file,setFile] = useState(null);
  const [preview,setPreview] = useState(null);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    axios.get(`/api/users/${id}`).then(res=>{
      setForm(res.data.user);
      setPreview(getImageUrl(baseURL, res.data.user.profile_image));
    }).catch(console.error);
  },[id, baseURL]);

  const onFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k] || ""));
      if (file) fd.append("profile_image", file);
      await axios.put(`/api/users/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" }});
      nav("/users");
    } catch (err) { alert(err?.response?.data?.message || "Update failed"); }
    setLoading(false);
  };

  if (!form) return <div><Navbar/><div className="container mt-4"><Loader/></div></div>;

  return (
    <div className="d-flex bg-light">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <div className="container mt-4">
          <div className="card p-4">
            <h4>Edit User</h4>
            <form onSubmit={submit}>
              <div className="mb-3 text-center">
                <img src={preview || getImageUrl(baseURL, null)} style={{width:140,height:140,objectFit:"cover",borderRadius:12}} alt="preview" />
              </div>
              <div className="mb-3"><input className="form-control" value={form.name||""} onChange={e=>setForm({...form, name:e.target.value})} /></div>
              <div className="mb-3"><input className="form-control" value={form.email||""} onChange={e=>setForm({...form, email:e.target.value})} /></div>
              <div className="mb-3"><input type="password" className="form-control" placeholder="Leave blank to keep password" onChange={e=>setForm({...form, password:e.target.value})} /></div>
              <div className="mb-3">
                <select className="form-control" value={form.role||"user"} onChange={e=>setForm({...form, role:e.target.value})}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-3"><input type="file" className="form-control" onChange={onFile} /></div>
              <div className="d-flex gap-2"><button className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button><button type="button" className="btn btn-secondary" onClick={()=>nav("/users")}>Cancel</button></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
