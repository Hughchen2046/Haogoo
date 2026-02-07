import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
import dayjs from 'dayjs';

// 指標資料
const dividendSummary = {
  fillRate: '89.96%',
  avgDays: 52,
  totalDividend: 20.702,
};

// 長條圖資料
const dividendData = [
  { year: '2016', cash: 0.5 },
  { year: '2017', cash: 0.6 },
  { year: '2018', cash: 0.8 },
  { year: '2019', cash: 1.0 },
  { year: '2020', cash: 0.85 },
  { year: '2021', cash: 1.05 },
  { year: '2022', cash: 1.2 },
  { year: '2023', cash: 1.3 },
  { year: '2024', cash: 3.63 },
  { year: '2025', cash: 2.0 },
];

// 計算最高股利，方便百分比顯示
const maxCash = Math.max(...dividendData.map((d) => d.cash));

export default function DividendPolicy() {
  const [benifitData, setBenifitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const getBenifitData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/stockbenifit?id=0056');
        console.log('完整回應:', response.data);

        // 正確的資料結構：response.data.data[0].data
        const stock = response.data.data[0]; // 取得股票物件 { id: "0056", data: [...] }
        console.log('股票物件:', stock);

        if (stock && stock.data) {
          setBenifitData(stock.data); // 設定股利陣列
          console.log('股利資料:', stock.data);
        } else {
          setError('找不到股利資料');
        }
      } catch (error) {
        console.error('API 錯誤:', error);
        setError('無法載入股利資料');
      } finally {
        setLoading(false);
      }
    };
    getBenifitData();
  }, []);

  // 處理股利資料，轉換成圖表格式
  const chartData = useMemo(() => {
    if (benifitData.length === 0) return [];

    return benifitData.map((item) => ({
      year: dayjs(item.date).format('YYYY'), // 修正：使用 AnnouncementDate
      cash: item.CashEarningsDistribution || 0,
    }));
  }, [benifitData]);

  console.log('圖表資料:', chartData);

  // 合併圖表資料（同一年份的股利加總）
  const mergeChartData = useMemo(() => {
    if (chartData.length === 0) return [];

    const merged = chartData.reduce((acc, item) => {
      const year = item.year;
      const cash = item.cash;
      if (!acc[year]) {
        acc[year] = { year, cash: 0 };
      }
      acc[year].cash += cash;
      return acc;
    }, {}); // 修正：加入初始值 {}

    return Object.values(merged);
  }, [chartData]);

  console.log('合併資料:', mergeChartData);

  // 轉換成 Chart.js 格式
  const barData = useMemo(() => {
    if (mergeChartData.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: '現金股利(元)',
            data: [],
          },
        ],
      };
    }

    const sorted = [...mergeChartData].sort((a, b) => Number(a.year) - Number(b.year));
    return {
      labels: sorted.map((x) => x.year),
      datasets: [
        {
          label: '現金股利(元)',
          data: sorted.map((x) => Number(x.cash ?? 0).toFixed(3)),
          backgroundColor: 'rgba(51, 67, 255, 0.8)',
          borderColor: 'rgba(51, 67, 255, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [mergeChartData]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 避免重疊
    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext('2d');

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: barData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
            },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [barData]);

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
            <div className="fs-3 fw-bold">${dividendSummary.totalDividend.toFixed(3)}</div>
          </div>
        </div>
      </div>

     

      {/* 第三排：測試股利長條圖卡片 */}
      <div className="row g-3">
        <div className="col-12">
          <div className="card rounded-4 shadow-sm p-3" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="text-muted mb-2 text-center">近10年現金股利</div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '300px',
                padding: '0 10px',
                borderBottom: '1px solid #dee2e6',
              }}
            >
              <div className="w-100 h-100">
                <canvas ref={canvasRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
