const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ================================
    // USER DETAILS
    // ================================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ================================
    // ROLE
    // ================================
    role: {
      type: String,
      enum: [
        "reader",
        "author",
        "admin",
      ],
      default: "reader",
    },

    // ================================
    // EMAIL VERIFICATION
    // ================================
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: null,
    },

    verificationExpires: {
      type: Date,
      default: null,
    },

    // ================================
    // FAVORITE BOOKS
    // ================================
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],

    // ================================
    // BOOKMARKED BOOKS
    // ================================
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],

    // ================================
    // READING LIST
    // ================================
    readingList: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },

        status: {
          type: String,
          enum: [
            "Want to Read",
            "Reading",
            "Finished",
          ],
          default: "Want to Read",
        },
      },
    ],

    // ================================
    // READING HISTORY
    // ================================
    readingHistory: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },

        lastReadAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);