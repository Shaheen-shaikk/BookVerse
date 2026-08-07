import { useEffect, useState } from "react";
import API from "../services/api";

function Reviews({ bookId }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${bookId}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const submitReview = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!comment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      await API.post("/reviews", {
        book: bookId,
        user: user.id,
        userName: user.name,
        rating,
        comment,
      });

      alert("✅ Review submitted successfully!");

      setComment("");
      setRating(5);

      fetchReviews();
    } catch (err) {
      console.error("Review Error:", err);

      if (err.response) {
        console.log(err.response.data);
        alert(err.response.data.message);
      } else {
        alert(err.message);
      }
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await API.delete(`/reviews/${reviewId}`);

      alert("Review deleted!");

      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const average =
    reviews.length === 0
      ? 0
      : (
          reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / reviews.length
        ).toFixed(1);

  return (
    <div
      style={{
        marginTop: "50px",
      }}
    >
      <h2>⭐⭐⭐⭐⭐ Reviews</h2>

      <h3>Average Rating: ⭐ {average}</h3>

      <div
        style={{
          margin: "20px 0",
        }}
      >
        <select
          value={rating}
          onChange={(e) =>
            setRating(Number(e.target.value))
          }
        >
          <option value={5}>⭐⭐⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={1}>⭐</option>
        </select>

        <br />
        <br />

        <textarea
          rows="4"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
          }}
        />

        <br />
        <br />

        <button
          onClick={submitReview}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Submit Review
        </button>
      </div>

      <hr />

      {reviews.length === 0 ? (
        <p>No Reviews Yet</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              margin: "20px 0",
            }}
          >
            <h3>{review.userName}</h3>

            <p>⭐ {review.rating}/5</p>

            <p>{review.comment}</p>

            {user &&
              review.user &&
              review.user.toString() === user.id && (
                <button
                  onClick={() =>
                    deleteReview(review._id)
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
                  Delete
                </button>
              )}
          </div>
        ))
      )}
    </div>
  );
}

export default Reviews;