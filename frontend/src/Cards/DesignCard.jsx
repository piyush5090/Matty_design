// Cards/DesignCard.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedDesign,
  updateDesign as updateDesignAction,
  deleteDesign as deleteDesignAction,
  fetchDesigns,
} from "../store/designSlice";
import axiosInstance from "../utils/axiosinstance";
import { useNavigate } from "react-router-dom";

export default function DesignCard({ design }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(design.name || "Untitled Design");

  const user =
    useSelector((state) => state.user.user) ||
    JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId = user?._id;
  const token = sessionStorage.getItem("token");

  const handleOpenDesign = () => {
    dispatch(setSelectedDesign(design));
    navigate("/editor");
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await axiosInstance.delete(`/api/designs/${design._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (userId) dispatch(fetchDesigns(userId));
    } catch (err) {
      console.error("Error deleting design:", err);
      alert("Delete failed");
    }
  };

  const handleNameUpdate = async (e) => {
    e.stopPropagation();
    try {
      const res = await axiosInstance.put(
        `/api/designs/${design._id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(updateDesignAction(res.data));
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating design name:", err);
      alert("Rename failed");
    }
  };

  // Check for 'thumbnailUrl' first, fallback to other potential fields
  const imgSrc =
    design.thumbnailUrl || design.assetUrl || design.thumbnail || "";

  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-lg shadow hover:shadow-lg transition cursor-pointer p-4 flex flex-col gap-3"
      onClick={handleOpenDesign}
    >
      {/* thumbnail */}
      <div className="w-full aspect-video bg-gray-800 rounded-md overflow-hidden flex items-center justify-center">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={design.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-gray-500 text-sm">No thumbnail</span>
        )}
      </div>

      {/* meta + actions */}
      <div className="flex justify-between items-center">
        <div className="min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="border border-gray-700 bg-gray-800 text-white p-1 rounded"
            />
          ) : (
            <h2 className="font-semibold text-lg text-white truncate">
              {design.name}
            </h2>
          )}
          <p className="text-sm text-gray-400">
            {new Date(design.updatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={handleNameUpdate}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Save
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Rename
            </button>
          )}
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
