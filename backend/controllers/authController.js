const jwt = require("jsonwebtoken");
const User = require("../Models/User"); // Ensure the correct path to your User model

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Default to "user" role if not provided
    const userRole = role || "user";
    const user = new User({ username, email, password, role: userRole });

    await user.save();

    const token = jwt.sign(
      { _id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      _id: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      _id: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
