import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function PublishBook() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [book, setBook] = useState({
    title: "",
    category: "",
    description: "",
    rating: "",
    publishedYear: "",
    pages: "",
    language: "English",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      alert("Please select an image.");
      return "";
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", selectedImage);

      const res = await API.post(
        "/upload/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploading(false);

      console.log("Upload Success:", res.data);

      return res.data.imageUrl;
    } catch (err) {
      setUploading(false);

      console.error("UPLOAD ERROR:", err);

      if (err.response) {
        console.error("Server Response:", err.response.data);
        alert(
          err.response.data.message ||
            JSON.stringify(err.response.data)
        );
      } else {
        alert(err.message);
      }

      return "";
    }
  };

  const publishBook = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      if (selectedImage) {
        imageUrl = await uploadImage();

        if (!imageUrl) return;
      }

      const payload = {
        ...book,
        image: imageUrl,
        author: user.name,
        authorId: user.id,
      };

      console.log("Publishing:", payload);

      const res = await API.post("/books", payload);

      console.log("Book Saved:", res.data);

      alert("📚 Book Published Successfully!");

      navigate("/author");
    } catch (err) {
      console.error("PUBLISH ERROR:", err);

      if (err.response) {
        console.error("Server Response:", err.response.data);
        alert(
          err.response.data.message ||
            JSON.stringify(err.response.data)
        );
      } else {
        alert(err.message);
      }
    }
  };

  return (
    <div className="home">
      <h1>📚 Publish Your Book</h1>

      <form
        onSubmit={publishBook}
        style={{
          width: "650px",
          margin: "30px auto",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <input
          name="title"
          placeholder="Book Title"
          value={book.title}
          onChange={handleChange}
          required
        />

        <input
          value={user?.name || ""}
          disabled
        />

        <input
          name="category"
          placeholder="Category"
          value={book.category}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={book.description}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setSelectedImage(e.target.files[0])
          }
          required
        />

        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            style={{
              width: "180px",
              borderRadius: "10px",
              margin: "10px auto",
            }}
          />
        )}

        {uploading && <h3>Uploading Image...</h3>}

        <input
          name="rating"
          placeholder="Rating"
          value={book.rating}
          onChange={handleChange}
        />

        <input
          name="publishedYear"
          placeholder="Published Year"
          value={book.publishedYear}
          onChange={handleChange}
        />

        <input
          name="pages"
          placeholder="Pages"
          value={book.pages}
          onChange={handleChange}
        />

        <input
          name="language"
          placeholder="Language"
          value={book.language}
          onChange={handleChange}
        />

        <button type="submit">
          🚀 Publish Book
        </button>
      </form>
    </div>
  );
}

export default PublishBook;