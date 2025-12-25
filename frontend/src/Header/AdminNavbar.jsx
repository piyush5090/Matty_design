import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="font-bold text-xl">
          <Link to="/adminDashboard">Admin Dashboard</Link>
        </div>
        <div className="space-x-4">
          <Link to="/adminDashboard">Home</Link>
          <Link to="/admin/templates">Templates</Link>
          <Link to="/admin/designs">Designs</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/addtemp">Add Template</Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
