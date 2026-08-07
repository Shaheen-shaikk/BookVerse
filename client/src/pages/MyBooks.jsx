import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MyBooks() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await API.get(`/books/author/${user.id}`);

      setBooks(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load books.");
    }
  };

  const deleteBook = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this book?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/books/${id}`);

      alert("📚 Book deleted successfully!");

      fetchBooks();
    } catch (err) {
      console.log(err);
      alert("Delete failed.");
    }
  };

  return (
    <div className="home">
      <h1>📚 My Books</h1>

      {books.length === 0 ? (
        <h3>No books published yet.</h3>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {books.map((book) => (
            <div
              key={book._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "15px",
                background: "#fff",
              }}
            >
              <img
                src={book.image}
                alt={book.title}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <h3>{book.title}</h3>

              <p>
                <strong>Category:</strong> {book.category}
              </p>

              <p>
                ⭐ {book.rating}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button
                  onClick={() =>
                    navigate(`/edit-book/${book._id}`)
                  }
                  style={{
                    flex: 1,
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() =>
                    deleteBook(book._id)
                  }
                  style={{
                    flex: 1,
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBooks;