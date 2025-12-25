import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosinstance";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/auth/register", {
        username,
        email,
        password,
      });

      const { token, username: userName, role, _id } = res.data;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem(
        "user",
        JSON.stringify({ _id, username: userName, role, token })
      );
      dispatch(setUser({ _id, username: userName, role, token }));

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl text-white font-bold mb-6 text-center">
          Register
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
              htmlFor="email"
              className="block mb-2 text-gray-300 font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="you@example.com"
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-gray-300 font-semibold"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Confirm your new password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-md transition-colors"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-red-600 hover:text-red-800 font-semibold"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
