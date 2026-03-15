export default function SellerSummaryCard({ summary }) {
  const formatted = summary
    .replace(/---/g, "<hr/>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^[•\-\*]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>")
    .replace(/\n{2,}/g, "<br/>")
    .replace(/\n/g, " ");

  return (
    <div className="summary-card animate-slide-in">
      <div className="summary-header">
        <div className="summary-header-left">
          <div className="summary-icon">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1.5 3.5h10M1.5 6.5h7M1.5 9.5h5" stroke="#7c5cfc" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.13em", textTransform: "uppercase", color: "var(--violet)" }}>
            Executive Summary
          </span>
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>
          AI Generated
        </span>
      </div>
      <div className="summary-body">
        <div className="summary-prose" dangerouslySetInnerHTML={{ __html: formatted }} />
      </div>
      <div className="summary-footer">
        <div className="pulse-dot" style={{ width: 6, height: 6 }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.08em" }}>
          Analysis complete — {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}