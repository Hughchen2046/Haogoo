import React from "react";

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
  { year: "2024", cash: 3.63, highlight: true }, // 高亮柱子
  { year: "2025", cash: 2.0, highlight: false },
];

const maxCash = Math.max(...dividendData.map((d) => d.cash));

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

      {/* 長條圖區 */}
      <div className="card rounded-4 shadow-sm p-3" style={{ backgroundColor: "#f8f9fa" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            height: "360px", // 父容器高度固定
            padding: "0 10px",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          {dividendData.map((d, idx) => {
            const barHeight = (d.cash / maxCash) * 100; // 百分比高度
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "40px",
                  flexShrink: 0,
                }}
              >
                {/* 柱子 */}
                <div
                  style={{
                    height: `${barHeight}%`,
                    width: "100%",
                    backgroundColor: d.highlight ? "#3343FF" : "#CBD9FF",
                    borderRadius: "8px 8px 0 0",
                    transition: "height 0.5s, background-color 0.3s",
                  }}
                ></div>

                {/* 股利數值 */}
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    marginTop: "4px",
                    textAlign: "center",
                  }}
                >
                  {d.cash}
                </div>

                {/* 年份 */}
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#6c757d",
                    marginTop: "2px",
                    textAlign: "center",
                  }}
                >
                  {d.year}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
