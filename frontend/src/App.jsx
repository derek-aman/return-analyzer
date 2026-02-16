import { useState } from "react";
import axios from "axios";
import ReasonForm from "./components/ReasonForm";
import PredictionCard from "./components/PredictionCard";
import SellerSummaryChart from "./components/SellerSummaryChart";
import SellerSummaryCard from "./components/SellerSummaryCard"; // ✅ Add text summary display
import './App.css';

export default function App() {
  const [result, setResult] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [summaryText, setSummaryText] = useState(null);

  const fetchSummary = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/analyze/seller/seller1/summary"
      );

      if (data.percentages) setBreakdown(data.percentages);
      if (data.summary) setSummaryText(data.summary);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch seller summary.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white drop-shadow-md">
          📦 Return Reason Analyzer
        </h1>

        <ReasonForm onResult={setResult} />

        {result && <PredictionCard category={result.aiPrediction} />}

        <button
          onClick={fetchSummary}
          className="bg-white/30 hover:bg-white/50 text-white px-6 py-3 rounded-full shadow-lg"
        >
          View Seller Summary
        </button>

        {breakdown && <SellerSummaryChart breakdown={breakdown} />}
        {summaryText && <SellerSummaryCard summary={summaryText} />}
      </div>
    </div>
  );
}
