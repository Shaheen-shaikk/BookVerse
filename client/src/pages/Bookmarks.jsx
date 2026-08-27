import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import BackNextButtons from "../components/BackNextButtons";

function Bookmarks() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [bookmarks, setBookmarks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // FETCH BOOKMARKS
  // =====================================================

  useEffect(() => {
    if (user?.id) {
      fetchBookmarks();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await API.get(
        `/users/bookmarks/${user.id}`
      );

      setBookmarks(res.data || []);
    } catch (err) {
      console.error(
        "Fetch Bookmarks Error:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REMOVE BOOKMARK
  // =====================================================

  const removeBookmark = async (bookId) => {
    try {
      await API.delete(
        `/users/bookmark/${bookId}/${user.id}`
      );

      setBookmarks(
        bookmarks.filter(
          (book) =>
            book._id !== bookId
        )
      );

      alert("🔖 Bookmark removed");
    } catch (err) {
      console.error(
        "Remove Bookmark Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to remove bookmark"
      );
    }
  };

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!user) {
    return (
      <div className="home">
         <BackNextButtons
      nextPath="/my-reading"
      nextLabel="My Reading →"
    />
        <h1>🔖 My Bookmarks</h1>

        <p>
          Please login to see your
          bookmarked books.
        </p>

        <Link to="/login">
          <button>
            Login
          </button>
        </Link>
      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="home">
        <h1>🔖 My Bookmarks</h1>

        <h2>
          Loading bookmarks...
        </h2>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="home">

      <h1>🔖 My Bookmarks</h1>

      <p>
        Books you saved to read later.
      </p>

      {/* =================================================
          NO BOOKMARKS
      ================================================= */}

      {bookmarks.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          <h2>
            No Bookmarks Yet 🔖
          </h2>

          <p>
            Go to the Books page
            and bookmark a book.
          </p>

          <Link to="/books">
            <button>
              📚 Browse Books
            </button>
          </Link>
        </div>
      ) : (
        <>
          <p>
            <strong>
              {bookmarks.length}
            </strong>{" "}
            bookmarked{" "}
            {bookmarks.length === 1
              ? "book"
              : "books"}
          </p>

          {/* =================================================
              BOOK GRID
          ================================================= */}

          <div className="book-list">

            {bookmarks.map(
              (book) => (
                <div
                  key={book._id}
                  className="book-card"
                >

                  {/* ===============================
                      IMAGE
                  ================================ */}

                  <div className="book-image-container">

                    <img
                      src={
                        book.image ||
                        "https://via.placeholder.com/300x420?text=Book"
                      }
                      alt={book.title}
                      className="book-image"
                    />

                    <span className="category-badge">
                      {book.category ||
                        "Book"}
                    </span>

                  </div>

                  {/* ===============================
                      CONTENT
                  ================================ */}

                  <div className="book-content">

                    <h3>
                      {book.title}
                    </h3>

                    <p className="author">
                      ✍{" "}
                      {book.author ||
                        "Unknown Author"}
                    </p>

                    <p className="published">
                      📅{" "}
                      {book.publishedYear ||
                        "N/A"}
                    </p>

                    {/* =========================
                        SOURCE
                    ========================== */}

                    {book.source ===
                      "openlibrary" && (
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#666",
                        }}
                      >
                        🌐 Open Library
                      </p>
                    )}

                    {/* =========================
                        READ BOOK
                    ========================== */}

                    {book.readUrl ? (
                      <Link
                        to={`/reader/${book._id}`}
                        style={{
                          textDecoration:
                            "none",
                        }}
                      >
                        <button
                          className="view-btn"
                          type="button"
                        >
                          📖 Read Book
                        </button>
                      </Link>
                    ) : (
                      <Link
                        to={`/books/${book._id}`}
                      >
                        <button
                          className="view-btn"
                          type="button"
                        >
                          View Details →
                        </button>
                      </Link>
                    )}

                    {/* =========================
                        REMOVE BOOKMARK
                    ========================== */}

                    <button
                      type="button"
                      onClick={() =>
                        removeBookmark(
                          book._id
                        )
                      }
                      style={{
                        marginTop: "10px",
                        width: "100%",
                        padding: "10px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        background: "#dc2626",
                        color: "white",
                      }}
                    >
                      💔 Remove Bookmark
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        </>
      )}

    </div>
  );
}

export default Bookmarks;