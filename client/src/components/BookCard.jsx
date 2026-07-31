function BookCard({ title, author, image }) {
  return (
    <div className="book-card">
      <img
        src={image}
        alt={title}
        className="book-image"
      />

      <h3>{title}</h3>

      <p>{author}</p>

      <button>Read More</button>
    </div>
  );
}

export default BookCard;