import { useState, useEffect } from "react";
import API from "../services/api";

function Admin() {
  const emptyBook = {
    title: "",
    author: "",
    category: "",
    description: "",
    image: "",
    rating: "",
    publishedYear: "",
    pages: "",
    language: "",
  };

  const [book, setBook] = useState(emptyBook);
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

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

  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/books/${editingId}`, book);
        alert("Book Updated Successfully");
      } else {
        await API.post("/books", book);
        alert("Book Added Successfully");
      }

      setBook(emptyBook);
      setEditingId(null);
      fetchBooks();
    } catch (err) {
      console.log(err);
    }
  };

  const editBook = (selectedBook) => {
    setBook({
      title: selectedBook.title,
      author: selectedBook.author,
      category: selectedBook.category,
      description: selectedBook.description,
      image: selectedBook.image,
      rating: selectedBook.rating,
      publishedYear: selectedBook.publishedYear,
      pages: selectedBook.pages,
      language: selectedBook.language,
    });

    setEditingId(selectedBook._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await API.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredBooks = books.filter((book) => {
    const value = search.toLowerCase();

    return (
      book.title.toLowerCase().includes(value) ||
      book.author.toLowerCase().includes(value) ||
      book.category.toLowerCase().includes(value)
    );
  });

  return (
    <div className="home">
      <h1>📚 Admin Dashboard</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#4f46e5",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "180px",
          }}
        >
          <h2>{books.length}</h2>
          <p>Total Books</p>
        </div>

        <div
          style={{
            background: "#16a34a",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "180px",
          }}
        >
          <h2>
            {[...new Set(books.map((b) => b.category))].length}
          </h2>
          <p>Categories</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "600px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <input
          name="title"
          placeholder="Title"
          value={book.title}
          onChange={handleChange}
          required
        />

        <input
          name="author"
          placeholder="Author"
          value={book.author}
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={book.category}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={book.description}
          onChange={handleChange}
          required
        />

        <input
          name="image"
          placeholder="Image URL"
          value={book.image}
          onChange={handleChange}
        />

        <input
          name="rating"
          placeholder="Rating"
          value={book.rating}
          onChange={handleChange}
        />

        <input
          name="publishedYear"
          placeholder="Published Year"
          value={book.publishedYear}
          onChange={handleChange}
        />

        <input
          name="pages"
          placeholder="Pages"
          value={book.pages}
          onChange={handleChange}
        />

        <input
          name="language"
          placeholder="Language"
          value={book.language}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update Book" : "Add Book"}
        </button>
      </form>

      <br />

      <input
        type="text"
        placeholder="Search by title, author or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "500px",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      />

      {filteredBooks.map((book) => (
        <div
          key={book._id}
          style={{
            width: "700px",
            margin: "20px auto",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <h2>{book.title}</h2>

          <p>
            <strong>Author:</strong> {book.author}
          </p>

          <p>
            <strong>Category:</strong> {book.category}
          </p>

          <p>
            <strong>Rating:</strong> ⭐ {book.rating}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <button
              onClick={() => editBook(book)}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
            >
              ✏ Edit
            </button>

            <button
              onClick={() => deleteBook(book._id)}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Admin;