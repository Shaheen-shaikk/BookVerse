import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        📚 BookVerse
      </Link>

      <div className="nav-links">

        <Link
          className={location.pathname === "/" ? "active" : ""}
          to="/"
        >
          Home
        </Link>

        <Link
          className={location.pathname === "/books" ? "active" : ""}
          to="/books"
        >
          Books
        </Link>

        <Link
          className={location.pathname === "/explore" ? "active" : ""}
          to="/explore"
        >
          Explore
        </Link>

        <Link
          className={
            location.pathname === "/free-books"
              ? "active"
              : ""
          }
          to="/free-books"
        >
          Free Books
        </Link>

      </div>

      <div className="nav-right">

        <input
          placeholder="Search books..."
          className="search-box"
        />

        {!user ? (
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>

            <Link to="/register">
              <button>Register</button>
            </Link>
          </>
        ) : (
          <>
            <span className="username">
              👋 {user.name}
            </span>

            {user.role === "admin" && (
              <Link to="/admin">Admin</Link>
            )}

            {user.role === "author" && (
              <Link to="/author">Author</Link>
            )}

            <Link to="/profile">
              Profile
            </Link>

            <button onClick={logout}>
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;