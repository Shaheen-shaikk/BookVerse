const express = require("express");
const router = express.Router();

const Book = require("../models/Book");
const User = require("../models/User");
const Review = require("../models/Review");

// ==========================
// GET DASHBOARD STATS
// ==========================
router.get("/stats", async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();

    const totalUsers = await User.countDocuments();

    const totalReviews = await Review.countDocuments();

    const users = await User.find();

    let totalFavorites = 0;

    users.forEach((user) => {
      totalFavorites += user.favorites.length;
    });

    res.json({
      books: totalBooks,
      users: totalUsers,
      reviews: totalReviews,
      favorites: totalFavorites,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;