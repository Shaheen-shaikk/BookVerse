import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";
import Reviews from "../components/Reviews"; 

function BookDetails() {
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));

  const [book, setBook] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [status, setStatus] = useState("Want to Read");

  useEffect(() => {
    fetchBook();

    if (user) {
      checkFavorite();
      fetchReadingStatus();
    }
  }, []);

  const fetchBook = async () => {
    try {
      const res = await API.get(`/books/${id}`);
      setBook(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const checkFavorite = async () => {
    try {
      const res = await API.get(`/books/favorites/${user._id}`);

      const exists = res.data.some(
        (book) => book._id === id
      );

      setFavorite(exists);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchReadingStatus = async () => {
    try {
      const res = await API.get(`/users/reading/${user._id}`);

      const current = res.data.find(
        (item) => item.book._id === id
      );

      if (current) {
        setStatus(current.status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateReadingStatus = async (value) => {
    try {
      setStatus(value);

      await API.put(`/users/reading/${id}`, {
        userId: user._id,
        status: value,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const addFavorite = async () => {
    if (!user) {
      alert("Please Login First");
      return;
    }

    try {
      await API.put(`/books/favorite/${book._id}`, {
        userId: user._id,
      });

      setFavorite(true);

      alert("❤️ Added to Favorites");
    } catch (err) {
      console.log(err);
    }
  };

  const removeFavorite = async () => {
    try {
      await API.delete(
        `/books/favorite/${book._id}/${user._id}`
      );

      setFavorite(false);

      alert("💔 Removed from Favorites");
    } catch (err) {
      console.log(err);
    }
  };

  if (!book) {
    return (
      <div className="home">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div
      className="home"
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <img
          src={
            book.image ||
            "https://via.placeholder.com/250x350?text=Book"
          }
          alt={book.title}
          style={{
            width: "250px",
            borderRadius: "12px",
            boxShadow:
              "0 5px 20px rgba(0,0,0,.2)",
          }}
        />

        <div
          style={{
            flex: 1,
          }}
        >
          <h1>{book.title}</h1>

          <h2>{book.author}</h2>

          <p>⭐ {book.rating}</p>

          <p>
            <strong>Category:</strong>{" "}
            {book.category}
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

          <br />

          <h3>Description</h3>

          <p
            style={{
              lineHeight: "1.8",
            }}
          >
            {book.description}
          </p>

          <br />

          <h3>📖 Reading Status</h3>

          <select
            value={status}
            onChange={(e) =>
              updateReadingStatus(
                e.target.value
              )
            }
            style={{
              padding: "10px",
              borderRadius: "8px",
              width: "220px",
            }}
          >
            <option>
              Want to Read
            </option>

            <option>
              Reading
            </option>

            <option>
              Finished
            </option>
          </select>

          <br />
          <br />

          {favorite ? (
            <button
              onClick={removeFavorite}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              💔 Remove Favorite
            </button>
          ) : (
            <button
              onClick={addFavorite}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              ❤️ Add Favorite
            </button>
          )}
        </div>
      </div>
      <hr style={{ margin: "50px 0" }} />

<Reviews bookId={book._id} />
    </div>
    
  );
}

export default BookDetails;