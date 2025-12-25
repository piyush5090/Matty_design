import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosinstance";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const url = category
          ? `/api/templates?category=${encodeURIComponent(category)}`
          : "/api/templates";
        const res = await axiosInstance.get(url);
        setTemplates(res.data || []);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [category]);

  const handleTemplateClick = (templateId) => {
    navigate(`/editor?templateId=${templateId}`);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold">Templates</h1>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Filter by category"
          className="px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none"
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : templates.length === 0 ? (
        <p>No templates found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((t) => (
            <div
              key={t._id}
              className="bg-gray-800 rounded p-3 cursor-pointer hover:bg-gray-700 transition"
              onClick={() => handleTemplateClick(t._id)}
            >
              <div className="text-sm text-gray-300 mb-2">{t.category}</div>
              <div className="aspect-[5/3] overflow-hidden rounded border border-gray-700">
                {t.imageUrl ? (
                  <img
                    src={t.imageUrl}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div className="mt-2 font-semibold">{t.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
