import { useState } from "react";
import BackNextButtons from "../components/BackNextButtons";

function ExploreBooks() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // =========================
  // SEARCH BOOKS
  // =========================

  const searchBooks = async () => {
    if (!search.trim()) {
      alert("Please enter a book name.");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const url =
        `https://openlibrary.org/search.json` +
        `?q=${encodeURIComponent(search)}` +
        `&fields=*,availability` +
        `&limit=30`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(
          "Failed to fetch books"
        );
      }

      const data = await res.json();

      setBooks(data.docs || []);
    } catch (err) {
      console.log(
        "Open Library Error:",
        err
      );

      alert(
        "Failed to fetch books. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET COVER
  // =========================

  const getCover = (book) => {
    if (book.cover_i) {
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
    }

    return "https://via.placeholder.com/180x250?text=No+Cover";
  };

  // =========================
  // GET AUTHOR
  // =========================

  const getAuthor = (book) => {
    if (
      book.author_name &&
      book.author_name.length > 0
    ) {
      return book.author_name[0];
    }

    return "Unknown Author";
  };

  // =========================
  // CHECK BOOK AVAILABILITY
  // =========================

  const getAvailability = (book) => {
    if (!book.availability) {
      return "none";
    }

    if (
      book.availability.status ===
      "open"
    ) {
      return "open";
    }

    if (
      book.availability.status ===
      "borrow_available"
    ) {
      return "borrow";
    }

    if (
      book.availability.status ===
      "borrow_unavailable"
    ) {
      return "unavailable";
    }

    return "none";
  };

  // =========================
  // OPEN LIBRARY URL
  // =========================

  const getOpenLibraryUrl = (book) => {
    if (!book.key) {
      return "https://openlibrary.org";
    }

    return `https://openlibrary.org${book.key}`;
  };

  // =========================
  // READ URL
  // =========================

  const getReadUrl = (book) => {
    /*
      Open Library's search availability
      response can provide an Internet
      Archive identifier.

      We use it only when the book has
      an unrestricted "open" status.
    */

    if (
      book.availability &&
      book.availability.status ===
        "open" &&
      book.availability.identifier
    ) {
      return `https://archive.org/details/${book.availability.identifier}`;
    }

    return null;
  };

  // =========================
  // UI
  // =========================

  return (
    <div
      className="home"
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
        padding: "0 20px",
      }}
    >

      {/* =========================
          BACK / NEXT
      ========================== */}

      <BackNextButtons
        nextPath="/free-books"
        nextLabel="Free Books →"
      />

      {/* =========================
          HEADER
      ========================== */}

      <h1>
        🌐 Explore Books
      </h1>

      <p>
        Discover millions of books through
        Open Library.
      </p>

      {/* =========================
          SEARCH
      ========================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          margin: "25px 0",
          flexWrap: "wrap",
        }}
      >

        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchBooks();
            }
          }}
          style={{
            width: "350px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />

        <button
          type="button"
          onClick={searchBooks}
          style={{
            padding: "12px 22px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          🔍 Search
        </button>

      </div>

      {/* =========================
          LOADING
      ========================== */}

      {loading && (
        <div
          style={{
            textAlign: "center",
            margin: "40px",
          }}
        >
          <h2>
            📚 Finding books...
          </h2>
        </div>
      )}

      {/* =========================
          NO RESULTS
      ========================== */}

      {!loading &&
        searched &&
        books.length === 0 && (
          <div
            style={{
              textAlign: "center",
              margin: "50px",
            }}
          >
            <h2>
              😕 No books found
            </h2>

            <p>
              Try another title or author.
            </p>
          </div>
        )}

      {/* =========================
          BOOK GRID
      ========================== */}

      {!loading &&
        books.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "25px",
              marginTop: "30px",
            }}
          >

            {books.map(
              (book, index) => {
                const availability =
                  getAvailability(book);

                const readUrl =
                  getReadUrl(book);

                return (
                  <div
                    key={`${book.key}-${index}`}
                    style={{
                      border:
                        "1px solid #ddd",
                      borderRadius: "12px",
                      padding: "18px",
                      textAlign: "center",
                      background: "white",
                      boxShadow:
                        "0 3px 12px rgba(0,0,0,.08)",
                      display: "flex",
                      flexDirection:
                        "column",
                      alignItems:
                        "center",
                    }}
                  >

                    {/* =========================
                        COVER
                    ========================== */}

                    <img
                      src={getCover(book)}
                      alt={book.title}
                      style={{
                        width: "160px",
                        height: "230px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />

                    {/* =========================
                        TITLE
                    ========================== */}

                    <h3
                      style={{
                        marginTop: "15px",
                        minHeight: "50px",
                      }}
                    >
                      {book.title}
                    </h3>

                    {/* =========================
                        AUTHOR
                    ========================== */}

                    <p>
                      👤 {getAuthor(book)}
                    </p>

                    {/* =========================
                        YEAR
                    ========================== */}

                    <p>
                      📅{" "}
                      {book.first_publish_year ||
                        "N/A"}
                    </p>

                    {/* =========================
                        EDITIONS
                    ========================== */}

                    <p>
                      📚{" "}
                      {book.edition_count ||
                        0}{" "}
                      editions
                    </p>

                    {/* =========================
                        AVAILABILITY
                    ========================== */}

                    {availability ===
                      "open" && (
                      <p
                        style={{
                          color:
                            "green",
                          fontWeight:
                            "bold",
                        }}
                      >
                        🟢 Available to Read
                      </p>
                    )}

                    {availability ===
                      "borrow" && (
                      <p
                        style={{
                          color:
                            "#2563eb",
                          fontWeight:
                            "bold",
                        }}
                      >
                        🔵 Available to Borrow
                      </p>
                    )}

                    {availability ===
                      "unavailable" && (
                      <p
                        style={{
                          color:
                            "#dc2626",
                          fontWeight:
                            "bold",
                        }}
                      >
                        🔴 Currently Unavailable
                      </p>
                    )}

                    {availability ===
                      "none" && (
                      <p
                        style={{
                          color:
                            "#666",
                        }}
                      >
                        ⚪ No online copy
                      </p>
                    )}

                    {/* =========================
                        OPEN LIBRARY
                    ========================== */}

                    <a
                      href={getOpenLibraryUrl(
                        book
                      )}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration:
                          "none",
                        width: "100%",
                      }}
                    >
                      <button
                        type="button"
                        style={{
                          width:
                            "100%",
                          padding:
                            "10px",
                          marginTop:
                            "10px",
                          border:
                            "none",
                          borderRadius:
                            "8px",
                          background:
                            "#111827",
                          color:
                            "white",
                          cursor:
                            "pointer",
                        }}
                      >
                        🔎 View on Open Library
                      </button>
                    </a>

                    {/* =========================
                        READ BOOK
                    ========================== */}

                    {readUrl && (
                      <a
                        href={readUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration:
                            "none",
                          width: "100%",
                        }}
                      >
                        <button
                          type="button"
                          style={{
                            width:
                              "100%",
                            padding:
                              "10px",
                            marginTop:
                              "10px",
                            border:
                              "none",
                            borderRadius:
                              "8px",
                            background:
                              "#2563eb",
                            color:
                              "white",
                            cursor:
                              "pointer",
                          }}
                        >
                          📖 Read Book
                        </button>
                      </a>
                    )}

                  </div>
                );
              }
            )}

          </div>
        )}

      {/* =========================
          BOTTOM BACK / NEXT
      ========================== */}

      {books.length > 0 && (
        <BackNextButtons
          nextPath="/free-books"
          nextLabel="Free Books →"
        />
      )}

    </div>
  );
}

export default ExploreBooks;