// Routes/admin.js
const express = require("express");
const router = express.Router();
const Design = require("../Models/Designs");
const Template = require("../Models/Template");
const cloudinary = require("../Config/cloudinary");
const { authenticateAdmin } = require("../src/utilities/authenticateAdmin");
const User = require("../Models/User");

// Admin: view all designs
router.get("/designs", authenticateAdmin, async (_req, res) => {
  try {
    const designs = await Design.find().sort({ updatedAt: -1 });
    res.status(200).json(designs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching designs" });
  }
});

// Admin: delete a design
router.delete("/designs/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const design = await Design.findById(id);
    if (!design) return res.status(404).json({ message: "Design not found" });

    if (design.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(design.cloudinaryPublicId);
      } catch {}
    }
    await design.deleteOne();
    res.status(200).json({ message: "Design deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting design" });
  }
});

// Admin: add a new template (image upload)
router.post("/templates", authenticateAdmin, async (req, res) => {
  const { name, category, imageData } = req.body;

  try {
    if (!name || !category || !imageData) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const uploadResult = await cloudinary.uploader.upload(imageData, {
      folder: "matty/templates",
      resource_type: "image",
    });

    const newTemplate = new Template({
      name,
      category,
      imageUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
    });

    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error("Error adding template:", error);
    res.status(500).json({ message: "Error adding template" });
  }
});

// Admin: list all templates
router.get("/templates", authenticateAdmin, async (_req, res) => {
  try {
    const list = await Template.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error fetching templates" });
  }
});

// Admin: delete template
router.delete("/templates/:id", authenticateAdmin, async (req, res) => {
  try {
    const t = await Template.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Template not found" });

    if (t.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(t.cloudinaryPublicId);
      } catch {}
    }
    await t.deleteOne();
    res.json({ message: "Template deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting template" });
  }
});

// Admin: get all users
router.get("/getUsers",authenticateAdmin, async (req,res)=>{
 try {  
  const allUsers = await User.find();
  if(allUsers){
    res.status(201).send(allUsers);
  }
 } catch (error) {
  res.status(500).json({message: "Error fetching all users", error: error});
  console.log("Error fetching all users",error);
 }
});

//delete a user
router.delete("/deleteUser/:id", authenticateAdmin, async (req,res)=>{
  const { id } = req.params;
  try {
    const response = await User.findByIdAndDelete(id);
    if(response){
      res.json({message: "User deleted successfully"});
    }
  } catch (error) {
    console.log("Error deleting user",error);
  }
})



module.exports = router;
