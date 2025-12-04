import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getImageUrl } from "../utils/imageUtils";

export default function Profile() {
  const { user, baseURL, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetch = async () => {
      try {
        const res = await axios.get(`/api/users/${user.id}`);
        setProfile(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [user]);

  if (!profile) return <div><Navbar /><div className="container mt-4"><Loader/></div></div>;

  const imageUrl = getImageUrl(baseURL, profile.profile_image);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3>Your Profile</h3>
        <div className="card p-4 mt-3">
          <div className="d-flex">
            <img src={imageUrl} alt="Profile" style={{width:120,height:120,objectFit:"cover",borderRadius:12,marginRight:20}}/>
            <div>
              <h4>{profile.name}</h4>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>Role:</strong> {profile.role}</p>
              <p className="text-muted">You cannot edit your profile. Contact admin.</p>
              <button className="btn btn-danger mt-3" onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
