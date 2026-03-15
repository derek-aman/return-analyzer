import { useState } from "react";
import axios from "axios";

export default function ReasonForm({ onResult }) {
  const [reason, setReason]   = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/analyze/analyze", {
        userId: "user1", productId: "prod1",
        sellerId: "seller1", reasonText: reason,
      });
      if (data.error) { alert("Error: " + data.error); return; }
      if (typeof onResult === "function") onResult(data);
      setReason("");
    } catch (err) {
      console.error(err);
      alert("Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="form-card">
      <div className="form-top">
        <span className="form-top-label">Customer Feedback</span>
        <span className={`char-count${reason.length > 0 ? " active" : ""}`}>{reason.length} chars</span>
      </div>
      <div className="form-divider" />
      <textarea
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder="Paste customer feedback here — e.g. 'The zipper broke on first use...'"
        rows={7}
        className="form-textarea"
      />
      <div className="form-hint">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
          <path d="M6 5.5V8.5M6 3.5V4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        <span>Raw customer text gives the most accurate classification</span>
      </div>
      <button type="submit" disabled={loading || !reason.trim()} className="form-submit">
        {loading
          ? <><span className="spinner" /><span>Analyzing…</span></>
          : <>
              <span>Analyze Return</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
        }
      </button>
    </form>
  );
}