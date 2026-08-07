import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: "",
    category: "",
    description: "",
    rating: "",
    publishedYear: "",
    pages: "",
    language: "",
    image: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    try {
      const res = await API.get(`/books/${id}`);
      setBook(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load book");
    }
  };

  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  };

  const uploadImage = async () => {
    if (!selectedImage) return book.image;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", selectedImage);

      const res = await API.post(
        "/upload/image",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setUploading(false);

      return res.data.imageUrl;
    } catch (err) {
      console.log(err);
      alert("Image upload failed");
      setUploading(false);
      return book.image;
    }
  };

  const updateBook = async (e) => {
    e.preventDefault();

    try {
      const imageUrl = await uploadImage();

      const payload = {
        ...book,
        image: imageUrl,
      };

      await API.put(`/books/${id}`, payload);

      alert("Book Updated Successfully!");

      navigate("/my-books");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };
    return (
    <div className="home">
      <h1>✏️ Edit Book</h1>

      <form
        onSubmit={updateBook}
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
          rows="5"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setSelectedImage(e.target.files[0])
          }
        />

        <img
          src={
            selectedImage
              ? URL.createObjectURL(selectedImage)
              : book.image
          }
          alt="Book Cover"
          style={{
            width: "180px",
            borderRadius: "10px",
            margin: "auto",
          }}
        />

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
          💾 Update Book
        </button>
      </form>
    </div>
  );
}

export default EditBook;