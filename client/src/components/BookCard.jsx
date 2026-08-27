import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cards.css";
import API from "../services/api";

function BookCard({
  id,
  title,
  author,
  image,
  category,
  rating,
  publishedYear,
  source = "readora",
  readUrl,
  ebookAccess,
}) {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [favorite, setFavorite] = useState(false);
  const [bookmarked, setBookmarked] =
    useState(false);

  const [readingStatus, setReadingStatus] =
    useState("");

  const [loadingFavorite, setLoadingFavorite] =
    useState(false);

  const [loadingBookmark, setLoadingBookmark] =
    useState(false);

  const [loadingReadingStatus, setLoadingReadingStatus] =
    useState(false);

  const [loadingDetails, setLoadingDetails] =
    useState(false);

  // =====================================================
  // CHECK FAVORITE + BOOKMARK + READING STATUS
  // =====================================================
  useEffect(() => {
    if (user?.id && id) {
      checkFavorite();
      checkBookmark();
      checkReadingStatus();
    }
  }, [id]);

  // =====================================================
  // CHECK FAVORITE
  // =====================================================
  const checkFavorite = async () => {
    try {
      const res = await API.get(
        `/books/favorites/${user.id}`
      );

      const exists = res.data.some(
        (book) => book._id === id
      );

      setFavorite(exists);
    } catch (err) {
      console.log(
        "Check Favorite Error:",
        err
      );
    }
  };

  // =====================================================
  // CHECK BOOKMARK
  // =====================================================
  const checkBookmark = async () => {
    try {
      const res = await API.get(
        `/users/bookmarks/${user.id}`
      );

      const exists = res.data.some(
        (book) => book._id === id
      );

      setBookmarked(exists);
    } catch (err) {
      console.log(
        "Check Bookmark Error:",
        err
      );
    }
  };

  // =====================================================
  // CHECK READING STATUS
  // =====================================================
  const checkReadingStatus = async () => {
    try {
      const res = await API.get(
        `/users/reading/${user.id}`
      );

      const existing = res.data.find(
        (item) =>
          item.book?._id === id ||
          item.book?.title === title
      );

      if (existing) {
        setReadingStatus(existing.status);
      }
    } catch (err) {
      console.log(
        "Check Reading Status Error:",
        err
      );
    }
  };

  // =====================================================
  // IMPORT OPEN LIBRARY BOOK
  // =====================================================
  const importOpenLibraryBook = async () => {
    try {
      const res = await API.post(
        "/books/import-openlibrary",
        {
          externalId: id,
          title,
          author,
          category,
          description:
            "This book is available through the Open Library catalogue.",
          image,
          rating: rating || 0,
          publishedYear,
          pages: null,
          language: "English",
          readUrl: readUrl || null,
        }
      );

      return res.data.book;
    } catch (err) {
      console.log(
        "Import Open Library Error:",
        err
      );

      throw err;
    }
  };

  // =====================================================
  // GET MONGODB BOOK ID
  // =====================================================
  const getMongoBookId = async () => {
    if (source !== "openlibrary") {
      return id;
    }

    const importedBook =
      await importOpenLibraryBook();

    return importedBook._id;
  };

  // =====================================================
  // VIEW BOOK DETAILS
  // =====================================================
  const viewDetails = async () => {
    try {
      setLoadingDetails(true);

      // -----------------------------------------------
      // READORA BOOK
      // -----------------------------------------------
      if (source !== "openlibrary") {
        navigate(`/books/${id}`);
        return;
      }

      // -----------------------------------------------
      // OPEN LIBRARY BOOK
      // Import it first to get MongoDB ID
      // -----------------------------------------------
      const importedBook =
        await importOpenLibraryBook();

      navigate(
        `/books/${importedBook._id}`
      );
    } catch (err) {
      console.log(
        "View Details Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to open book details."
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  // =====================================================
  // ADD FAVORITE
  // =====================================================
  const addFavorite = async () => {
    if (!user?.id) {
      alert(
        "Please login first to add favorites ❤️"
      );
      return;
    }

    try {
      setLoadingFavorite(true);

      const mongoBookId =
        await getMongoBookId();

      await API.put(
        `/books/favorite/${mongoBookId}`,
        {
          userId: user.id,
        }
      );

      setFavorite(true);

      alert(
        "❤️ Added to Favorites"
      );
    } catch (err) {
      console.log(
        "Add Favorite Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to add favorite"
      );
    } finally {
      setLoadingFavorite(false);
    }
  };

  // =====================================================
  // REMOVE FAVORITE
  // =====================================================
  const removeFavorite = async () => {
    if (!user?.id) {
      alert("Please login first");
      return;
    }

    try {
      setLoadingFavorite(true);

      const mongoBookId =
        await getMongoBookId();

      await API.delete(
        `/books/favorite/${mongoBookId}/${user.id}`
      );

      setFavorite(false);

      alert(
        "💔 Removed from Favorites"
      );
    } catch (err) {
      console.log(
        "Remove Favorite Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to remove favorite"
      );
    } finally {
      setLoadingFavorite(false);
    }
  };

  // =====================================================
  // ADD BOOKMARK
  // =====================================================
  const addBookmark = async () => {
    if (!user?.id) {
      alert(
        "Please login first to bookmark books 🔖"
      );
      return;
    }

    try {
      setLoadingBookmark(true);

      const mongoBookId =
        await getMongoBookId();

      await API.put(
        `/users/bookmark/${mongoBookId}`,
        {
          userId: user.id,
        }
      );

      setBookmarked(true);

      alert(
        "🔖 Bookmarked successfully"
      );
    } catch (err) {
      console.log(
        "Add Bookmark Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to bookmark book"
      );
    } finally {
      setLoadingBookmark(false);
    }
  };

  // =====================================================
  // REMOVE BOOKMARK
  // =====================================================
  const removeBookmark = async () => {
    if (!user?.id) {
      alert("Please login first");
      return;
    }

    try {
      setLoadingBookmark(true);

      const mongoBookId =
        await getMongoBookId();

      await API.delete(
        `/users/bookmark/${mongoBookId}/${user.id}`
      );

      setBookmarked(false);

      alert(
        "🔖 Bookmark removed"
      );
    } catch (err) {
      console.log(
        "Remove Bookmark Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to remove bookmark"
      );
    } finally {
      setLoadingBookmark(false);
    }
  };

  // =====================================================
  // UPDATE READING STATUS
  // =====================================================
  const updateReadingStatus = async (
    status
  ) => {
    if (!user?.id) {
      alert("Please login first");
      return;
    }

    try {
      setLoadingReadingStatus(true);

      const mongoBookId =
        await getMongoBookId();

      await API.put(
        `/users/reading/${mongoBookId}`,
        {
          userId: user.id,
          status,
        }
      );

      setReadingStatus(status);

      alert(
        `📚 Reading status changed to "${status}"`
      );
    } catch (err) {
      console.log(
        "Update Reading Status Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update reading status"
      );
    } finally {
      setLoadingReadingStatus(false);
    }
  };

  // =====================================================
  // READ BOOK
  // =====================================================
  const readBook = async () => {
    if (!readUrl) {
      alert(
        "📚 No online reading copy is available for this book."
      );
      return;
    }

    try {
      const mongoBookId =
        await getMongoBookId();

      navigate(
        `/reader/${mongoBookId}`
      );
    } catch (err) {
      console.log(
        "Open Reader Error:",
        err
      );

      alert(
        "Unable to open the reader."
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="book-card">

      {/* =================================================
          BOOK IMAGE
      ================================================= */}

      <div className="book-image-container">

        <img
          src={
            image ||
            "https://via.placeholder.com/300x420?text=Book"
          }
          alt={title}
          className="book-image"
        />

        <span className="rating-badge">
          ⭐ {rating || "0.0"}
        </span>

        <span className="category-badge">
          {category || "Book"}
        </span>

      </div>

      {/* =================================================
          BOOK CONTENT
      ================================================= */}

      <div className="book-content">

        <h3>{title}</h3>

        <p className="author">
          ✍ {author || "Unknown Author"}
        </p>

        <p className="published">
          📅 {publishedYear || "N/A"}
        </p>

        {/* =================================================
            SOURCE
        ================================================= */}

        {source === "openlibrary" && (
          <p
            style={{
              fontSize: "13px",
              color: "#666",
            }}
          >
            🌐 Open Library
          </p>
        )}

        {/* =================================================
            VIEW DETAILS
        ================================================= */}

        {source !== "openlibrary" ? (
          <Link to={`/books/${id}`}>
            <button
              className="view-btn"
              type="button"
            >
              📖 View Details →
            </button>
          </Link>
        ) : (
          <button
            className="view-btn"
            type="button"
            onClick={viewDetails}
            disabled={loadingDetails}
          >
            {loadingDetails
              ? "Loading..."
              : "📖 View Details →"}
          </button>
        )}

        {/* =================================================
            FAVORITE
        ================================================= */}

        <button
          type="button"
          onClick={
            favorite
              ? removeFavorite
              : addFavorite
          }
          disabled={loadingFavorite}
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "8px",
            cursor: loadingFavorite
              ? "not-allowed"
              : "pointer",
            background: favorite
              ? "#dc2626"
              : "#f43f5e",
            color: "white",
          }}
        >
          {loadingFavorite
            ? "Saving..."
            : favorite
            ? "💔 Remove Favorite"
            : "❤️ Add Favorite"}
        </button>

        {/* =================================================
            BOOKMARK
        ================================================= */}

        <button
          type="button"
          onClick={
            bookmarked
              ? removeBookmark
              : addBookmark
          }
          disabled={loadingBookmark}
          style={{
            marginTop: "8px",
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "8px",
            cursor: loadingBookmark
              ? "not-allowed"
              : "pointer",
            background: bookmarked
              ? "#374151"
              : "#111827",
            color: "white",
          }}
        >
          {loadingBookmark
            ? "Saving..."
            : bookmarked
            ? "🔖 Remove Bookmark"
            : "🔖 Bookmark"}
        </button>

        {/* =================================================
            READING STATUS
        ================================================= */}

        {user && (
          <div
            style={{
              marginTop: "10px",
            }}
          >

            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              📚 Reading Status
            </label>

            <select
              value={readingStatus}
              onChange={(e) =>
                updateReadingStatus(
                  e.target.value
                )
              }
              disabled={
                loadingReadingStatus
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border:
                  "1px solid #ddd",
                cursor:
                  loadingReadingStatus
                    ? "not-allowed"
                    : "pointer",
                background: "white",
                fontSize: "14px",
              }}
            >

              <option
                value=""
                disabled
              >
                📚 Select Reading Status
              </option>

              <option value="Want to Read">
                🟡 Want to Read
              </option>

              <option value="Reading">
                🔵 Reading
              </option>

              <option value="Finished">
                🟢 Finished
              </option>

            </select>

          </div>
        )}

      </div>

    </div>
  );
}

export default BookCard;