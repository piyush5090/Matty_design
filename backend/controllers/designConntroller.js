// controllers/designController.js
const Design = require("../Models/Designs");

exports.createDesign = async (req, res) => {
  try {
    const { name, Shapes, createdBy, username, thumbnailUrl, assetUrl } =
      req.body;

    const design = new Design({
      name,
      Shapes,
      createdBy,
      username,
      thumbnailUrl, // ✅ must be saved
      assetUrl, // ✅ optional
    });

    await design.save();

    res.status(201).json(design);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
