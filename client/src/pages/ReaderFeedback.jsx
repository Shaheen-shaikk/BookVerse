import { useEffect, useState } from "react";
import API from "../services/api";

function ReaderFeedback() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const booksRes = await API.get(
        `/books/author/${user.id}`
      );

      setBooks(booksRes.data);

      let allReviews = [];

      for (const book of booksRes.data) {
        const reviewRes = await API.get(
          `/reviews/${book._id}`
        );

        const mapped = reviewRes.data.map((review) => ({
          ...review,
          bookTitle: book.title,
          cover: book.image,
        }));

        allReviews.push(...mapped);
      }

      setReviews(allReviews);

    } catch (err) {
      console.log(err);
      alert("Failed to load feedback.");
    }
  };

  return (
    <div className="home">
      <h1>⭐ Reader Feedback</h1>

      {reviews.length === 0 ? (
        <h3>No feedback yet.</h3>
      ) : (
        reviews.map((review) => (
          <div
            key={review._id}
            style={{
              display: "flex",
              gap: "20px",
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <img
              src={review.cover}
              alt={review.bookTitle}
              style={{
                width: "120px",
                borderRadius: "8px",
              }}
            />

            <div>
              <h2>{review.bookTitle}</h2>

              <h3>
                ⭐ {review.rating}/5
              </h3>

              <p>
                <strong>{review.userName}</strong>
              </p>

              <p>{review.comment}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ReaderFeedback;