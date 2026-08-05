import { useState } from "react";

function ExploreBooks() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    if (!search.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(search)}`
      );

      const data = await res.json();

      setBooks(data.docs || []);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <h1>🌍 Explore Books</h1>

      <p>Search millions of books for free.</p>

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
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchBooks();
          }}
          style={{
            width: "350px",
            padding: "12px",
            borderRadius: "8px",
          }}
        />

        <button onClick={searchBooks}>
          🔍 Search
        </button>
      </div>

      {loading && <h2>Loading...</h2>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {books.map((book) => (
          <div
            key={book.key}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,.1)",
            }}
          >
            <img
              src={
                book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                  : "https://via.placeholder.com/180x250?text=No+Cover"
              }
              alt={book.title}
              style={{
                width: "160px",
                height: "230px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />

            <h3>{book.title}</h3>

            <p>
              👤{" "}
              {book.author_name
                ? book.author_name[0]
                : "Unknown"}
            </p>

            <p>
              📅{" "}
              {book.first_publish_year || "N/A"}
            </p>

            <p>
              ⭐ Edition Count:{" "}
              {book.edition_count}
            </p>

            <a
              href={`https://openlibrary.org${book.key}`}
              target="_blank"
              rel="noreferrer"
            >
              <button>
                📖 View Book
              </button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreBooks;