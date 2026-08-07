import { useState, useEffect } from "react";
import API from "../services/api";
import Hero from "../components/Hero";
import BookCard from "../components/BookCard";
import "../styles/home.css";

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

      <Hero />

      <section className="section">

        <div className="section-header">
          <h2>🔥 Latest Books</h2>
          <p>Recently published books from our authors.</p>
        </div>

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

      </section>

      <section className="section">

        <div className="section-header">
          <h2>⭐ Top Rated Books</h2>
          <p>Most loved books by our readers.</p>
        </div>

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

      </section>

      <section className="stats">

        <div className="stat-card">
          <h1>{books.length}+</h1>
          <p>Books</p>
        </div>

        <div className="stat-card">
          <h1>100+</h1>
          <p>Authors</p>
        </div>

        <div className="stat-card">
          <h1>500+</h1>
          <p>Readers</p>
        </div>

        <div className="stat-card">
          <h1>4.9★</h1>
          <p>Average Rating</p>
        </div>

      </section>

    </div>
  );
}

export default Home;