const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// =====================================================
// CORS CONFIGURATION
// =====================================================

const corsOptions = {
  origin: [
    "https://readora-frontend.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// CORS middleware
app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options(/.*/, cors(corsOptions));

// =====================================================
// OTHER MIDDLEWARE
// =====================================================

app.use(express.json());

// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.send("🚀 Readora Backend Running");
});

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});