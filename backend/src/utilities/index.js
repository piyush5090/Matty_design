// src/utilities/index.js
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  // ✅ Dev backdoor: allow dummy-admin-token
  if (token === "dummy-admin-token") {
    req.user = { id: "admin-id", username: "matty_admin", role: "admin" };
    return next();
  }

  try {
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded._id || decoded.id,
      username: decoded.username,
      role: decoded.role || "user",
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { authenticateToken };
