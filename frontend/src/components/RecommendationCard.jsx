export default function RecommendationCard({ recommendation }) {
  return (
    <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-6">
      <h2 className="font-semibold text-green-800">💡 Recommendation</h2>
      <p className="text-green-700">{recommendation}</p>
    </div>
  );
}
