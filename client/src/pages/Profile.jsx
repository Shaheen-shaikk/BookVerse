import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const localUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (localUser) {
      fetchProfile();
      fetchFavorites();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/users/${localUser.id}`);

      setUser(res.data);

      setForm({
        name: res.data.name,
        email: res.data.email,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await API.get(
        `/books/favorites/${localUser.id}`
      );

      setFavorites(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const removeFavorite = async (bookId) => {
    try {
      await API.delete(
        `/books/favorite/${bookId}/${localUser.id}`
      );

      setFavorites((prev) =>
        prev.filter((book) => book._id !== bookId)
      );

      alert("Removed from favorites");
    } catch (err) {
      console.log(err);
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
          name: res.data.name,
          email: res.data.email,
        })
      );

      alert("Profile Updated");

      setEdit(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
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
        maxWidth: "900px",
        margin: "40px auto",
      }}
    >
      <h1>👤 My Profile</h1>

      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 5px 20px rgba(0,0,0,.1)",
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
          />
        ) : (
          <p>{user.name}</p>
        )}

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
          />
        ) : (
          <p>{user.email}</p>
        )}

        <p>
          <strong>Role:</strong>
        </p>

        <p>{user.role}</p>

        <p>
          <strong>Books Published:</strong>
        </p>

        <p>{user.booksCount || 0}</p>

        <p>
          <strong>Favourite Books:</strong>
        </p>

        <p>{favorites.length}</p>

        <p>
          <strong>Joined:</strong>
        </p>

        <p>
          {new Date(user.createdAt).toLocaleDateString()}
        </p>

        <br />

        {edit ? (
          <button onClick={saveProfile}>
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setEdit(true)}
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
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Profile;