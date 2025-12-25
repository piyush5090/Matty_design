import React from "react";
import { Trash2, User } from "lucide-react";
import axiosInstance from "../utils/axiosinstance";
const token = sessionStorage.getItem("token");

const UserCard = ({ user, onDelete }) => {
  const handleDelete = async () => {
    console.log(user)
    try {
      await axiosInstance.delete(`/api/admin/deleteUser/${user._id}`,{
          headers: { Authorization: `Bearer ${token}` },
        });
      onDelete(user._id); 
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl rounded-2xl border border-gray-700 mb-6 p-5 transition transform hover:scale-[1.02] hover:shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-bold shadow-md">
          <User size={22} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white overflow-hidden ">{user.username}</h2>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1 text-gray-300 text-sm pl-1">
        <p>
          <span className="font-semibold text-gray-400">ID:</span> {user._id}
        </p>
        <p>
          <span className="font-semibold text-gray-400">Created:</span>{" "}
          {new Date(user.createdAt).toLocaleString()}
        </p>
        <p>
          <span className="font-semibold text-gray-400">Updated:</span>{" "}
          {new Date(user.updatedAt).toLocaleString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-5">
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition duration-200 shadow-md"
        >
          <Trash2 size={18} /> Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
