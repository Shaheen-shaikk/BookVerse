import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import BookCard from "../components/BookCard";

function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await API.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const latestBooks = books.slice(0, 4);

  const topRatedBooks = [...books]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <div className="home">
      <h1>📚 Welcome to BookVerse</h1>

      <p>
        Discover, explore and read your favorite books.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
      >
        <Link to="/books">
          <button>📚 My Library</button>
        </Link>

        <Link to="/explore">
          <button>🌍 Explore Books</button>
        </Link>

        <Link to="/free-books">
          <button>📜 Free Books</button>
        </Link>
      </div>

      <h2>🆕 Latest Books</h2>

      <div className="book-list">
        {latestBooks.map((book) => (
          <BookCard
            key={book._id}
            id={book._id}
            title={book.title}
            author={book.author}
            image={book.image}
          />
        ))}
      </div>

      <br />

      <h2>⭐ Top Rated Books</h2>

      <div className="book-list">
        {topRatedBooks.map((book) => (
          <BookCard
            key={book._id}
            id={book._id}
            title={book.title}
            author={book.author}
            image={book.image}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;