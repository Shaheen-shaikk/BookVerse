const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    // ================================
    // BASIC BOOK DETAILS
    // ================================
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    // ================================
    // READORA AUTHOR
    // ================================
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ================================
    // BOOK INFORMATION
    // ================================
    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    publishedYear: {
      type: Number,
    },

    pages: {
      type: Number,
    },

    language: {
      type: String,
      default: "English",
    },

    // ================================
    // OPEN LIBRARY / INTERNET ARCHIVE
    // ================================

    // Open Library work/edition ID
    externalId: {
      type: String,
      default: null,
    },

    // Internet Archive identifier
    // Example: dracula00stok_8
    archiveId: {
      type: String,
      default: null,
    },

    // Where the book came from
    source: {
      type: String,
      enum: ["readora", "openlibrary"],
      default: "readora",
    },

    // Existing Internet Archive page URL
    readUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Book",
  bookSchema
);