import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';

export default function GLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(
        (import.meta.env.VITE_API_URL || `https://matty-backend-9q3f.onrender.com/`) + "/api/auth/google-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenId: credentialResponse.credential }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Google login failed.");
        return;
      }
      // Save full user object with _id and username!
      sessionStorage.setItem('user', JSON.stringify({
        _id: data._id,
        username: data.username,
        role: data.role,
        token: data.token
      }));
      sessionStorage.setItem('token', data.token);
      dispatch(setUser({
        _id: data._id,
        username: data.username,
        role: data.role,
        token: data.token
      }));
      // Confirm in console:
      console.log("After Google login:", JSON.parse(sessionStorage.getItem("user")));
      navigate('/dashboard');
    } catch (error) {
      alert("Google login failed due to network or server error.");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={() => alert('Google login failed')}
    />
  );
}
