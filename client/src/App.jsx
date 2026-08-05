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

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

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
</Routes>

    </>
  );
}

export default App;