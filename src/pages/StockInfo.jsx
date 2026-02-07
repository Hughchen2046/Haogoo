import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronRight } from 'lucide-react';

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

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        setLoading(true);
        const res = await axios.get(`${stockUrl}?id=${stockSelect}&_embed=prices`);
        console.log('股票資料:', res.data[0]);

        if (Array.isArray(res.data) && res.data.length > 0) {
          const data = res.data[0];
          


          

          // 取最後兩筆價格
          const latest = data.prices?.[data.prices.length - 1] || {};
          const prev = data.prices?.[data.prices.length - 2] || latest;

          const latestPrice = Number(latest.close ?? 0);
          const prevPrice = Number(prev.close ?? latestPrice);
          const change = latestPrice - prevPrice;
          const changePercent = prevPrice ? (change / prevPrice) * 100 : 0;

          setStockData({
            ...data,
            latestPrice,
            change,
            changePercent,
            latestTime: latest.date || '',
            totalVolume: latest.volume ?? 0,
          });
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

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: '#666' }}>
        載入中…
      </div>
    );
  }

  if (!stockData) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: '#666' }}>
        無股票資料
      </div>
    );
  }

  return (
    <div className="stock-info-page pt-5">
      {/* 麵包屑 */}
      <div className="custom-container mt-5 text-muted mb-3 d-flex align-items-center gap-1 px-3">
        <span>首頁</span>
        <ChevronRight size={16} />
        <span>{stockSelect} {stockData.name}</span>
      </div>

      {/* 股票資訊卡 */}
<div className="custom-container mb-4">
  <div
    className="card rounded-4 shadow-sm"
    style={{
      backgroundColor: '#fff',
      border: 'none',
      padding: '2rem 2.5rem', // 內縮
    }}
  >
    {/* 上方：股票名稱 + 代號 */}
    <div className="d-flex align-items-baseline gap-2 mb-3">
      <div className="fs-5 fw-bold">{stockData.name}</div>
      <div className="text-muted">{stockData.id}</div>
    </div>

    {/* 中間：股價 + 漲跌 */}
    <div className="d-flex align-items-center gap-3 mb-3">
      <div className="fs-2 fw-bold">{stockData.latestPrice.toFixed(2)}</div>

      <div className="d-flex align-items-center gap-2">
        {/* 箭頭小框 */}
        <div
          className="d-flex justify-content-center align-items-center rounded"
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: stockData.change >= 0 ? '#ffe8e8' : '#e8f0ff',
            color: stockData.change >= 0 ? '#ff4d4f' : '#2962FF',
            fontSize: '0.9rem',
            fontWeight: 'bold',
          }}
        >
          {stockData.change >= 0 ? '↑' : '↓'}
        </div>

        
        <span
          style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: stockData.change >= 0 ? '#ff4d4f' : '#2962FF',
          }}
        >
          {(stockData.change ?? 0).toFixed(2)} ({(stockData.changePercent ?? 0).toFixed(2)}%)
        </span>
      </div>
    </div>

    {/* 下方：更新時間與總量 */}
    <div className="text-muted" style={{ fontSize: '0.85rem' }}>
      {stockData.latestTime} 更新 | 總量：{(stockData.totalVolume ?? 0).toLocaleString()} 張
    </div>
  </div>
</div>


      {/* Tab 手機版 */}
      <div className="custom-container mb-4 d-md-none" style={{ position: 'relative' }}>
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
                  className={`dropdown-item ${activeTab === tab ? 'active' : ''}`}
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

      {/* Tab 桌機版 */}
      <div className="custom-container d-none d-md-flex mb-4 border-bottom">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`btn stock-dropdown-btn btn-lg ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 內容 */}
      <div className="custom-container mb-5">
        {activeTab === '股價走勢' && stockData?.prices?.length > 0 && (
          <StockPriceTrend
            key={stockSelect + '-line'}
            stockData={stockData}
          />
        )}

        {activeTab === '股利政策' && stockData && (
          <DividendPolicy />
        )}

        {activeTab === '股價 K 線' && stockData?.prices?.length > 0 && (
          <StockKLine
            key={stockSelect + '-kline'}
            stockSelect={stockSelect}
            stockUrl={stockUrl}
          />
        )}
      </div>

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
