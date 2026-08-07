import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "60px",
        flexWrap: "wrap",
        padding: "60px 0",
      }}
    >
      <div style={{ flex: 1 }}>
        <span
          style={{
            color: "#4F46E5",
            fontWeight: "600",
            fontSize: "18px",
          }}
        >
          📚 The Future of Digital Reading
        </span>

        <h1
          style={{
            fontSize: "64px",
            margin: "20px 0",
            lineHeight: "1.15",
            fontWeight: "700",
          }}
        >
          Discover Your
          <br />
          Next Favorite
          <span style={{ color: "#4F46E5" }}> Book.</span>
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#64748B",
            maxWidth: "550px",
            lineHeight: "1.8",
          }}
        >
          Explore thousands of books from talented authors,
          discover trending titles, save favourites,
          manage your reading list and publish your own books —
          all in one place.
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          <Link to="/books">
            <button>📖 Explore Books</button>
          </Link>

          <Link to="/register">
            <button
              style={{
                background: "#fff",
                color: "#4F46E5",
                border: "2px solid #4F46E5",
              }}
            >
              Become Author
            </button>
          </Link>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700"
          alt="Books"
          style={{
            width: "100%",
            maxWidth: "520px",
            borderRadius: "25px",
            boxShadow: "0 25px 60px rgba(0,0,0,.15)",
          }}
        />
      </div>
    </section>
  );
}

export default Hero;