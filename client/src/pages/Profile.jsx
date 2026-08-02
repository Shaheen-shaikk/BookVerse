import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (currentUser) {
      setUser(currentUser);
      fetchFavorites(currentUser._id);
    }
  }, []);

  const fetchFavorites = async (userId) => {
    try {
      const res = await API.get(`/books/favorites/${userId}`);
      setFavorites(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const removeFavorite = async (bookId) => {
    try {
      await API.delete(`/books/favorite/${bookId}/${user._id}`);

      setFavorites((prev) =>
        prev.filter((book) => book._id !== bookId)
      );

      alert("💔 Removed from Favorites");
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
    return (
      <div className="home">
        <h2>Please Login</h2>
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
      <h1>👤 My Profile</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          margin: "30px 0",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "#2563eb",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "220px",
          }}
        >
          <h2>{user.name}</h2>
          <p>User Name</p>
        </div>

        <div
          style={{
            background: "#16a34a",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "220px",
          }}
        >
          <h2>{favorites.length}</h2>
          <p>Favorite Books</p>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          width: "600px",
          margin: "0 auto 40px",
        }}
      >
        <h3>Account Details</h3>

        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      <h2>❤️ My Favorite Books</h2>

      {favorites.length === 0 ? (
        <h3>No Favorite Books Yet</h3>
      ) : (
        favorites.map((book) => (
          <div
            key={book._id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "700px",
              margin: "20px auto",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
            }}
          >
            <div>
              <h3>{book.title}</h3>

              <p>
                <strong>Author:</strong> {book.author}
              </p>

              <p>
                <strong>Category:</strong> {book.category}
              </p>

              <p>
                ⭐ {book.rating}
              </p>
            </div>

            <button
              onClick={() => removeFavorite(book._id)}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              💔 Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Profile;