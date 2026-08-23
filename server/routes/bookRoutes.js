const express = require("express");
const router = express.Router();

const Book = require("../models/Book");
const User = require("../models/User");

// ===========================
// GET ALL BOOKS
// ===========================
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.json(books);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ===========================
// GET FAVORITES
// IMPORTANT: Keep BEFORE /:id
// ===========================
router.get("/favorites/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("favorites");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user.favorites || []);
  } catch (err) {
    console.log("Get Favorites Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// ===========================
// GET MY BOOKS - AUTHOR
// IMPORTANT: Keep BEFORE /:id
// ===========================
router.get("/author/:authorId", async (req, res) => {
  try {
    const books = await Book.find({
      authorId: req.params.authorId,
    }).sort({ createdAt: -1 });

    res.json(books);
  } catch (err) {
    console.log("Author Books Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// ===========================
// ADD TO FAVORITES
// ===========================
router.put("/favorite/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyFavorite = user.favorites.some(
      (bookId) => bookId.toString() === req.params.id
    );

    if (!alreadyFavorite) {
      user.favorites.push(req.params.id);
      await user.save();
    }

    res.json({
      message: "Book added to favorites",
      favorites: user.favorites,
    });
  } catch (err) {
    console.log("Add Favorite Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// ===========================
// REMOVE FAVORITE
// ===========================
router.delete("/favorite/:bookId/:userId", async (req, res) => {
  try {
    const { bookId, userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== bookId
    );

    await user.save();

    res.json({
      message: "Favorite removed",
    });
  } catch (err) {
    console.log("Remove Favorite Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// ===========================
// ADD BOOK
// ===========================
router.post("/", async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
    });

    const savedBook = await book.save();

    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// ===========================
// UPDATE BOOK
// ===========================
router.put("/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ===========================
// DELETE BOOK
// ===========================
router.delete("/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(
      req.params.id
    );

    if (!deletedBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json({
      message: "Book deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ===========================
// GET SINGLE BOOK
// IMPORTANT: Keep LAST
// ===========================
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json(book);
  } catch (err) {
    console.log("Get Single Book Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;