// pages/AddTemplate.jsx
import React, { useState } from "react";
import axiosInstance from "../utils/axiosinstance";
import { useNavigate } from "react-router-dom";

export default function AddTemplate() {
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState("");
  const [imageData, setImageData] = useState(null);
  const [tplError, setTplError] = useState("");
  const [tplLoading, setTplLoading] = useState(false);

  const navigate = useNavigate();

  const onPickImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageData(reader.result);
    reader.readAsDataURL(f);
  };

  const handleAddTemplate = async (e) => {
    e.preventDefault();
    setTplError("");
    if (!newTemplateName || !newTemplateCategory || !imageData) {
      setTplError("Please fill all fields and upload an image.");
      return;
    }
    setTplLoading(true);
    try {
      const res = await axiosInstance.post("/api/admin/templates", {
        name: newTemplateName,
        category: newTemplateCategory,
        imageData,
      });
      navigate("/editor", { state: { template: res.data } });
    } catch (err) {
      console.error(err);
      setTplError("Failed to add template.");
    } finally {
      setTplLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Add Official Template
        </h2>

        {tplError && (
          <div className="bg-red-600 text-white px-4 py-2 rounded mb-4 text-center">
            {tplError}
          </div>
        )}

        <form onSubmit={handleAddTemplate} className="space-y-5">
          <input
            type="text"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            placeholder="Template Name"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={newTemplateCategory}
            onChange={(e) => setNewTemplateCategory(e.target.value)}
            placeholder="Template Category"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            onChange={onPickImage}
            accept="image/*"
            required
            className="w-full text-white"
          />

          <button
            type="submit"
            disabled={tplLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {tplLoading ? "Adding..." : "Add Template"}
          </button>
        </form>
      </div>
    </section>
  );
}
