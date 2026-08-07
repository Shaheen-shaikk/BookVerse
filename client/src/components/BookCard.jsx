import { Link } from "react-router-dom";
import "../styles/cards.css";

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
    <div className="book-card">

      <div className="book-image-container">

        <img
          src={
            image ||
            "https://via.placeholder.com/300x420?text=Book"
          }
          alt={title}
          className="book-image"
        />

        <span className="rating-badge">
          ⭐ {rating || "0.0"}
        </span>

        <span className="category-badge">
          {category || "Book"}
        </span>

      </div>

      <div className="book-content">

        <h3>{title}</h3>

        <p className="author">
          ✍ {author}
        </p>

        <p className="published">
          📅 {publishedYear || "N/A"}
        </p>

        <Link to={`/books/${id}`}>
          <button className="view-btn">
            View Details →
          </button>
        </Link>

      </div>

    </div>
  );
}

export default BookCard;