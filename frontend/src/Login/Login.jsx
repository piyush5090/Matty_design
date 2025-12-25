import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GLogin from "../Login/GLogin.jsx";
import axiosInstance from "../utils/axiosinstance.js";

const CLIENT_ID =
  "551070839040-qh22gqelveth5aaiqfan1fm43v0tvs7s.apps.googleusercontent.com";

export default function Login() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/auth/login",{ username, password });
      //   (import.meta.env.VITE_API_URL || "https://matty-design-tool-uh85.onrender.com") +
      //     "/api/auth/login",
      //   { username, password }
      // );
      // const res = await axios.post(
      //   (import.meta.env.VITE_API_URL || "https://matty-design-tool-uh85.onrender.com") +
      //     "/api/auth/login",
      //   { username, password }
      // );

      const { token, _id, username: userName, role } = res.data;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem(
        "user",
        JSON.stringify({ _id, username: userName, role, token })
      );
      dispatch(setUser({ _id, username: userName, role, token }));

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl text-white font-bold mb-6 text-center">
          Matty
        </h1>
        <h2 className="text-3xl text-white font-bold mb-6 text-center">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-gray-300 font-semibold"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-gray-300 font-semibold"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-md transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          If not signup,{" "}
          <Link
            to="/register"
            className="text-red-600 hover:text-red-800 font-semibold"
          >
            Register here
          </Link>
        </p>
        <div className="mt-6 flex justify-center">
          <GoogleOAuthProvider clientId={CLIENT_ID}>
            <GLogin />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
}
