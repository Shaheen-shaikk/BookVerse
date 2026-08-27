import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function MyReading() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const navigate = useNavigate();

  const [readingList, setReadingList] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // FETCH READING LIST
  // =====================================================

  useEffect(() => {
    if (user?.id) {
      fetchReadingList();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchReadingList = async () => {
    try {
      const res = await API.get(
        `/users/reading/${user.id}`
      );

      setReadingList(res.data || []);
    } catch (err) {
      console.error(
        "Fetch Reading List Error:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REMOVE BOOK FROM READING LIST
  // =====================================================

  const removeFromReadingList = async (
    bookId
  ) => {
    try {
      await fetchReadingList();

      alert(
        "📚 You can change this book's status from its Book Details page."
      );
    } catch (err) {
      console.error(
        "Reading List Error:",
        err
      );
    }
  };

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!user) {
    return (
      <div className="home">

        <h1>
          📚 My Reading
        </h1>

        <p>
          Please login to manage your
          reading list.
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

        <h1>
          📚 My Reading
        </h1>

        <h2>
          Loading your reading list...
        </h2>

      </div>
    );
  }

  // =====================================================
  // FILTER BY STATUS
  // =====================================================

  const wishlist =
    readingList.filter(
      (item) =>
        item.status ===
        "Want to Read"
    );

  const currentlyReading =
    readingList.filter(
      (item) =>
        item.status ===
        "Reading"
    );

  const finishedBooks =
    readingList.filter(
      (item) =>
        item.status ===
        "Finished"
    );

  // =====================================================
  // BOOK CARD
  // =====================================================

  const BookCard = ({
    item,
    buttonText,
  }) => {
    const book = item.book;

    if (!book) {
      return null;
    }

    const isCurrentlyReading =
      item.status === "Reading";

    const handleBookAction = () => {
      if (isCurrentlyReading) {
        // DIRECTLY OPEN READER
        navigate(
          `/reader/${book._id}`
        );
      } else {
        // OPEN BOOK DETAILS
        navigate(
          `/books/${book._id}`
        );
      }
    };

    return (
      <div
        className="book-card"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >

        {/* =========================
            BOOK IMAGE
        ========================== */}

        <div
          className="book-image-container"
        >
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

        {/* =========================
            BOOK CONTENT
        ========================== */}

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

          <button
            className="view-btn"
            type="button"
            onClick={
              handleBookAction
            }
            style={{
              width: "100%",
            }}
          >
            {buttonText}
          </button>

        </div>

      </div>
    );
  };

  // =====================================================
  // SECTION
  // =====================================================

  const Section = ({
    title,
    emoji,
    books,
    emptyMessage,
    buttonText,
  }) => {
    return (
      <section
        style={{
          marginTop: "35px",
        }}
      >

        {/* =========================
            SECTION HEADER
        ========================== */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom:
              "15px",
          }}
        >

          <h2
            style={{
              margin: 0,
            }}
          >
            {emoji} {title}
          </h2>

          <span
            style={{
              fontWeight:
                "bold",
              color:
                "#666",
            }}
          >
            {books.length}
          </span>

        </div>

        {/* =========================
            EMPTY SECTION
        ========================== */}

        {books.length === 0 ? (
          <div
            style={{
              padding: "25px",
              textAlign:
                "center",
              background:
                "#f3f4f6",
              borderRadius:
                "10px",
            }}
          >
            <p>
              {emptyMessage}
            </p>
          </div>
        ) : (

          <div className="book-list">

            {books.map(
              (item) => (
                <BookCard
                  key={
                    item.book?._id
                  }
                  item={item}
                  buttonText={
                    buttonText
                  }
                />
              )
            )}

          </div>
        )}

      </section>
    );
  };

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="home">

      {/* =================================================
          PAGE TITLE
      ================================================= */}

      <h1>
        📚 My Reading
      </h1>

      <p>
        Manage the books you want
        to read, are currently
        reading, and have finished.
      </p>

      {/* =================================================
          WISHLIST
      ================================================= */}

      <Section
        title="Wishlist"
        emoji="❤️"
        books={wishlist}
        emptyMessage="No books in your wishlist yet."
        buttonText="📖 View Book"
      />

      {/* =================================================
          CURRENTLY READING
      ================================================= */}

      <Section
        title="Your Reading"
        emoji="📖"
        books={currentlyReading}
        emptyMessage="You are not currently reading any books."
        buttonText="📖 Continue Reading"
      />

      {/* =================================================
          FINISHED BOOKS
      ================================================= */}

      <Section
        title="Finished Books"
        emoji="✅"
        books={finishedBooks}
        emptyMessage="You haven't finished any books yet."
        buttonText="📚 View Book"
      />

    </div>
  );
}

export default MyReading;