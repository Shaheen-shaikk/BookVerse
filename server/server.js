const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// ===============================
// CORS
// ===============================

const allowedOrigins = [
  "https://readora-frontend.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin
      // (Postman, curl, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

// ===============================
// Middleware
// ===============================

app.use(express.json());

// ===============================
// MongoDB Connection
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
  res.send("🚀 Readora Backend Running");
});

// ===============================
// Internet Archive IIIF Manifest
// ===============================

app.get(
  "/api/reader/manifest/:archiveId",
  async (req, res) => {
    try {
      const { archiveId } = req.params;

      if (!archiveId) {
        return res.status(400).json({
          message: "Archive ID is required",
        });
      }

      const manifestUrl =
        `https://iiif.archive.org/iiif/3/${archiveId}/manifest.json`;

      console.log(
        "📚 Fetching IIIF manifest:",
        manifestUrl
      );

      const response = await axios.get(
        manifestUrl,
        {
          timeout: 30000,
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error(
        "❌ IIIF manifest error:",
        error.response?.status ||
          error.message
      );

      res.status(500).json({
        message:
          "Unable to load Internet Archive manifest",

        error:
          error.response?.data ||
          error.message,
      });
    }
  }
);

// ===============================
// API Routes
// ===============================

app.use(
  "/api/books",
  bookRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);

// ===============================
// Server
// ===============================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});