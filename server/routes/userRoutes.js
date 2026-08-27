const express = require("express");
const router = express.Router();

const User = require("../models/User");

// =====================================================
// ADD / UPDATE READING STATUS
// =====================================================

router.put(
  "/reading/:bookId",
  async (req, res) => {
    try {
      const {
        userId,
        status,
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          message:
            "User ID is required",
        });
      }

      const user =
        await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      const existingBook =
        user.readingList.find(
          (item) =>
            item.book.toString() ===
            req.params.bookId
        );

      if (existingBook) {
        existingBook.status =
          status;
      } else {
        user.readingList.push({
          book: req.params.bookId,
          status,
        });
      }

      await user.save();

      res.json({
        message:
          "Reading status updated",
      });
    } catch (err) {
      console.log(
        "Reading Status Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// GET READING LIST
// =====================================================

router.get(
  "/reading/:userId",
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.userId
        ).populate(
          "readingList.book"
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      res.json(
        user.readingList || []
      );
    } catch (err) {
      console.log(
        "Get Reading List Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// ADD / UPDATE READING HISTORY
// =====================================================

router.put(
  "/history/:bookId",
  async (req, res) => {
    try {
      const { userId } =
        req.body;

      if (!userId) {
        return res.status(400).json({
          message:
            "User ID is required",
        });
      }

      const user =
        await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      const existingBook =
        user.readingHistory.find(
          (item) =>
            item.book.toString() ===
            req.params.bookId
        );

      if (existingBook) {
        existingBook.lastReadAt =
          new Date();
      } else {
        user.readingHistory.push({
          book: req.params.bookId,
          lastReadAt:
            new Date(),
        });
      }

      await user.save();

      res.json({
        message:
          "Reading history updated",
        history:
          user.readingHistory,
      });
    } catch (err) {
      console.log(
        "Reading History Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// GET READING HISTORY
// =====================================================

router.get(
  "/history/:userId",
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.userId
        ).populate(
          "readingHistory.book"
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      const history = [
        ...(user.readingHistory ||
          []),
      ].sort(
        (a, b) =>
          new Date(
            b.lastReadAt
          ) -
          new Date(
            a.lastReadAt
          )
      );

      res.json(history);
    } catch (err) {
      console.log(
        "Get Reading History Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// REMOVE FROM READING HISTORY
// =====================================================

router.delete(
  "/history/:bookId/:userId",
  async (req, res) => {
    try {
      const {
        bookId,
        userId,
      } = req.params;

      const user =
        await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      user.readingHistory =
        user.readingHistory.filter(
          (item) =>
            item.book.toString() !==
            bookId
        );

      await user.save();

      res.json({
        message:
          "Removed from reading history",
      });
    } catch (err) {
      console.log(
        "Remove Reading History Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// ADD BOOKMARK
// =====================================================

router.put(
  "/bookmark/:bookId",
  async (req, res) => {
    try {
      const { userId } =
        req.body;

      if (!userId) {
        return res.status(400).json({
          message:
            "User ID is required",
        });
      }

      const user =
        await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      const alreadyBookmarked =
        user.bookmarks.some(
          (bookId) =>
            bookId.toString() ===
            req.params.bookId
        );

      if (!alreadyBookmarked) {
        user.bookmarks.push(
          req.params.bookId
        );

        await user.save();
      }

      res.json({
        message:
          "Book bookmarked successfully",
        bookmarks:
          user.bookmarks,
      });
    } catch (err) {
      console.log(
        "Add Bookmark Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// REMOVE BOOKMARK
// =====================================================

router.delete(
  "/bookmark/:bookId/:userId",
  async (req, res) => {
    try {
      const {
        bookId,
        userId,
      } = req.params;

      const user =
        await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      user.bookmarks =
        user.bookmarks.filter(
          (id) =>
            id.toString() !==
            bookId
        );

      await user.save();

      res.json({
        message:
          "Bookmark removed successfully",
      });
    } catch (err) {
      console.log(
        "Remove Bookmark Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// GET BOOKMARKS
// =====================================================

router.get(
  "/bookmarks/:userId",
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.userId
        ).populate(
          "bookmarks"
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      res.json(
        user.bookmarks || []
      );
    } catch (err) {
      console.log(
        "Get Bookmarks Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// GET USER PROFILE
// IMPORTANT: Keep this AFTER specific routes
// =====================================================

router.get(
  "/:id",
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        ).select(
          "-password"
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      res.json(user);
    } catch (err) {
      console.log(
        "Get User Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// UPDATE USER PROFILE
// =====================================================

router.put(
  "/:id",
  async (req, res) => {
    try {
      const {
        name,
        email,
      } = req.body;

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      user.name = name;
      user.email = email;

      await user.save();

      res.json(user);
    } catch (err) {
      console.log(
        "Update User Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

module.exports = router;