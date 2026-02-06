import React from "react";

// 指標資料
const dividendSummary = {
  fillRate: "89.96%",
  avgDays: 52,
  totalDividend: 20.702,
};

// 長條圖資料
const dividendData = [
  { year: "2016", cash: 0.5 },
  { year: "2017", cash: 0.6 },
  { year: "2018", cash: 0.8 },
  { year: "2019", cash: 1.0 },
  { year: "2020", cash: 0.85 },
  { year: "2021", cash: 1.05 },
  { year: "2022", cash: 1.2 },
  { year: "2023", cash: 1.3 },
  { year: "2024", cash: 3.63 },
  { year: "2025", cash: 2.0 },
];

// 計算最高股利，方便百分比顯示
const maxCash = Math.max(...dividendData.map(d => d.cash));

export default function DividendPolicy() {
  return (
    <div className="container my-4">
      {/* 第一排：三個資訊卡 */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <div className="card rounded-4 shadow-sm p-3 text-center">
            <div className="text-muted mb-1">填息機率</div>
            <div className="fs-3 fw-bold">{dividendSummary.fillRate}</div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card rounded-4 shadow-sm p-3 text-center">
            <div className="text-muted mb-1">平均填息天數</div>
            <div className="fs-3 fw-bold">{dividendSummary.avgDays}</div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card rounded-4 shadow-sm p-3 text-center">
            <div className="text-muted mb-1">近10年現金股利總額</div>
            <div className="fs-3 fw-bold">
              ${dividendSummary.totalDividend.toFixed(3)}
            </div>
          </div>
        </div>
      </div>

      {/* 第二排：股利長條圖卡片 */}
      <div className="row g-3">
        <div className="col-12">
          <div className="card rounded-4 shadow-sm p-3" style={{ backgroundColor: "#f8f9fa" }}>
            <div className="text-muted mb-2 text-center">近10年現金股利</div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                height: "200px",
                padding: "0 10px",
                borderBottom: "1px solid #dee2e6",
              }}
            >
              {dividendData.map((d, idx) => {
                const heightPercent = (d.cash / maxCash) * 100;
                const isLatest = idx === dividendData.length - 2; // 高亮 2024 年

                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "20px",
                      flexShrink: 0,
                    }}
                  >
                    {/* 柱子 */}
                    <div
                      style={{
                        height: `${heightPercent}%`,
                        width: "100%",
                        backgroundColor: isLatest ? "#3343FF" : "#CBD9FF",
                        borderRadius: "8px 8px 0 0",
                        transition: "height 0.5s, background-color 0.3s",
                      }}
                    ></div>

                    {/* 股利數值 */}
                    <div
                      style={{
                        fontSize: "0.7rem",
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
                        fontSize: "0.7rem",
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
      </div>
    </div>
  );
}
