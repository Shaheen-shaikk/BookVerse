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

function App() {
  return (
    <>
      <Navbar />

 <Routes>
  <Route path="/" element={<Home />} />

  <Route path="/books" element={<Books />} />

  <Route path="/books/:id" element={<BookDetails />} />

  <Route path="/explore" element={<ExploreBooks />} />

  <Route
    path="/free-books"
    element={<FreeBooks />}
  />

  <Route path="/login" element={<Login />} />

  <Route path="/register" element={<Register />} />

  <Route path="/profile" element={<Profile />} />

  <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    }
  />
  <Route
  path="/author"
  element={
    <ProtectedRoute>
      <AuthorDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/publish-book"
  element={
    <ProtectedRoute>
      <PublishBook />
    </ProtectedRoute>
  }
/>
<Route
  path="/my-books"
  element={
    <ProtectedRoute>
      <MyBooks />
    </ProtectedRoute>
  }
/>

<Route
  path="/reader-feedback"
  element={
    <ProtectedRoute>
      <ReaderFeedback />
    </ProtectedRoute>
  }
/>
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