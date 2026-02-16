import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function SellerSummaryChart({ breakdown }) {
  const labels = Object.keys(breakdown);
  const values = Object.values(breakdown);

  const data = {
    labels,
    datasets: [
      {
        label: "Return Reasons (%)",
        data: values,
        backgroundColor: [
          "#f87171", // red
          "#fbbf24", // yellow
          "#a78bfa", // purple
          "#60a5fa", // blue
          "#9ca3af"  // gray
        ],
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-lg mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
