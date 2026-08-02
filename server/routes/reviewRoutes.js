const express = require("express");
const router = express.Router();

const Review = require("../models/Review");

// =====================
// ADD REVIEW
// =====================
router.post("/", async (req, res) => {
  try {
    const review = new Review(req.body);

    await review.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// =====================
// GET REVIEWS
// =====================
router.get("/:bookId", async (req, res) => {
  try {
    const reviews = await Review.find({
      book: req.params.bookId,
    }).sort({
      createdAt: -1,
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// =====================
// DELETE REVIEW
// =====================
router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Review deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;