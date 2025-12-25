// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div
      className="relative w-full min-h-screen bg-center bg-cover bg-no-repeat flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: "url(/src/assets/home_back.jpg)",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>

      {/* Content */}
      <div className="relative z-10 px-6 max-w-4xl text-center animate-fadeUp">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            About Matty
          </span>
        </h1>

        <p className="text-base md:text-lg mb-8 text-white/90 leading-relaxed">
          <strong>Matty</strong> is your creative companion — a modern, online design tool built with the MERN stack, 
          giving you the power to create posters, banners, and social media visuals with ease. 
          No complicated software, no limits to your imagination.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-orange-400">Features</h2>
        <ul className="list-disc list-inside text-left mx-auto max-w-lg mb-8 text-white/85 space-y-2">
          <li>Canvas editor with shapes, images, and text tools</li>
          <li>Image uploads directly from your device</li>
          <li>Text customization with fonts, colors, and sizes</li>
          <li>Undo/Redo history control</li>
          <li>Save designs to your personal dashboard</li>
          <li>Secure JWT-based user authentication</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-orange-400">Our Mission</h2>
        <p className="mb-8 text-white/90">
          We’re here to make designing accessible for everyone — from students to social media managers.
          Matty’s simple yet powerful tools help you create beautiful designs, fast.
        </p>

        <p className="mt-8 text-sm text-white/60">
          © {new Date().getFullYear()} Matty. Built with ❤️ using React, Redux, TailwindCSS, and Node.js.
        </p>
      </div>
    </div>
  );
}
