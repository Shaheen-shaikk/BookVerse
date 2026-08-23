import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";
import Reviews from "../components/Reviews";

function BookDetails() {
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));

  const [book, setBook] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [status, setStatus] = useState("Want to Read");

  useEffect(() => {
    fetchBook();

    if (user?.id) {
      checkFavorite();
      checkBookmark();
      fetchReadingStatus();
    }
  }, [id]);

  // =========================
  // FETCH BOOK
  // =========================
  const fetchBook = async () => {
    try {
      const res = await API.get(`/books/${id}`);
      setBook(res.data);
    } catch (err) {
      console.log("Fetch Book Error:", err);
    }
  };

  // =========================
  // CHECK FAVORITE
  // =========================
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

  // =========================
  // CHECK BOOKMARK
  // =========================
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

  // =========================
  // FETCH READING STATUS
  // =========================
  const fetchReadingStatus = async () => {
    try {
      const res = await API.get(
        `/users/reading/${user.id}`
      );

      const current = res.data.find(
        (item) =>
          item.book &&
          item.book._id === id
      );

      if (current) {
        setStatus(current.status);
      }
    } catch (err) {
      console.log(
        "Reading Status Error:",
        err
      );
    }
  };

  // =========================
  // UPDATE READING STATUS
  // =========================
  const updateReadingStatus = async (value) => {
    if (!user?.id) {
      alert("Please Login First");
      return;
    }

    try {
      setStatus(value);

      await API.put(
        `/users/reading/${id}`,
        {
          userId: user.id,
          status: value,
        }
      );

      alert("📖 Reading status updated");
    } catch (err) {
      console.log(
        "Update Reading Status Error:",
        err
      );
    }
  };

  // =========================
  // ADD FAVORITE
  // =========================
  const addFavorite = async () => {
    if (!user?.id) {
      alert("Please Login First");
      return;
    }

    if (!book?._id) {
      alert("Book information not available");
      return;
    }

    try {
      await API.put(
        `/books/favorite/${book._id}`,
        {
          userId: user.id,
        }
      );

      setFavorite(true);

      alert("❤️ Added to Favorites");
    } catch (err) {
      console.log(
        "Add Favorite Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to add favorite"
      );
    }
  };

  // =========================
  // REMOVE FAVORITE
  // =========================
  const removeFavorite = async () => {
    if (!user?.id) {
      alert("Please Login First");
      return;
    }

    try {
      await API.delete(
        `/books/favorite/${book._id}/${user.id}`
      );

      setFavorite(false);

      alert("💔 Removed from Favorites");
    } catch (err) {
      console.log(
        "Remove Favorite Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to remove favorite"
      );
    }
  };

  // =========================
  // ADD BOOKMARK
  // =========================
  const addBookmark = async () => {
    if (!user?.id) {
      alert("Please Login First");
      return;
    }

    if (!book?._id) {
      alert("Book information not available");
      return;
    }

    try {
      await API.put(
        `/users/bookmark/${book._id}`,
        {
          userId: user.id,
        }
      );

      setBookmarked(true);

      alert("🔖 Bookmarked successfully");
    } catch (err) {
      console.log(
        "Add Bookmark Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to bookmark book"
      );
    }
  };

  // =========================
  // REMOVE BOOKMARK
  // =========================
  const removeBookmark = async () => {
    if (!user?.id) {
      alert("Please Login First");
      return;
    }

    try {
      await API.delete(
        `/users/bookmark/${book._id}/${user.id}`
      );

      setBookmarked(false);

      alert("🔖 Bookmark removed");
    } catch (err) {
      console.log(
        "Remove Bookmark Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to remove bookmark"
      );
    }
  };

  // =========================
  // LOADING
  // =========================
  if (!book) {
    return (
      <div className="home">
        <h2>Loading...</h2>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div
      className="home"
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* BOOK IMAGE */}
        <img
          src={
            book.image ||
            "https://via.placeholder.com/250x350?text=Book"
          }
          alt={book.title}
          style={{
            width: "250px",
            borderRadius: "12px",
            boxShadow:
              "0 5px 20px rgba(0,0,0,.2)",
          }}
        />

        {/* BOOK INFORMATION */}
        <div
          style={{
            flex: 1,
          }}
        >
          <h1>{book.title}</h1>

          <h2>{book.author}</h2>

          <p>⭐ {book.rating}</p>

          <p>
            <strong>Category:</strong>{" "}
            {book.category}
          </p>

          <p>
            <strong>Published:</strong>{" "}
            {book.publishedYear}
          </p>

          <p>
            <strong>Pages:</strong>{" "}
            {book.pages}
          </p>

          <p>
            <strong>Language:</strong>{" "}
            {book.language}
          </p>

          <br />

          {/* DESCRIPTION */}
          <h3>Description</h3>

          <p
            style={{
              lineHeight: "1.8",
            }}
          >
            {book.description}
          </p>

          <br />

          {/* READING STATUS */}
          <h3>📖 Reading Status</h3>

          <select
            value={status}
            onChange={(e) =>
              updateReadingStatus(
                e.target.value
              )
            }
            style={{
              padding: "10px",
              borderRadius: "8px",
              width: "220px",
            }}
          >
            <option>Want to Read</option>
            <option>Reading</option>
            <option>Finished</option>
          </select>

          <br />
          <br />

          {/* FAVORITE + BOOKMARK */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {/* FAVORITE BUTTON */}
            {favorite ? (
              <button
                type="button"
                onClick={removeFavorite}
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                💔 Remove Favorite
              </button>
            ) : (
              <button
                type="button"
                onClick={addFavorite}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                ❤️ Add Favorite
              </button>
            )}

            {/* BOOKMARK BUTTON */}
            {bookmarked ? (
              <button
                type="button"
                onClick={removeBookmark}
                style={{
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                🔖 Bookmarked
              </button>
            ) : (
              <button
                type="button"
                onClick={addBookmark}
                style={{
                  background: "#7c3aed",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                🔖 Bookmark
              </button>
            )}
          </div>
        </div>
      </div>

      <hr
        style={{
          margin: "50px 0",
        }}
      />

      {/* REVIEWS */}
      <Reviews bookId={book._id} />
    </div>
  );
}

export default BookDetails;