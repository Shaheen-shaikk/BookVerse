import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* =========================
          LOGO
      ========================== */}
      <Link
        to="/"
        className="logo"
      >
        📚 Readora
      </Link>

      {/* =========================
          MAIN NAVIGATION
      ========================== */}
      <div className="nav-links">

        <Link
          className={
            location.pathname === "/"
              ? "active"
              : ""
          }
          to="/"
        >
          Home
        </Link>

        <Link
          className={
            location.pathname === "/books"
              ? "active"
              : ""
          }
          to="/books"
        >
          Books
        </Link>

        <Link
          className={
            location.pathname === "/explore"
              ? "active"
              : ""
          }
          to="/explore"
        >
          Explore
        </Link>

        <Link
          className={
            location.pathname ===
            "/free-books"
              ? "active"
              : ""
          }
          to="/free-books"
        >
          Free Books
        </Link>

        {/* =========================
            BOOKMARKS
        ========================== */}
        {user && (
          <>
            <Link
              className={
                location.pathname ===
                "/bookmarks"
                  ? "active"
                  : ""
              }
              to="/bookmarks"
            >
              🔖 Bookmarks
            </Link>

            {/* =========================
                MY READING
            ========================== */}
            <Link
              className={
                location.pathname ===
                "/my-reading"
                  ? "active"
                  : ""
              }
              to="/my-reading"
            >
              📚 My Reading
            </Link>
          </>
        )}

      </div>

      {/* =========================
          RIGHT SIDE
      ========================== */}
      <div className="nav-right">

        <input
          placeholder="Search books..."
          className="search-box"
        />

        {/* =========================
            LOGGED OUT
        ========================== */}
        {!user ? (
          <>
            <Link to="/login">
              <button>
                Login
              </button>
            </Link>

            <Link to="/register">
              <button>
                Register
              </button>
            </Link>
          </>
        ) : (
          <>
            <span className="username">
              👋 {user.name}
            </span>

            {/* ADMIN */}
            {user.role === "admin" && (
              <Link to="/admin">
                Admin
              </Link>
            )}

            {/* AUTHOR */}
            {user.role === "author" && (
              <Link to="/author">
                Author
              </Link>
            )}

            {/* PROFILE */}
            <Link to="/profile">
              Profile
            </Link>

            {/* LOGOUT */}
            <button
              onClick={logout}
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;