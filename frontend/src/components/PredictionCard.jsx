export default function PredictionCard({ category }) {
  const palette = {
    "Changed Mind": { color: "#7c5cfc", bg: "rgba(124,92,252,0.1)", border: "rgba(124,92,252,0.28)" },
    "Wrong Size":   { color: "#f7a76e", bg: "rgba(247,167,110,0.1)", border: "rgba(247,167,110,0.28)" },
    "Damaged":      { color: "#f76e7a", bg: "rgba(247,110,122,0.1)", border: "rgba(247,110,122,0.28)" },
    "Other":        { color: "#c8ff00", bg: "rgba(200,255,0,0.08)",  border: "rgba(200,255,0,0.28)"  },
  };
  const c = palette[category] || palette["Other"];

  return (
    <div className="pred-card animate-slide-in" style={{ marginBottom: 0 }}>
      <div
        style={{
          position: "absolute", top: 22, right: 22,
          width: 42, height: 42, borderRadius: "50%",
          background: c.bg, border: `1px solid ${c.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color }} />
      </div>

      <p className="pred-label">
        <span style={{ display: "inline-block", width: 14, height: 1, background: "var(--text-3)" }} />
        AI Classification Result
      </p>

      <h2 className="pred-category">{category}</h2>

      <div className="pred-footer">
        <span className="pred-status-badge" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
          <span className="pred-dot" style={{ background: c.color }} />
          Classified
        </span>
        <span className="pred-confidence">High confidence</span>
      </div>
    </div>
  );
}