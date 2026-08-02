const express = require("express");
const router = express.Router();

const User = require("../models/User");

// ================================
// ADD / UPDATE READING STATUS
// ================================
router.put("/reading/:bookId", async (req, res) => {
  try {
    const { userId, status } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingBook = user.readingList.find(
      (item) => item.book.toString() === req.params.bookId
    );

    if (existingBook) {
      existingBook.status = status;
    } else {
      user.readingList.push({
        book: req.params.bookId,
        status,
      });
    }

    await user.save();

    res.json({
      message: "Reading status updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ================================
// GET READING LIST
// ================================
router.get("/reading/:userId", async (req, res) => {
  try {
    const user = await User.findById(
      req.params.userId
    ).populate("readingList.book");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user.readingList);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;