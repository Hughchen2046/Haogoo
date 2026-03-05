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
import dayJS from 'dayjs';
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const api_Url = import.meta.env.VITE_API_BASE;

export default function DividendPolicy({ stockId }) {
  const [benifitData, setBenifitData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // ==============================
  // 抓資料
  // ==============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 股利資料
        const dividendRes = await axios.get(`${api_Url}/stockbenifit?id=${stockId}`);
        // console.log('股利資料原始回應', dividendRes.data);

        const dividendRaw = dividendRes.data?.data?.[0]?.data || [];
        // console.log('股利資料', dividendRaw);

        setBenifitData(Array.isArray(dividendRaw) ? dividendRaw : []);

        // 股價資料
        const priceRes = await axios.get(`${api_Url}/prices?symbolId=${stockId}`);

        let priceArray = [];
        if (Array.isArray(priceRes.data)) {
          priceArray = priceRes.data;
        } else if (Array.isArray(priceRes.data?.data)) {
          priceArray = priceRes.data.data;
        }

        setPriceData(priceArray);
      } catch (err) {
        console.error(err);
        setError('資料載入失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stockId]);

  // ==============================
  // 排序股價
  // ==============================
  const sortedPriceData = useMemo(() => {
    if (!Array.isArray(priceData)) return [];
    return [...priceData].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [priceData]);

  // ==============================
  // 計算填息與股利
  // ==============================
  const dividendSummary = useMemo(() => {
    if (!benifitData.length) return null;

    const validDividend = benifitData.filter((d) => {
      const cash =
        Number(d.CashEarningsDistribution) || Number(d.cashDividend) || Number(d.cash) || 0;
      return cash > 0 && d.CashExDividendTradingDate;
    });
    // console.log('有效股利資料', validDividend);
    // console.log('sort', sortedPriceData);

    // ===== 填息計算 =====
    // 證交所在除息日前一日,按該公司當天收盤價減除息值,做為除息日之除息參考價,並據以產生開盤競價基準及計算漲跌停板價格
    let successCount = 0;
    let totalDays = 0;
    const fillValid = validDividend.forEach((div) => {
      const exDate = div.CashExDividendTradingDate;

      const previousDay = [...sortedPriceData]
        .reverse()
        .find((p) => new Date(p.date) < new Date(exDate));
      // console.log('除息日前一交易日', previousDay);

      if (!previousDay) return;

      const targetPrice = previousDay.close - div.CashEarningsDistribution;
      // console.log('除息參考價', targetPrice);

      const fillDay = sortedPriceData.find(
        (p) => new Date(p.date) >= new Date(exDate) && Number(p.close) >= Number(targetPrice)
      );
      // console.log('填息日', fillDay);

      if (fillDay) {
        successCount++;
        const days = (new Date(fillDay.date) - new Date(exDate)) / (1000 * 60 * 60 * 24);
        // console.log('成功填息', { exDate, fillDate: fillDay.date, days });
        totalDays += days;
      }
    });
    // console.log('填息計算', { successCount, totalDays, fillValid });

    const fillRate =
      validDividend.length > 0
        ? ((successCount / validDividend.length) * 100).toFixed(2) + '%'
        : '-';

    const avgDays = successCount > 0 ? Math.round(totalDays / successCount) : '-';

    // ===== 年度整理 =====
    const yearly = validDividend.reduce((acc, item) => {
      const rawYear = Number(dayJS(item.date).format('YYYY'));
      // console.log('rawYear', rawYear);
      const year = rawYear < 1911 ? rawYear + 1911 : rawYear;
      const cash =
        Number(item.CashEarningsDistribution) ||
        Number(item.cashDividend) ||
        Number(item.cash) ||
        0;

      if (!acc[year]) acc[year] = { year, cash: 0 };
      acc[year].cash += cash;
      return acc;
    }, {});

    const yearlyArr = Object.values(yearly).sort((a, b) => a.year - b.year);
    const last10 = yearlyArr.slice(-10);
    const totalDividend = last10.reduce((sum, y) => sum + y.cash, 0);
    // console.log('年度股利整理', yearlyArr);

    return {
      fillRate,
      avgDays,
      totalDividend,
      yearlyData: yearlyArr,
    };
  }, [benifitData, sortedPriceData]);

  // ==============================
  // Chart Data
  // ==============================
  const barData = useMemo(() => {
    if (!dividendSummary?.yearlyData?.length) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: dividendSummary.yearlyData.map((x) => x.year),
      datasets: [
        {
          label: '現金股利(元)',
          data: dividendSummary.yearlyData.map((x) => x.cash),
          backgroundColor: 'rgba(51,67,255,0.8)',
        },
      ],
    };
  }, [dividendSummary]);

  // ==============================
  // 建立圖表
  // ==============================
  useEffect(() => {
    if (!canvasRef.current) return;
    if (!barData.labels.length) return;

    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: barData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true },
        },
        scales: {
          y: { beginAtZero: true },
          x: { title: { display: true, text: '年份' } },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [barData]);

  // ==============================
  // UI
  // ==============================
  if (loading) return <div className="text-center py-5">載入中...</div>;
  if (error) return <div className="text-danger text-center py-5">{error}</div>;

  return (
    <div className="container my-4">
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <div className="card p-3 text-center">
            <div className="text-muted">填息機率</div>
            <div className="fs-3 fw-bold">{dividendSummary?.fillRate}</div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 text-center">
            <div className="text-muted">平均填息天數</div>
            <div className="fs-3 fw-bold">{dividendSummary?.avgDays}</div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 text-center">
            <div className="text-muted">近10年現金股利總額</div>
            <div className="fs-3 fw-bold">
              ${dividendSummary ? dividendSummary.totalDividend.toFixed(3) : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-3" style={{ height: 350 }}>
        <div className="text-center mb-2">歷年現金股利</div>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
