import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import '../index.css'
import axiosInstance from "../utils/axiosinstance"
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";

export default function GetStarted() {

  const dispatch = useDispatch();

//   useEffect(() => {
//   const fetchUser = async () => {
//     try {
//       const res = await axiosInstance.get("api/auth/getUser");
//       dispatch(setUser(res.data));
//     } catch (error) {
//       console.log(error); 
//     }
//   };

//   fetchUser();
// }, []);


  return (
    <div
      className="relative w-full h-screen bg-center bg-cover bg-no-repeat flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: "url(/src/assets/home_back.jpg)",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl animate-fadeUp">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
          <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            Welcome to Matty
          </span>
        </h1>

        <p className="text-base md:text-lg mb-10 text-white/90 leading-relaxed">
          Create stunning graphics with ease and elegance. Enjoy the comfort of dark mode while unleashing your creativity.
        </p>

        {/* Buttons */}
        <div className="flex gap-5 flex-wrap justify-center">
          <Link
            to="/register"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-pink-500 font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>
          <button className="px-8 py-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-md font-medium hover:bg-white/20 transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
