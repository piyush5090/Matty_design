const express = require("express");
const router = express.Router();
const Template = require("../Models/Template");

// GET /api/templates (optionally filter by ?category=XYZ)
router.get("/", async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  try {
    const list = await Template.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error fetching templates" });
  }
});

// GET /api/templates/:id
router.get("/:id", async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: "Error fetching template" });
  }
});

module.exports = router;
