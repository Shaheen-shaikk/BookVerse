import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkStyle = (path) => ({
    color: "white",
    textDecoration: "none",
    fontWeight: location.pathname === path ? "bold" : "normal",
    borderBottom:
      location.pathname === path
        ? "2px solid white"
        : "none",
    paddingBottom: "3px",
  });

  return (
    <nav
      style={{
        background: "#4f46e5",
        color: "white",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "white",
        }}
      >
        <h2>📚 BookVerse</h2>
      </Link>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Link to="/" style={linkStyle("/")}>
          Home
        </Link>

        <Link to="/books" style={linkStyle("/books")}>
          Books
        </Link>

        <Link to="/explore" style={linkStyle("/explore")}>
          Explore
        </Link>
        <Link
  to="/free-books"
  style={linkStyle("/free-books")}
>
  Free Books
</Link>

        {!user && (
          <>
            <Link
              to="/login"
              style={linkStyle("/login")}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={linkStyle("/register")}
            >
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              👋 Hi, {user.name}
            </span>

            <Link
              to="/profile"
              style={linkStyle("/profile")}
            >
              Profile
            </Link>

            {user.role === "admin" && (
              <Link
                to="/admin"
                style={linkStyle("/admin")}
              >
                Admin
              </Link>
            )}

            <button
              onClick={logout}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
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