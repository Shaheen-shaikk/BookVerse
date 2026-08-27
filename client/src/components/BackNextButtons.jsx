import { useNavigate } from "react-router-dom";

function BackNextButtons({
  nextPath,
  nextLabel = "Next →",
}) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        margin: "20px 0",
        gap: "15px",
      }}
    >
      {/* =========================
          BACK BUTTON
      ========================== */}

      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          background: "#374151",
          color: "white",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        ← Back
      </button>

      {/* =========================
          NEXT BUTTON
      ========================== */}

      {nextPath ? (
        <button
          type="button"
          onClick={() => navigate(nextPath)}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            background: "#111827",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {nextLabel}
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}

export default BackNextButtons;