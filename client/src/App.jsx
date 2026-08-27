import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ExploreBooks from "./pages/ExploreBooks";
import FreeBooks from "./pages/FreeBooks";
import AuthorDashboard from "./pages/AuthorDashboard";
import PublishBook from "./pages/PublishBook";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import MyBooks from "./pages/MyBooks";
import ReaderFeedback from "./pages/ReaderFeedback";
import EditBook from "./pages/EditBook";
import Bookmarks from "./pages/Bookmarks";
import Reader from "./pages/Reader";
import MyReading from "./pages/MyReading";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* =========================
            HOME
        ========================== */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* =========================
            BOOKS
        ========================== */}
        <Route
          path="/books"
          element={<Books />}
        />

        {/* =========================
            BOOKMARKS
        ========================== */}
        <Route
          path="/bookmarks"
          element={<Bookmarks />}
        />
        {/* =========================
    MY READING
========================== */}
<Route
  path="/my-reading"
  element={
    <ProtectedRoute>
      <MyReading />
    </ProtectedRoute>
  }
/>

        {/* =========================
            SINGLE BOOK
        ========================== */}
        <Route
          path="/books/:id"
          element={<BookDetails />}
        />

        {/* =========================
            READER
        ========================== */}
        <Route
          path="/reader/:id"
          element={<Reader />}
        />

        {/* =========================
            EXPLORE
        ========================== */}
        <Route
          path="/explore"
          element={<ExploreBooks />}
        />

        {/* =========================
            FREE BOOKS
        ========================== */}
        <Route
          path="/free-books"
          element={<FreeBooks />}
        />

        {/* =========================
            LOGIN
        ========================== */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* =========================
            REGISTER
        ========================== */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================
            PROFILE
        ========================== */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* =========================
            ADMIN
        ========================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* =========================
            AUTHOR DASHBOARD
        ========================== */}
        <Route
          path="/author"
          element={
            <ProtectedRoute>
              <AuthorDashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================
            PUBLISH BOOK
        ========================== */}
        <Route
          path="/publish-book"
          element={
            <ProtectedRoute>
              <PublishBook />
            </ProtectedRoute>
          }
        />

        {/* =========================
            MY BOOKS
        ========================== */}
        <Route
          path="/my-books"
          element={
            <ProtectedRoute>
              <MyBooks />
            </ProtectedRoute>
          }
        />

        {/* =========================
            READER FEEDBACK
        ========================== */}
        <Route
          path="/reader-feedback"
          element={
            <ProtectedRoute>
              <ReaderFeedback />
            </ProtectedRoute>
          }
        />

        {/* =========================
            EDIT BOOK
        ========================== */}
        <Route
          path="/edit-book/:id"
          element={
            <ProtectedRoute>
              <EditBook />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;