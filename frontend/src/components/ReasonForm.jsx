import { useState } from "react";
import axios from "axios";

export default function ReasonForm({ onResult }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReason = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      alert("Please enter a reason before submitting.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/analyze/analyze",
        {
          userId: "user1",
          productId: "prod1",
          sellerId: "seller1",
          reasonText: reason,
        }
      );

      if (data.error) {
        alert("Error: " + data.error);
        return;
      }

      // ⭐ Safety guard (never crash again)
      if (typeof onResult === "function") {
        onResult(data);
      } else {
        console.error("onResult prop missing!", data);
      }

      setReason("");
    } catch (err) {
      console.error(err);
      alert("Request failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <form
        onSubmit={submitReason}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg border border-gray-100"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
          AI Return Reason Analyzer
        </h2>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Describe the reason for return..."
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-black"
        />

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 w-full py-3 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze Reason"}
        </button>
      </form>
    </div>
  );
}
