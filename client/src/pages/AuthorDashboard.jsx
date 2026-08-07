import { Link } from "react-router-dom";

function AuthorDashboard() {
  return (
    <div
      className="home"
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
      }}
    >
      <h1>✍️ Author Dashboard</h1>

      <p>
        Welcome! Manage your books and connect with your readers.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        <Link
          to="/publish-book"
          style={{ textDecoration: "none" }}
        >
          <div className="book-card">
            <h2>➕</h2>
            <h3>Publish Book</h3>
            <p>Upload a new book.</p>
          </div>
        </Link>

        <Link
          to="/my-books"
          style={{ textDecoration: "none" }}
        >
          <div className="book-card">
            <h2>📚</h2>
            <h3>My Books</h3>
            <p>Manage your published books.</p>
          </div>
        </Link>

        <Link
          to="/reader-feedback"
          style={{ textDecoration: "none" }}
        >
          <div className="book-card">
            <h2>⭐</h2>
            <h3>Reader Feedback</h3>
            <p>View reviews from readers.</p>
          </div>
        </Link>

        <Link
          to="/profile"
          style={{ textDecoration: "none" }}
        >
          <div className="book-card">
            <h2>👤</h2>
            <h3>My Profile</h3>
            <p>View your profile.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AuthorDashboard;