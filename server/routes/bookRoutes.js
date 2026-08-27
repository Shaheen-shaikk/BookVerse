const express = require("express");
const router = express.Router();

const Book = require("../models/Book");
const User = require("../models/User");

// =====================================================
// GET ALL READORA BOOKS
// =====================================================
// =====================================================
// GET ALL BOOKS
// =====================================================
router.get("/", async (req, res) => {
  try {
    const books = await Book.find({}).sort({
      createdAt: -1,
    });

    res.json(books);
  } catch (err) {
    console.log("Get Books Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// =====================================================
// GET OPEN LIBRARY BOOKS
// =====================================================
router.get("/openlibrary", async (req, res) => {
  try {
    const search = req.query.search || "popular";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const url =
      `https://openlibrary.org/search.json` +
      `?q=${encodeURIComponent(search)}` +
      `&page=${page}` +
      `&limit=${limit}` +
      `&fields=key,title,author_name,first_publish_year,cover_i,edition_count,number_of_pages_median,language,ebook_access,ia`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        "Failed to fetch books from Open Library"
      );
    }

    const data = await response.json();

    const books = (data.docs || []).map((book) => {
      let readUrl = null;
let archiveId = null;

// Internet Archive readable copy
if (
  book.ia &&
  Array.isArray(book.ia) &&
  book.ia.length > 0
) {
  archiveId = book.ia[0];

  readUrl =
    `https://archive.org/details/${archiveId}`;
}

      return {
        externalId: book.key || null,

        title:
          book.title || "Unknown Title",

        author:
          book.author_name?.[0] ||
          "Unknown Author",

        category: "Open Library",

        description:
          "This book is available through the Open Library catalogue.",

        image: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : null,

        rating: 0,

        publishedYear:
          book.first_publish_year || null,

        pages:
          book.number_of_pages_median || null,

        language:
          book.language?.[0] || "English",

        source: "openlibrary",

archiveId,

readUrl,

ebookAccess:
  book.ebook_access || "no_ebook",
      };
    });

    res.json({
      books,
      page,
      limit,
      totalResults: data.numFound || 0,
    });
  } catch (err) {
    console.log("Open Library Error:", err);

    res.status(500).json({
      message:
        "Unable to fetch books from Open Library",
      error: err.message,
    });
  }
});

// =====================================================
// IMPORT OPEN LIBRARY BOOK INTO READORA
// =====================================================
router.post(
  "/import-openlibrary",
  async (req, res) => {
    try {
   const {
  externalId,
  title,
  author,
  category,
  description,
  image,
  rating,
  publishedYear,
  pages,
  language,
  readUrl,
  archiveId,
} = req.body;

      if (!externalId || !title || !author) {
        return res.status(400).json({
          message:
            "externalId, title and author are required",
        });
      }

      // Check if already imported
      const existingBook =
        await Book.findOne({
          externalId,
          source: "openlibrary",
        });

      if (existingBook) {
        return res.json({
          message:
            "Book already exists in Readora",
          book: existingBook,
        });
      }

      const newBook = new Book({
        externalId,

        title,

        author,

        category:
          category || "Open Library",

        description:
          description ||
          "This book is available through the Open Library catalogue.",

        image:
          image ||
          "https://via.placeholder.com/300x420?text=Book",

        rating: rating || 0,

        publishedYear,

        pages,

        language:
          language || "English",

      source: "openlibrary",

archiveId:
  archiveId ||
  (readUrl
    ? readUrl.split("/details/")[1]?.split("/")[0]
    : null),

readUrl:
  readUrl || null,
      });

      const savedBook =
        await newBook.save();

      res.status(201).json({
        message:
          "Open Library book added to Readora",

        book: savedBook,
      });
    } catch (err) {
      console.log(
        "Import Open Library Book Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// GET FAVORITES
// IMPORTANT: BEFORE /:id
// =====================================================
router.get(
  "/favorites/:userId",
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.userId
        ).populate("favorites");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json(
        user.favorites || []
      );
    } catch (err) {
      console.log(
        "Get Favorites Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// GET AUTHOR BOOKS
// IMPORTANT: BEFORE /:id
// =====================================================
router.get(
  "/author/:authorId",
  async (req, res) => {
    try {
      const books =
        await Book.find({
          authorId:
            req.params.authorId,
        }).sort({
          createdAt: -1,
        });

      res.json(books);
    } catch (err) {
      console.log(
        "Author Books Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// ADD TO FAVORITES
// =====================================================
router.put(
  "/favorite/:id",
  async (req, res) => {
    try {
      const { userId } = req.body;

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
          message: "User not found",
        });
      }

      const alreadyFavorite =
        user.favorites.some(
          (bookId) =>
            bookId.toString() ===
            req.params.id
        );

      if (!alreadyFavorite) {
        user.favorites.push(
          req.params.id
        );

        await user.save();
      }

      res.json({
        message:
          "Book added to favorites",

        favorites:
          user.favorites,
      });
    } catch (err) {
      console.log(
        "Add Favorite Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// REMOVE FAVORITE
// =====================================================
router.delete(
  "/favorite/:bookId/:userId",
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

      user.favorites =
        user.favorites.filter(
          (id) =>
            id.toString() !==
            bookId
        );

      await user.save();

      res.json({
        message:
          "Favorite removed",
      });
    } catch (err) {
      console.log(
        "Remove Favorite Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// ADD BOOK
// =====================================================
router.post("/", async (req, res) => {
  try {
    const book = new Book({
      ...req.body,

      // Author uploads are Readora books
      source:
        req.body.source ||
        "readora",
    });

    const savedBook =
      await book.save();

    res.status(201).json(
      savedBook
    );
  } catch (err) {
    console.log(
      "Add Book Error:",
      err
    );

    res.status(400).json({
      message: err.message,
    });
  }
});

// =====================================================
// UPDATE BOOK
// =====================================================
router.put(
  "/:id",
  async (req, res) => {
    try {
      const updatedBook =
        await Book.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedBook) {
        return res.status(404).json({
          message:
            "Book not found",
        });
      }

      res.json(updatedBook);
    } catch (err) {
      console.log(
        "Update Book Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// DELETE BOOK
// =====================================================
router.delete(
  "/:id",
  async (req, res) => {
    try {
      const deletedBook =
        await Book.findByIdAndDelete(
          req.params.id
        );

      if (!deletedBook) {
        return res.status(404).json({
          message:
            "Book not found",
        });
      }

      res.json({
        message:
          "Book deleted successfully",
      });
    } catch (err) {
      console.log(
        "Delete Book Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================================================
// GET SINGLE BOOK
// IMPORTANT: KEEP LAST
// =====================================================
router.get(
  "/:id",
  async (req, res) => {
    try {
      const book =
        await Book.findById(
          req.params.id
        );

      if (!book) {
        return res.status(404).json({
          message:
            "Book not found",
        });
      }

      res.json(book);
    } catch (err) {
      console.log(
        "Get Single Book Error:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

module.exports = router;