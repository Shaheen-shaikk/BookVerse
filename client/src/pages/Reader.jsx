import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

function Reader() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const [readerLoading, setReaderLoading] =
    useState(true);

  const [readerError, setReaderError] =
    useState("");

  const [currentFragment, setCurrentFragment] =
    useState(null);

  const [savedFragment, setSavedFragment] =
    useState(null);

  const readerRef = useRef(null);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // =====================================================
  // FETCH BOOK
  // =====================================================

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(
          `/books/${id}`
        );

        setBook(res.data);
      } catch (err) {
        console.error(
          "Reader Book Error:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // =====================================================
  // ADD BOOK TO READING HISTORY
  // =====================================================

  useEffect(() => {
    if (!id || !user?.id) {
      return;
    }

    const saveToReadingHistory =
      async () => {
        try {
          await API.put(
            `/users/history/${id}`,
            {
              userId: user.id,
            }
          );

          console.log(
            "🕘 Reading history updated"
          );
        } catch (err) {
          console.error(
            "Reading History Error:",
            err
          );
        }
      };

    saveToReadingHistory();
  }, [id]);

  // =====================================================
  // LOAD SAVED POSITION
  // =====================================================

  useEffect(() => {
    if (!id) return;

    const storageKey =
      `readora-reading-position-${id}`;

    const saved =
      localStorage.getItem(storageKey);

    if (saved) {
      setSavedFragment(saved);
    }
  }, [id]);

  // =====================================================
  // GET INTERNET ARCHIVE ID
  // =====================================================

  const getArchiveId = () => {
    if (book?.archiveId) {
      return book.archiveId;
    }

    if (book?.readUrl) {
      const match =
        book.readUrl.match(
          /archive\.org\/details\/([^/?#]+)/
        );

      if (match) {
        return match[1];
      }
    }

    return null;
  };

  // =====================================================
  // LOAD SCRIPT
  // =====================================================

  const loadScript = (src) => {
    return new Promise(
      (resolve, reject) => {
        const existing =
          document.querySelector(
            `script[src="${src}"]`
          );

        if (existing) {
          resolve();
          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.src = src;
        script.async = false;

        script.onload = () =>
          resolve();

        script.onerror = () =>
          reject(
            new Error(
              `Failed to load ${src}`
            )
          );

        document.body.appendChild(
          script
        );
      }
    );
  };

  // =====================================================
  // LOAD BOOKREADER
  // =====================================================

  useEffect(() => {
    if (!book) return;

    const archiveId =
      getArchiveId();

    if (!archiveId) {
      setReaderLoading(false);
      return;
    }

    let cancelled = false;

    const initializeReader =
      async () => {
        try {
          setReaderLoading(true);
          setReaderError("");

          // -------------------------------------------------
          // Load BookReader CSS
          // -------------------------------------------------

          if (
            !document.getElementById(
              "readora-bookreader-css"
            )
          ) {
            const link =
              document.createElement(
                "link"
              );

            link.id =
              "readora-bookreader-css";

            link.rel = "stylesheet";

            link.href =
              "/BookReader/BookReader.css";

            document.head.appendChild(
              link
            );
          }

          // -------------------------------------------------
          // Load dependencies in correct order
          // -------------------------------------------------

          await loadScript(
            "/BookReader/webcomponents-bundle.js"
          );

          await loadScript(
            "/BookReader/jquery-3.js"
          );

          await loadScript(
            "/BookReader/BookReader.js"
          );

          await loadScript(
            "/BookReader/plugins/plugin.iiif.js"
          );

          if (cancelled) return;

          if (!window.BookReader) {
            throw new Error(
              "BookReader was not loaded."
            );
          }

          // -------------------------------------------------
          // Get Internet Archive IIIF Manifest
          // -------------------------------------------------

          const manifestUrl =
            `https://iiif.archive.org/iiif/3/${archiveId}/manifest.json`;

          console.log(
            "📚 Loading IIIF manifest:",
            manifestUrl
          );

          const response =
            await fetch(
              manifestUrl
            );

          if (!response.ok) {
            throw new Error(
              `IIIF manifest failed: ${response.status}`
            );
          }

          const manifest =
            await response.json();

          if (cancelled) return;

          // -------------------------------------------------
          // Clear previous reader
          // -------------------------------------------------

          const container =
            document.getElementById(
              "BookReader"
            );

          if (!container) {
            throw new Error(
              "BookReader container not found."
            );
          }

          container.innerHTML = "";

          // -------------------------------------------------
          // CREATE BOOKREADER
          // -------------------------------------------------

          const br =
            new window.BookReader({
              ui: "embed",

              el: "#BookReader",

              bookTitle:
                book.title,

              bookUrl:
                `https://archive.org/details/${archiveId}`,

              imagesBaseURL:
                "/BookReader/images/",

              plugins: {
                iiif: {
                  manifest:
                    manifest,
                },
              },
            });

          readerRef.current = br;

          // -------------------------------------------------
          // LISTEN FOR PAGE CHANGES
          // -------------------------------------------------

          if (
            window.BookReader
              .eventNames &&
            window.BookReader
              .eventNames
              .fragmentChange
          ) {
            br.bind(
              window.BookReader
                .eventNames
                .fragmentChange,
              () => {
                try {
                  const params =
                    br.paramsFromCurrent();

                  const fragment =
                    br.fragmentFromParams(
                      params
                    );

                  console.log(
                    "📖 Current BookReader position:",
                    fragment
                  );

                  setCurrentFragment(
                    fragment
                  );
                } catch (err) {
                  console.error(
                    "Fragment change error:",
                    err
                  );
                }
              }
            );
          }

          // -------------------------------------------------
          // INITIALIZE
          // -------------------------------------------------

          br.init();

          // -------------------------------------------------
          // RESTORE SAVED POSITION
          // -------------------------------------------------

          if (savedFragment) {
            setTimeout(() => {
              try {
                console.log(
                  "🔖 Restoring saved position:",
                  savedFragment
                );

                const params =
                  br.paramsFromFragment(
                    savedFragment
                  );

                br.updateFromParams(
                  params
                );

                setCurrentFragment(
                  savedFragment
                );
              } catch (err) {
                console.error(
                  "Could not restore bookmark:",
                  err
                );
              }
            }, 1000);
          }

          setReaderLoading(false);
        } catch (err) {
          console.error(
            "❌ BookReader Error:",
            err
          );

          if (!cancelled) {
            setReaderError(
              err.message ||
                "Unable to load the reader."
            );

            setReaderLoading(false);
          }
        }
      };

    initializeReader();

    return () => {
      cancelled = true;

      if (readerRef.current) {
        try {
          if (
            typeof readerRef.current
              .cleanup ===
            "function"
          ) {
            readerRef.current.cleanup();
          }
        } catch (err) {
          console.warn(
            "BookReader cleanup warning:",
            err
          );
        }

        readerRef.current = null;
      }
    };
  }, [book, savedFragment]);

  // =====================================================
  // SAVE BOOKMARK
  // =====================================================

  const saveBookmarkPosition = () => {
    if (!user) {
      alert(
        "Please login first to save your reading position."
      );

      return;
    }

    if (!currentFragment) {
      alert(
        "📖 Please turn a page first so Readora can detect your reading position."
      );

      return;
    }

    const storageKey =
      `readora-reading-position-${id}`;

    localStorage.setItem(
      storageKey,
      currentFragment
    );

    setSavedFragment(
      currentFragment
    );

    alert(
      `🔖 Bookmark saved at ${currentFragment}`
    );
  };

  // =====================================================
  // CONTINUE READING
  // =====================================================

  const continueReading = () => {
    if (!savedFragment) {
      return;
    }

    const br =
      readerRef.current;

    if (!br) {
      alert(
        "Reader is still loading. Please try again."
      );

      return;
    }

    try {
      const params =
        br.paramsFromFragment(
          savedFragment
        );

      br.updateFromParams(
        params
      );

      setCurrentFragment(
        savedFragment
      );
    } catch (err) {
      console.error(
        "Continue Reading Error:",
        err
      );

      alert(
        "Unable to restore the saved position."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="home">
        <h2>
          📖 Loading Reader...
        </h2>
      </div>
    );
  }

  // =====================================================
  // BOOK NOT FOUND
  // =====================================================

  if (!book) {
    return (
      <div className="home">
        <h2>
          Book not found 📚
        </h2>

        <Link to="/books">
          <button>
            ← Back to Books
          </button>
        </Link>
      </div>
    );
  }

  const archiveId =
    getArchiveId();

  // =====================================================
  // NO ARCHIVE COPY
  // =====================================================

  if (!archiveId) {
    return (
      <div className="home">
        <h2>
          {book.title}
        </h2>

        <p>
          Unfortunately, an Internet Archive
          reading copy is not available.
        </p>

        <Link
          to={`/books/${book._id}`}
        >
          <button>
            ← Back to Book
          </button>
        </Link>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "15px",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
            }}
          >
            📖 {book.title}
          </h2>

          <p
            style={{
              margin: "5px 0",
            }}
          >
            ✍ {book.author}
          </p>
        </div>

        <Link
          to={`/books/${book._id}`}
        >
          <button>
            ← Back to Book
          </button>
        </Link>
      </div>

      {/* READER */}

      <div
        style={{
          width: "100%",
          height: "80vh",
          border:
            "1px solid #ddd",
          borderRadius: "10px",
          overflow: "hidden",
          background: "#111",
          position: "relative",
        }}
      >
        {readerLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              background: "#111",
              zIndex: 5,
            }}
          >
            <h3>
              📖 Loading BookReader...
            </h3>
          </div>
        )}

        {readerError && (
          <div
            style={{
              padding: "30px",
              color: "white",
            }}
          >
            <h3>
              ❌ Reader Error
            </h3>

            <p>
              {readerError}
            </p>
          </div>
        )}

        <div
          id="BookReader"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {/* READING POSITION */}

      <div
        style={{
          marginTop: "15px",
          padding: "20px",
          borderRadius: "10px",
          background: "#f3f4f6",
          textAlign: "center",
        }}
      >
        <h3>
          🔖 Reading Position
        </h3>

        {currentFragment ? (
          <>
            <p>
              Current reading position:
            </p>

            <strong>
              {currentFragment}
            </strong>
          </>
        ) : (
          <p>
            Turn a page to detect your
            current reading position.
          </p>
        )}

        {/* BOOKMARK BUTTON */}

        <button
          type="button"
          onClick={
            saveBookmarkPosition
          }
          style={{
            marginTop: "12px",
            padding:
              "12px 22px",
            border: "none",
            borderRadius: "8px",
            background:
              "#7c3aed",
            color: "white",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          🔖 Bookmark This Position
        </button>

        {/* SAVED POSITION */}

        {savedFragment && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              background: "white",
              borderRadius: "8px",
            }}
          >
            <p>
              🔖 Saved position:
            </p>

            <strong>
              {savedFragment}
            </strong>

            <br />

            <button
              type="button"
              onClick={
                continueReading
              }
              style={{
                marginTop: "10px",
                padding:
                  "10px 18px",
                border: "none",
                borderRadius: "8px",
                background:
                  "#2563eb",
                color: "white",
                cursor: "pointer",
              }}
            >
              📖 Continue Reading
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reader;