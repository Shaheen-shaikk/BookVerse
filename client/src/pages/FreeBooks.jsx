import { useState } from "react";
import BackNextButtons from "../components/BackNextButtons";

function FreeBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // SEARCH FREE BOOKS
  // =====================================================

  const searchBooks = async () => {
    try {
      setLoading(true);

      const url = search.trim()
        ? `https://gutendex.com/books?search=${encodeURIComponent(
            search
          )}`
        : "https://gutendex.com/books";

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(
          "Failed to fetch books"
        );
      }

      const data = await res.json();

      setBooks(data.results || []);
    } catch (err) {
      console.log(
        "Gutendex Error:",
        err
      );

      alert("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">

      {/* =================================================
          BACK / NEXT
      ================================================= */}

      <BackNextButtons
        nextPath="/bookmarks"
        nextLabel="Bookmarks →"
      />

      {/* =================================================
          HEADER
      ================================================= */}

      <h1>
        📜 Free Books
      </h1>

      <p>
        Read thousands of free
        public-domain books.
      </p>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          margin: "25px 0",
        }}
      >

        <input
          type="text"
          placeholder="Search free books..."
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
          }}
        />

        <button
          type="button"
          onClick={searchBooks}
        >
          🔍 Search
        </button>

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <h2>
          Loading...
        </h2>
      )}

      {/* =================================================
          BOOK GRID
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >

        {books.map((book) => (

          <div
            key={book.id}
            style={{
              border:
                "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,.1)",
            }}
          >

            {/* =========================
                COVER
            ========================== */}

            <img
              src={
                book.formats[
                  "image/jpeg"
                ] ||
                "https://via.placeholder.com/180x250?text=No+Cover"
              }
              alt={book.title}
              style={{
                width: "160px",
                height: "230px",
                objectFit: "cover",
              }}
            />

            {/* =========================
                TITLE
            ========================== */}

            <h3>
              {book.title}
            </h3>

            {/* =========================
                AUTHOR
            ========================== */}

            <p>
              👤{" "}
              {book.authors.length > 0
                ? book.authors[0].name
                : "Unknown"}
            </p>

            {/* =========================
                BOOK ACTIONS
            ========================== */}

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "10px",
                marginTop: "15px",
              }}
            >

              {/* READ ONLINE */}

              {book.formats[
                "text/html"
              ] && (
                <a
                  href={
                    book.formats[
                      "text/html"
                    ]
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <button
                    type="button"
                  >
                    📖 Read Online
                  </button>
                </a>
              )}

              {/* DOWNLOAD EPUB */}

              {book.formats[
                "application/epub+zip"
              ] && (
                <a
                  href={
                    book.formats[
                      "application/epub+zip"
                    ]
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <button
                    type="button"
                  >
                    ⬇ Download EPUB
                  </button>
                </a>
              )}

              {/* DOWNLOAD PDF */}

              {book.formats[
                "application/pdf"
              ] && (
                <a
                  href={
                    book.formats[
                      "application/pdf"
                    ]
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <button
                    type="button"
                  >
                    ⬇ Download PDF
                  </button>
                </a>
              )}

            </div>

          </div>

        ))}

      </div>

      {/* =================================================
          BOTTOM BACK / NEXT
      ================================================= */}

      {books.length > 0 && (
        <BackNextButtons
          nextPath="/bookmarks"
          nextLabel="Bookmarks →"
        />
      )}

    </div>
  );
}

export default FreeBooks;