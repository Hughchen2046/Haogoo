import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// 註冊 Chart.js 元件
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 指標資料
const dividendSummary = {
  fillRate: "89.96%",
  avgDays: 52,
  totalDividend: 20.702,
};

// 長條圖資料
const dividendData = [
  { year: "2016", cash: 0.5, highlight: false },
  { year: "2017", cash: 0.6, highlight: false },
  { year: "2018", cash: 0.8, highlight: false },
  { year: "2019", cash: 1.0, highlight: false },
  { year: "2020", cash: 0.85, highlight: false },
  { year: "2021", cash: 1.05, highlight: false },
  { year: "2022", cash: 1.2, highlight: false },
  { year: "2023", cash: 1.3, highlight: false },
  { year: "2024", cash: 3.63, highlight: true },
  { year: "2025", cash: 2.0, highlight: false },
];

// Chart.js 資料
const data = {
  labels: dividendData.map((d) => d.year),
  datasets: [
    {
      label: "現金股利",
      data: dividendData.map((d) => d.cash),
      backgroundColor: dividendData.map((d) =>
        d.highlight ? "#3343FF" : "#CBD9FF"
      ),
      borderRadius: 8,
    },
  ],
};

// Chart.js 配置
const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (tooltipItem) => `現金股利: ${tooltipItem.raw}`,
      },
    },
    title: {
      display: true,
      text: "近10年現金股利",
      font: { size: 16 },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "股利 (元)",
      },
    },
    x: {
      title: {
        display: true,
        text: "年份",
      },
    },
  },
};

export default function DividendPolicy() {
  return (
    <div className="container my-5">
      {/* 指標卡片區 */}
      <div
        className="d-grid gap-3 mb-4"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        {[
          { title: "填息機率", value: dividendSummary.fillRate },
          { title: "平均填息天數", value: dividendSummary.avgDays },
          {
            title: "近10年現金股利總額",
            value: `$${dividendSummary.totalDividend.toFixed(3)}`,
          },
        ].map((card, idx) => (
          <div key={idx} className="card rounded-4 shadow-sm text-center">
            <div className="card-body">
              <div className="text-muted mb-1">{card.title}</div>
              <div className="fs-3 fw-bold">{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart.js 長條圖 */}
      <div className="card rounded-4 shadow-sm p-3">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
