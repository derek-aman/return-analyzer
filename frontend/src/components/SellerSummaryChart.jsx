import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function SellerSummaryChart({ breakdown }) {
  const labels = Object.keys(breakdown);
  const values = Object.values(breakdown);
  const maxVal = Math.max(...values);

  const data = {
    labels,
    datasets: [{
      label: "Return %",
      data: values,
      backgroundColor: values.map(v => v === maxVal ? "rgba(200,255,0,0.85)" : "rgba(124,92,252,0.45)"),
      hoverBackgroundColor: values.map(v => v === maxVal ? "#c8ff00" : "rgba(124,92,252,0.7)"),
      borderRadius: 10,
      borderSkipped: false,
      maxBarThickness: 56,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#13131f",
        borderColor: "rgba(255,255,255,0.08)", borderWidth: 1,
        titleColor: "#eeeaf4", bodyColor: "#7a7890",
        padding: 12, displayColors: false,
        titleFont: { family: "'Clash Display', sans-serif", weight: "600", size: 13 },
        bodyFont:  { family: "'DM Mono', monospace", size: 12 },
        callbacks: { label: ctx => `${ctx.parsed.y}%` },
      },
    },
    scales: {
      x: {
        grid: { display: false }, border: { display: false },
        ticks: { color: "#3a3850", font: { family: "'DM Mono', monospace", size: 11 } },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.04)" }, border: { display: false },
        ticks: { color: "#3a3850", font: { family: "'DM Mono', monospace", size: 10 }, callback: v => `${v}%`, maxTicksLimit: 5 },
      },
    },
  };

  const topCategory = labels[values.indexOf(maxVal)];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <span className="chart-sub">Category Breakdown</span>
          <span className="chart-title">{labels.length} Categories</span>
        </div>
        <div>
          <span className="chart-top-label">Top reason</span>
          <span className="badge badge-lime">{topCategory}</span>
        </div>
      </div>
      <div className="chart-canvas-wrap">
        <Bar data={data} options={options} />
      </div>
      <div className="chart-stat-row">
        {labels.map((label, i) => (
          <div key={label} className="chart-stat-pill">
            <span className="chart-stat-val" style={{ color: values[i] === maxVal ? "#c8ff00" : "var(--text-1)" }}>
              {values[i]}%
            </span>
            <span className="chart-stat-key">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}