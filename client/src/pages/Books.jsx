import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import API from "../services/api";

function Books() {
  const [readoraBooks, setReadoraBooks] = useState([]);
  const [openLibraryBooks, setOpenLibraryBooks] =
    useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const [openLibraryPage, setOpenLibraryPage] =
    useState(1);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] =
    useState(false);

  const [error, setError] = useState("");

  const [hasMoreOpenLibrary, setHasMoreOpenLibrary] =
    useState(true);

  const booksPerPage = 12;

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadInitialBooks();
  }, []);

  const loadInitialBooks = async () => {
    setLoading(true);
    setError("");

    let readoraLoaded = false;
    let openLibraryLoaded = false;

    // =====================================================
    // READORA BOOKS
    // =====================================================

    try {
      const readoraResponse =
        await API.get("/books");

      console.log(
        "Readora Books:",
        readoraResponse.data
      );

      setReadoraBooks(
        Array.isArray(readoraResponse.data)
          ? readoraResponse.data
          : []
      );

      readoraLoaded = true;
    } catch (err) {
      console.error(
        "Readora Books Error:",
        err
      );
    }

    // =====================================================
    // OPEN LIBRARY
    // =====================================================

    try {
      const openLibraryResponse =
        await API.get(
          "/books/openlibrary",
          {
            params: {
              search: "popular",
              page: 1,
              limit: 20,
            },
          }
        );

      console.log(
        "Open Library Books:",
        openLibraryResponse.data
      );

      const books =
        openLibraryResponse.data?.books || [];

      setOpenLibraryBooks(books);

      setOpenLibraryPage(1);

      setHasMoreOpenLibrary(
        books.length === 20
      );

      openLibraryLoaded = true;
    } catch (err) {
      console.error(
        "Open Library Books Error:",
        err
      );
    }

    // =====================================================
    // ERROR ONLY IF BOTH FAILED
    // =====================================================

    if (
      !readoraLoaded &&
      !openLibraryLoaded
    ) {
      setError(
        "Unable to load books."
      );
    }

    setLoading(false);
  };

  // =====================================================
  // SEARCH OPEN LIBRARY
  // =====================================================

  const searchOpenLibrary = async () => {
    const value = search.trim();

    if (!value) {
      await loadInitialBooks();
      return;
    }

    try {
      setSearching(true);
      setError("");

      const response =
        await API.get(
          "/books/openlibrary",
          {
            params: {
              search: value,
              page: 1,
              limit: 20,
            },
          }
        );

      const books =
        response.data?.books || [];

      setOpenLibraryBooks(books);

      setOpenLibraryPage(1);

      setHasMoreOpenLibrary(
        books.length === 20
      );
    } catch (err) {
      console.error(
        "Open Library Search Error:",
        err
      );

      setError(
        "Unable to search Open Library."
      );
    } finally {
      setSearching(false);
    }
  };

  // =====================================================
  // ENTER KEY SEARCH
  // =====================================================

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchOpenLibrary();
    }
  };

  // =====================================================
  // LOAD MORE OPEN LIBRARY BOOKS
  // =====================================================

  const loadMoreOpenLibrary = async () => {
    if (!hasMoreOpenLibrary) {
      return;
    }

    try {
      setSearching(true);

      const nextPage =
        openLibraryPage + 1;

      const value =
        search.trim() || "popular";

      const response =
        await API.get(
          "/books/openlibrary",
          {
            params: {
              search: value,
              page: nextPage,
              limit: 20,
            },
          }
        );

      const newBooks =
        response.data?.books || [];

      setOpenLibraryBooks(
        (previousBooks) => [
          ...previousBooks,
          ...newBooks,
        ]
      );

      setOpenLibraryPage(
        nextPage
      );

      setHasMoreOpenLibrary(
        newBooks.length === 20
      );
    } catch (err) {
      console.error(
        "Load More Error:",
        err
      );
    } finally {
      setSearching(false);
    }
  };

  // =====================================================
  // COMBINE BOOKS
  // =====================================================

  const allBooks = [
    ...readoraBooks,
    ...openLibraryBooks,
  ];

  // =====================================================
  // FILTER
  // =====================================================

  let filteredBooks =
    allBooks.filter((book) => {
      const value =
        search.trim().toLowerCase();

      const matchesSearch =
        !value ||
        book.title
          ?.toLowerCase()
          .includes(value) ||
        book.author
          ?.toLowerCase()
          .includes(value) ||
        book.category
          ?.toLowerCase()
          .includes(value);

      const matchesCategory =
        category === "All" ||
        book.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  // =====================================================
  // SORT
  // =====================================================

  switch (sort) {
    case "az":
      filteredBooks.sort((a, b) =>
        (a.title || "").localeCompare(
          b.title || ""
        )
      );
      break;

    case "za":
      filteredBooks.sort((a, b) =>
        (b.title || "").localeCompare(
          a.title || ""
        )
      );
      break;

    case "rating":
      filteredBooks.sort(
        (a, b) =>
          (b.rating || 0) -
          (a.rating || 0)
      );
      break;

    case "newest":
      filteredBooks.sort(
        (a, b) =>
          (b.publishedYear || 0) -
          (a.publishedYear || 0)
      );
      break;

    default:
      break;
  }

  // =====================================================
  // LOCAL PAGINATION
  // =====================================================

  const totalPages = Math.ceil(
    filteredBooks.length /
      booksPerPage
  );

  const firstIndex = 0;

  const currentBooks =
    filteredBooks.slice(
      firstIndex,
      firstIndex + booksPerPage
    );

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    "All",
    ...new Set(
      allBooks
        .map((book) => book.category)
        .filter(Boolean)
    ),
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="home">
        <h1>
          📚 Books Library
        </h1>

        <h2>
          Loading books...
        </h2>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (
    error &&
    allBooks.length === 0
  ) {
    return (
      <div className="home">
        <h1>
          📚 Books Library
        </h1>

        <h3>
          {error}
        </h3>

        <button
          type="button"
          onClick={loadInitialBooks}
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="home">

      {/* =================================================
          PAGE TITLE
      ================================================= */}

      <h1>
        📚 Books Library
      </h1>

      <p>
        Discover books from Readora
        and Open Library.
      </p>

      {/* =================================================
          SEARCH + FILTERS
      ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
          margin: "25px 0",
        }}
      >

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          onKeyDown={
            handleSearchKeyDown
          }
          style={{
            padding: "10px",
            width: "280px",
            borderRadius: "8px",
            border:
              "1px solid #ccc",
          }}
        />

        <button
          type="button"
          onClick={
            searchOpenLibrary
          }
          disabled={searching}
        >
          {searching
            ? "Searching..."
            : "🔍 Search"}
        </button>

        {/* CATEGORY */}

        <select
          value={category}
          onChange={(e) => {
            setCategory(
              e.target.value
            );
          }}
          style={{
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          {categories.map(
            (cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>
            )
          )}
        </select>

        {/* SORT */}

        <select
          value={sort}
          onChange={(e) =>
            setSort(
              e.target.value
            )
          }
          style={{
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <option value="default">
            Default
          </option>

          <option value="az">
            A-Z
          </option>

          <option value="za">
            Z-A
          </option>

          <option value="rating">
            Highest Rating
          </option>

          <option value="newest">
            Newest
          </option>
        </select>

      </div>

      {/* =================================================
          SEARCH STATUS
      ================================================= */}

      {search.trim() && (
        <p
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Results for{" "}
          <strong>
            "{search}"
          </strong>
        </p>
      )}

      {/* =================================================
          RESULT COUNT
      ================================================= */}

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <strong>
          {filteredBooks.length}
        </strong>{" "}
        books currently shown
      </div>

      {/* =================================================
          BOOK GRID
      ================================================= */}

      <div className="book-list">

        {currentBooks.length > 0 ? (
          currentBooks.map(
            (book, index) => (
              <BookCard
                key={
                  book._id ||
                  book.externalId ||
                  `${book.title}-${index}`
                }

                id={
                  book._id ||
                  book.externalId
                }

                title={
                  book.title
                }

                author={
                  book.author
                }

                image={
                  book.image
                }

                category={
                  book.category
                }

                rating={
                  book.rating
                }

                publishedYear={
                  book.publishedYear
                }

                source={
                  book.source ||
                  "readora"
                }

                readUrl={
                  book.readUrl
                }

                ebookAccess={
                  book.ebookAccess
                }
              />
            )
          )
        ) : (
          <h3>
            No Books Found 📚
          </h3>
        )}

      </div>

      {/* =================================================
          LOAD MORE OPEN LIBRARY
      ================================================= */}

      {hasMoreOpenLibrary && (
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          <button
            type="button"
            onClick={
              loadMoreOpenLibrary
            }
            disabled={searching}
            style={{
              padding:
                "12px 25px",
              borderRadius:
                "8px",
              cursor:
                searching
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {searching
              ? "Loading..."
              : "📚 Load More Books"}
          </button>
        </div>
      )}

    </div>
  );
}

export default Books;