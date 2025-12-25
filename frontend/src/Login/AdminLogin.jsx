import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setAdmin } from "../store/userSlice";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here we check the admin credentials (Hardcoded for now)
    if (username === "matty_admin" && password === "123456") {
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          _id: "admin-id",
          username: "matty_admin",
          role: "admin",
        })
      );
      sessionStorage.setItem("token", "dummy-admin-token");
      dispatch(setAdmin(true));
      // Redirect to admin dashboard
      navigate("/adminDashboard");
    } else {
      setError("Invalid admin username or password");
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-gray-900 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl text-white font-bold mb-6 text-center">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-gray-300 font-semibold"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter admin username"
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
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
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-md transition duration-300"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
