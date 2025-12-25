// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./Config/db");

dotenv.config(); // Load environment variables from .env file
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const allowedOrigins = [
    'http://localhost:5173',
    "https://matty-lilac.vercel.app",
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// app.use(
//   cors({
//     origin: "https://matty-lilac.vercel.app/",
//     "http://localhost:5173",
//   })
// );

// app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Import routes
const authRoutes = require("./Routes/auth");
const designRoutes = require("./Routes/designs");
const adminRoutes = require("./Routes/admin");
const templateRoutes = require("./Routes/templates"); // 👈 NEW

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/templates", templateRoutes); // 👈 NEW (public list)

// Basic route
app.get("/", (_req, res) => {
  res.send("✅ Matty API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
