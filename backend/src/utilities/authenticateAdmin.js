// src/utilities/authenticateAdmin.js
const { authenticateToken } = require("./index");

function authenticateAdmin(req, res, next) {
  // First run authenticateToken to populate req.user
  authenticateToken(req, res, function afterAuth() {
    if (req.user?.role === "admin") return next();
    return res.status(403).json({ message: "Admins only" });
  });
}

module.exports = { authenticateAdmin };
