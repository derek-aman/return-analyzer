export default function PredictionCard({ category }) {
  if (!category) return null;

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        🤖 AI Prediction
      </h2>

      <div className="text-3xl font-semibold text-indigo-600">
        {category}
      </div>
    </div>
  );
}
