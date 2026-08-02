import { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import API from "../services/api";

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const booksPerPage = 6;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await API.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  let filteredBooks = books.filter((book) => {
    const value = search.toLowerCase();

    const matchesSearch =
      book.title.toLowerCase().includes(value) ||
      book.author.toLowerCase().includes(value) ||
      book.category.toLowerCase().includes(value);

    const matchesCategory =
      category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  switch (sort) {
    case "az":
      filteredBooks.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      break;

    case "za":
      filteredBooks.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
      break;

    case "rating":
      filteredBooks.sort(
        (a, b) => b.rating - a.rating
      );
      break;

    case "newest":
      filteredBooks.sort(
        (a, b) => b.publishedYear - a.publishedYear
      );
      break;

    default:
      break;
  }

  const totalPages = Math.ceil(
    filteredBooks.length / booksPerPage
  );

  const lastIndex = currentPage * booksPerPage;

  const firstIndex = lastIndex - booksPerPage;

  const currentBooks = filteredBooks.slice(
    firstIndex,
    lastIndex
  );

  const categories = [
    "All",
    ...new Set(books.map((book) => book.category)),
  ];

  return (
    <div className="home">
      <h1>📚 Books Library</h1>

      <p>
        Discover books from different
        categories.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
          margin: "25px 0",
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "8px",
          }}
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          {categories.map((cat) => (
            <option key={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          style={{
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <option value="default">
            Default
          </option>

          <option value="az">
            A-Z
          </option>

          <option value="za">
            Z-A
          </option>

          <option value="rating">
            Highest Rating
          </option>

          <option value="newest">
            Newest
          </option>
        </select>
      </div>

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <strong>
          {filteredBooks.length}
        </strong>{" "}
        books found
      </div>

     <div className="book-list">
  {currentBooks.length > 0 ? (
    currentBooks.map((book) => (
      <BookCard
        key={book._id}
        id={book._id}
        title={book.title}
        author={book.author}
        image={book.image}
        category={book.category}
        rating={book.rating}
        publishedYear={book.publishedYear}
      />
    ))
  ) : (
    <h3>No Books Found 📚</h3>
  )}
</div>
     

      {totalPages > 1 && (
        <div
          style={{
            marginTop: "40px",
          }}
        >
          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
          >
            ⬅ Prev
          </button>

          <span
            style={{
              margin: "0 20px",
            }}
          >
            Page {currentPage} of{" "}
            {totalPages}
          </span>

          <button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
}

export default Books;