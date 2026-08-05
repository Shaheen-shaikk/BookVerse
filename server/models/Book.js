const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    // Book cover image URL from Cloudinary
    image: {
      type: String,
      required: true,
    },

    // Book PDF URL from Cloudinary
    pdf: {
      type: String,
      default: "",
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
