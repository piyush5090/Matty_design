// Routes/designs.js
const express = require("express");
const router = express.Router();
const Design = require("../Models/Designs");
const Template = require("../Models/Template");
const cloudinary = require("../Config/cloudinary");
const { authenticateToken } = require("../src/utilities");

// ---------------------------
// GET /api/designs?userId=...
// ---------------------------
router.get("/", authenticateToken, async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "userId is required" });

  if (req.user?.id && String(req.user.id) !== String(userId)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const designs = await Design.find({ createdBy: userId }).sort({
      updatedAt: -1,
    });
    res.json(designs);
  } catch (err) {
    console.error("GET designs error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------------------------
// POST /api/designs  (supports admin saving as template)
// body: { Shapes[], name, username, imageData?, asTemplate?:bool, category?:string }
// -----------------------------------------------------------
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { Shapes, name, username, imageData, asTemplate, category } =
      req.body;
    const createdBy = req.user?.id;

    if (!Array.isArray(Shapes) || Shapes.length === 0 || !name || !username) {
      return res.status(400).json({
        message: "Missing data",
        got: { Shapes, name, username },
      });
    }

    let uploadResult = null;

    if (typeof imageData === "string" && imageData.startsWith("data:image/")) {
      try {
        uploadResult = await cloudinary.uploader.upload(imageData, {
          folder: `matty/${createdBy}`,
        });
      } catch (err) {
        console.error("Cloudinary upload failed:", err.message);
      }
    }

    const doc = await Design.create({
      Shapes,
      name,
      createdBy,
      username,
      thumbnailUrl: uploadResult?.secure_url || "",
      assetUrl: uploadResult?.secure_url || "",
      cloudinaryPublicId: uploadResult?.public_id || "",
    });

    // If admin & asTemplate = true, create a Template too
    if (req.user.role === "admin" && asTemplate) {
      if (!category) {
        console.warn("Admin attempted to save template without category");
      } else if (!uploadResult?.secure_url) {
        console.warn(
          "No image uploaded; template will be created without image"
        );
      }
      await Template.create({
        name,
        category: category || "Uncategorized",
        imageUrl: uploadResult?.secure_url || "",
        cloudinaryPublicId: uploadResult?.public_id || "",
      });
    }

    return res.status(201).json(doc);
  } catch (error) {
    console.error("Error saving design:", error);
    return res.status(500).json({
      message: "Error saving design",
      error: error.message,
    });
  }
});

// -----------------------------------------------------------
// PUT /api/designs/:id
// -----------------------------------------------------------
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, Shapes, imageData } = req.body;

  try {
    const existing = await Design.findById(id);
    if (!existing) return res.status(404).json({ message: "Design not found" });

    if (req.user?.id && String(existing.createdBy) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = {};
    if (typeof name === "string") updates.name = name;
    if (Array.isArray(Shapes)) updates.Shapes = Shapes;

    if (
      imageData &&
      typeof imageData === "string" &&
      imageData.startsWith("data:")
    ) {
      if (existing.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(existing.cloudinaryPublicId);
        } catch {}
      }
      const newUpload = await cloudinary.uploader.upload(imageData, {
        folder: `matty/${existing.createdBy}`,
        resource_type: "image",
      });
      updates.thumbnailUrl = newUpload.secure_url;
      updates.assetUrl = newUpload.secure_url;
      updates.cloudinaryPublicId = newUpload.public_id;
    }

    const updated = await Design.findByIdAndUpdate(id, updates, { new: true });
    return res.json(updated);
  } catch (error) {
    console.error("PUT design error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------------------------
// DELETE /api/designs/:id
// -----------------------------------------------------------
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await Design.findById(id);
    if (!existing) return res.status(404).json({ message: "Design not found" });

    if (req.user?.id && String(existing.createdBy) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (existing.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(existing.cloudinaryPublicId);
      } catch (e) {
        console.warn("Cloudinary delete warning:", e?.message);
      }
    }

    await existing.deleteOne();
    res.status(200).json({ message: "Design deleted successfully" });
  } catch (error) {
    console.error("Error deleting design:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
