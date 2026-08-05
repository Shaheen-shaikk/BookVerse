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

  const [stats, setStats] = useState({
    books: 0,
    users: 0,
    reviews: 0,
    favorites: 0,
  });
const [selectedImage, setSelectedImage] = useState(null);
const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

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
  const uploadImage = async () => {
  if (!selectedImage) return "";

  try {
    setUploading(true);

    const formData = new FormData();

    formData.append("image", selectedImage);

    const res = await API.post(
      "/upload/image",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    setUploading(false);

    return res.data.imageUrl;
  } catch (err) {
    console.log(err);
    alert("Image Upload Failed");
    setUploading(false);
    return "";
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = book.image;

if (selectedImage) {
  imageUrl = await uploadImage();
}

const updatedBook = {
  ...book,
  image: imageUrl,
};
      if (editingId) {
        await API.put(
  `/books/${editingId}`,
  updatedBook
);
        alert("Book Updated Successfully");
      } else {
        await API.post("/books", updatedBook);
        alert("Book Added Successfully");
      }

      setBook(emptyBook);
      setEditingId(null);

      fetchBooks();
      fetchStats();
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
      fetchStats();
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
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "20px",
          maxWidth: "900px",
          margin: "30px auto",
        }}
      >
        <div
          style={{
            background: "#4f46e5",
            color: "white",
            padding: "25px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h1>{stats.books}</h1>
          <p>📚 Total Books</p>
        </div>

        <div
          style={{
            background: "#16a34a",
            color: "white",
            padding: "25px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h1>{stats.users}</h1>
          <p>👥 Users</p>
        </div>

        <div
          style={{
            background: "#f59e0b",
            color: "white",
            padding: "25px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h1>{stats.reviews}</h1>
          <p>⭐ Reviews</p>
        </div>

        <div
          style={{
            background: "#dc2626",
            color: "white",
            padding: "25px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h1>{stats.favorites}</h1>
          <p>❤️ Favorites</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "650px",
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
  type="file"
  accept="image/*"
  onChange={(e) =>
    setSelectedImage(e.target.files[0])
  }
/>

{selectedImage && (
  <img
    src={URL.createObjectURL(selectedImage)}
    alt="Preview"
    style={{
      width: "180px",
      borderRadius: "10px",
      margin: "10px auto",
    }}
  />
)}

{uploading && (
  <p>Uploading Image...</p>
)}
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
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "500px",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      />

      <div>
                {filteredBooks.length === 0 ? (
          <h3
            style={{
              textAlign: "center",
            }}
          >
            No Books Found 📚
          </h3>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book._id}
              style={{
                width: "750px",
                margin: "20px auto",
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                gap: "20px",
                alignItems: "center",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,.1)",
              }}
            >
              <img
                src={
                  book.image ||
                  "https://via.placeholder.com/120x170?text=Book"
                }
                alt={book.title}
                style={{
                  width: "120px",
                  height: "170px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                <h2>{book.title}</h2>

                <p>
                  <strong>Author:</strong>{" "}
                  {book.author}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {book.category}
                </p>

                <p>
                  <strong>Rating:</strong> ⭐{" "}
                  {book.rating}
                </p>

                <p>
                  <strong>Published:</strong>{" "}
                  {book.publishedYear}
                </p>

                <p>
                  <strong>Pages:</strong>{" "}
                  {book.pages}
                </p>

                <p>
                  <strong>Language:</strong>{" "}
                  {book.language}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "15px",
                  }}
                >
                  <button
                    onClick={() =>
                      editBook(book)
                    }
                    style={{
                      background:
                        "#2563eb",
                      color: "white",
                      border: "none",
                      padding:
                        "10px 20px",
                      borderRadius:
                        "8px",
                      cursor: "pointer",
                    }}
                  >
                    ✏ Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteBook(
                        book._id
                      )
                    }
                    style={{
                      background:
                        "#dc2626",
                      color: "white",
                      border: "none",
                      padding:
                        "10px 20px",
                      borderRadius:
                        "8px",
                      cursor: "pointer",
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;