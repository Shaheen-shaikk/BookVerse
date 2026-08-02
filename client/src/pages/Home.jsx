import Button from "../components/Button";
import BookCard from "../components/BookCard";

import atomicHabits from "../assets/books/atomic-habits.jpg";
import harryPotter from "../assets/books/harry-potter.jpg";
import richDad from "../assets/books/rich-dad.jpg";
import Navbar from "../components/Navbar";

function Home() {
  const books = [
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
      image: atomicHabits,
    },
    {
      id: 2,
      title: "Harry Potter",
      author: "J.K. Rowling",
      image: harryPotter,
    },
    {
      id: 3,
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      image: richDad,
    },
  ];

  return (
    <div className="home">
      <h1>📚 Welcome to BookVerse</h1>

      <p>
        Discover, read, review, and share your favorite books with readers
        around the world.
      </p>

      <Button
  text="Explore Books"
  to="/books"
/>

      <section className="featured-books">
        <h2>Featured Books</h2>

        <div className="book-list">
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;