const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String },
    shapes: { type: Array, default: [] }, // Array of fabric.js shape JSON
    imageUrl: { type: String }, // For preview in template gallery (optional)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // ...add any other fields you want
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", templateSchema);
