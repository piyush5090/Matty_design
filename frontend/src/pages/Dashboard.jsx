// pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDesigns } from "../store/designSlice";
import DesignCard from "../Cards/DesignCard";

export default function Dashboard() {
  const dispatch = useDispatch();

  // ✅ safe defaults to avoid "undefined.length"
  const { list: designs = [], status } = useSelector(
    (state) => state.designs || {}
  );

  const user =
    useSelector((state) => state.user.user) ||
    JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchDesigns(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">My Designs</h1>

      {status === "loading" ? (
        <p className="text-gray-400">Loading...</p>
      ) : designs.length === 0 ? (
        <p className="text-gray-400">No designs saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {designs.map((design) => (
            <DesignCard key={design._id} design={design} />
          ))}
        </div>
      )}
    </div>
  );
}
