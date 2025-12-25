import React from 'react';
import Navbar from './Navbar';
import {Link} from 'react-router-dom';
export default function GetStarted() {
  return (
    <>
    <Navbar />
    <div className="w-full h-screen bg-center bg-cover bg-no-repeat flex flex-col items-center justify-center text-white font-cursive text-shadow-md"
      style={{ backgroundImage: 'url(/src/assets/home_back.jpg)' }} >
      <h1 className="text-4xl md:text-6xl font-bold mb-3 text-red-700"> Welcome to Matty</h1>
      <p className="text-lg md:text-xl mb-8 tracking-wide max-w-xl text-white/90 text-center px-4">
        Create stunning graphics easily, effortlessly, and in beautiful dark mode. </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button type="button"
          className="px-8 py-3 rounded-3xl bg-red-700 text-white font-bold shadow-lg hover:bg-red-800 transition-colors"
        > <Link to='/Editor'>Start Designing</Link></button>
        <button type="button"
          className="px-8 py-3 rounded-3xl bg-black bg-opacity-50 border border-white text-white font-bold shadow-md hover:bg-opacity-70 transition-colors"
        >Browse Templates</button>
      </div>
    </div>
    </>
  );
}