import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Minus, ChevronRight } from 'lucide-react';
import axios from 'axios';

import DividendPolicy from './DividendPolicy';
import StockKLine from './StockKLine';
import StockPriceTrend from './StockPriceTrend';

export default function StockInfo() {
  const [activeTab, setActiveTab] = useState('股價走勢');
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  const stockUrl = import.meta.env.VITE_symbolsUrl;
  const stockSelect = '0056';
  const tabs = ['股價走勢', '股利政策', '股價 K 線'];

  const tvRef = useRef(null);
  const widgetRef = useRef(null);

  /* ===== 漲跌示意（之後可接真資料） ===== */
  const changePct = 0.5;
  const trend = changePct > 0 ? 'up' : changePct < 0 ? 'down' : 'flat';
  const trendColor =
    trend === 'up'
      ? 'text-danger'
      : trend === 'down'
      ? 'text-success'
      : 'text-secondary';
  const trendBgColor =
    trend === 'up'
      ? 'bg-pink'
      : trend === 'down'
      ? 'bg-pinkgreen'
      : 'border bg-light';

  /* ===== 股票資料 ===== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${stockUrl}?id=${stockSelect}&_embed=prices`
        );

        if (res.data?.data?.length > 0) {
          setStockData(res.data.data[0]);
        } else {
          setStockData(null);
        }
      } catch (err) {
        console.error('載入股票資料失敗:', err);
        setStockData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stockSelect, stockUrl]);

  /* ===== TradingView（只在股價走勢） ===== */
  useEffect(() => {
    if (activeTab !== '股價走勢') return;
    if (!tvRef.current) return;

    tvRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      widgetRef.current = new window.TradingView.widget({
        container_id: 'tradingview_chart',
        symbol: `TWSE:${stockSelect}`,
        interval: 'D',
        width: tvRef.current.offsetWidth,
        height: window.innerWidth < 768 ? 400 : 500,
        timezone: 'Asia/Taipei',
        theme: 'light',
        style: 1,
        locale: 'zh_TW',
        enable_publishing: false,
        allow_symbol_change: false,
      });
    };

    tvRef.current.appendChild(script);

    const resizeObserver = new ResizeObserver(() => {
      widgetRef.current?.resize(
        tvRef.current.offsetWidth,
        window.innerWidth < 768 ? 400 : 500
      );
    });

    resizeObserver.observe(tvRef.current);

    return () => resizeObserver.disconnect();
  }, [activeTab, stockSelect]);

  return (
    <div className="stock-info-page pt-5">
      {/* ===== 麵包屑 ===== */}
      <div className="custom-container mt-5 text-muted mb-3 d-flex align-items-center gap-1 ps-0">
        <span>首頁</span>
        <ChevronRight size={16} />
        <span>{stockSelect} 元大高股息</span>
      </div>

      {/* ===== 股票資訊卡 ===== */}
      <div className="custom-container d-flex justify-content-center mb-4">
        <div className="card bg-light shadow-sm rounded-4 stockInfoCard">
          <div className="card-body">
            <div className="d-flex align-items-center mb-2">
              <h3 className="card-title mb-0">元大高股息</h3>
              <h6 className="card-subtitle text-muted ms-3 mb-0">
                {stockSelect}
              </h6>
            </div>

            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="card-number">36.59</div>
              <div
                className={`d-flex justify-content-center align-items-center icon-48 round-8 ${trendBgColor}`}
              >
                {trend === 'up' && <ArrowUp className={`icon-24 ${trendColor}`} />}
                {trend === 'down' && (
                  <ArrowDown className={`icon-24 ${trendColor}`} />
                )}
                {trend === 'flat' && (
                  <Minus className={`icon-24 ${trendColor}`} />
                )}
              </div>
              <div className="stockRate text-danger">0.01 (0.03%)</div>
            </div>

            <p className="card-content mb-0 text-muted">
              2026/01/01 14:30 更新 | 總量 22,134 張
            </p>
          </div>
        </div>
      </div>

      {/* ===== 手機 Tab ===== */}
      <div className="custom-container mb-4 d-md-none">
        <button
          className="stock-dropdown-btn btn-lg w-100"
          onClick={() => setMobileDropdownOpen((p) => !p)}
        >
          {activeTab}
        </button>

        {mobileDropdownOpen && (
          <ul className="dropdown-menu show w-100 mt-2">
            {tabs.map((tab) => (
              <li key={tab}>
                <button
                  className={`dropdown-item ${
                    activeTab === tab ? 'active' : ''
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setMobileDropdownOpen(false);
                  }}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ===== 桌機 Tab ===== */}
      <div className="custom-container d-none d-md-flex mb-4 border-bottom">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`btn stock-dropdown-btn btn-lg ${
              activeTab === tab ? 'active' : ''
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ===== 內容 ===== */}
      <div className="custom-container mb-5">
        {activeTab === '股價走勢' && (
        <StockPriceTrend stockSelect={stockSelect} />
        )}

        {activeTab === '股利政策' && (
          <DividendPolicy stockId={stockSelect} />
        )}

        {activeTab === '股價 K 線' && (
          <StockKLine stockSelect={stockSelect} stockUrl={stockUrl} />
        )}
      </div>

      {/* ===== Tab 下底線樣式 ===== */}
      <style>{`
        .stock-dropdown-btn.active {
          border-bottom: 3px solid #007bff;
          border-radius: 0;
          color: #007bff;
        }

        .dropdown-item.active {
          font-weight: bold;
          background-color: #e6f0ff;
        }
      `}</style>
    </div>
  );
}
