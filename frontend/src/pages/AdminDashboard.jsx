// pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosinstance";
import { useDispatch } from "react-redux";
import { setAllUsers } from "../store/userSlice";
export default function AdminDashboard() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // fetch designs (admin)
  useEffect(() => {
    const fetchAllDesigns = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/admin/designs");
        setDesigns(res.data);
      } catch (err) {
        console.error("Error fetching all designs:", err);
        setDesigns([]);
      }
      setLoading(false);
    };
    fetchAllDesigns();
  }, []);

  // fetch users -> redux
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/api/admin/getUsers");
        if (res) dispatch(setAllUsers(res.data));
      } catch (error) {
        console.log("Error fetching allUsers", error);
      }
    };
    fetchUsers();
  }, [dispatch]);

  // delete a design (admin)
  const handleDelete = async (designId) => {
    if (!window.confirm("Delete this design?")) return;
    try {
      await axiosInstance.delete(`/api/admin/designs/${designId}`);
      setDesigns((prev) => prev.filter((d) => d._id !== designId));
      alert("Design deleted.");
    } catch (err) {
      alert("Failed to delete design.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-60px)] bg-gray-900 text-white pt-4">
      <div className="p-8 w-full max-w-5xl rounded bg-gray-800 shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>

        {/* Designs Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">All Users' Designs</h2>
          {loading ? (
            <p>Loading designs...</p>
          ) : designs.length === 0 ? (
            <p>No designs found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {designs.map((design) => (
                <div
                  key={design._id}
                  className="bg-gray-700 p-4 rounded shadow flex flex-col"
                >
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg mb-2">{design.name}</h3>
                    <p className="text-sm mb-1">
                      By: {design.username || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Shapes:{" "}
                      {Array.isArray(design.Shapes) ? design.Shapes.length : 0}
                    </p>
                    {design.thumbnailUrl ? (
                      <img
                        className="mt-2 rounded"
                        src={design.thumbnailUrl}
                        alt={design.name}
                      />
                    ) : null}
                  </div>
                  <button
                    onClick={() => handleDelete(design._id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded mt-4"
                  >
                    Delete Design
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
