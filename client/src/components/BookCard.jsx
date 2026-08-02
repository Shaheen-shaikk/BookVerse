import { Link } from "react-router-dom";

function BookCard({
  id,
  title,
  author,
  image,
  category,
  rating,
  publishedYear,
}) {
  return (
    <div
      style={{
        width: "280px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        transition: "0.3s",
        margin: "15px",
      }}
    >
      <img
        src={
          image ||
          "https://via.placeholder.com/280x360?text=Book+Cover"
        }
        alt={title}
        style={{
          width: "100%",
          height: "340px",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          padding: "15px",
        }}
      >
        <h3
          style={{
            marginBottom: "10px",
          }}
        >
          {title}
        </h3>

        <p>
          <strong>Author:</strong> {author}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {category || "Unknown"}
        </p>

        <p>
          <strong>⭐ Rating:</strong>{" "}
          {rating || 0}
        </p>

        <p>
          <strong>📅 Published:</strong>{" "}
          {publishedYear || "N/A"}
        </p>

        <Link to={`/books/${id}`}>
          <button
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "10px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            📖 Read More
          </button>
        </Link>
      </div>
    </div>
  );
}

export default BookCard;