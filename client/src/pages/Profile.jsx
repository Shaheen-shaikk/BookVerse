import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const localUser = JSON.parse(
    localStorage.getItem("user")
  );

  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (localUser?.id) {
      fetchProfile();
      fetchFavorites();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get(
        `/users/${localUser.id}`
      );

      setUser(res.data);

      setForm({
        name: res.data.name,
        email: res.data.email,
      });
    } catch (err) {
      console.log("Profile Error:", err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await API.get(
        `/books/favorites/${localUser.id}`
      );

      setFavorites(res.data || []);
    } catch (err) {
      console.log("Favorites Error:", err);
    }
  };

  const removeFavorite = async (bookId) => {
    try {
      await API.delete(
        `/books/favorite/${bookId}/${localUser.id}`
      );

      setFavorites((prev) =>
        prev.filter(
          (book) => book._id !== bookId
        )
      );

      alert("💔 Removed from Favorites");
    } catch (err) {
      console.log("Remove Favorite Error:", err);
    }
  };

  const saveProfile = async () => {
    try {
      const res = await API.put(
        `/users/${localUser.id}`,
        form
      );

      setUser(res.data);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...localUser,
          id: res.data._id || localUser.id,
          name: res.data.name,
          email: res.data.email,
        })
      );

      alert("✅ Profile Updated");

      setEdit(false);
    } catch (err) {
      console.log("Update Profile Error:", err);
    }
  };

  if (!localUser) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        <h2>Please login first.</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  return (
    <div
      className="home"
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>👤 My Profile</h1>

      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          marginTop: "30px",
        }}
      >
        <p>
          <strong>Name:</strong>
        </p>

        {edit ? (
          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            style={{
              padding: "10px",
              width: "100%",
              maxWidth: "400px",
            }}
          />
        ) : (
          <p>{user.name}</p>
        )}

        <br />

        <p>
          <strong>Email:</strong>
        </p>

        {edit ? (
          <input
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            style={{
              padding: "10px",
              width: "100%",
              maxWidth: "400px",
            }}
          />
        ) : (
          <p>{user.email}</p>
        )}

        <br />

        <p>
          <strong>Role:</strong>{" "}
          {user.role}
        </p>

        <p>
          <strong>Favourite Books:</strong>{" "}
          {favorites.length}
        </p>

        <br />

        {edit ? (
          <button
            onClick={saveProfile}
            style={{
              background: "#4f46e5",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setEdit(true)}
            style={{
              background: "#4f46e5",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Edit Profile
          </button>
        )}
      </div>

      <br />

      <h2>❤️ Favourite Books</h2>

      {favorites.length === 0 ? (
        <h3>No Favourite Books</h3>
      ) : (
        favorites.map((book) => (
          <div
            key={book._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "15px",
            }}
          >
            <h3>{book.title}</h3>

            <p>{book.author}</p>

            <button
              onClick={() =>
                removeFavorite(book._id)
              }
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "6px",
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