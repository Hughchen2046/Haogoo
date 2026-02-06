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

  // ===== 取得股票資料 =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${stockUrl}?id=${stockSelect}&_embed=prices`);

        if (res.data?.data?.length > 0) {
          setStockData(res.data.data[0]);
        } else if (Array.isArray(res.data) && res.data.length > 0) {
          setStockData(res.data[0]);
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

  return (
    <div className="stock-info-page pt-5">
      {/* 麵包屑 */}
      <div className="custom-container mt-5 text-muted mb-3 d-flex align-items-center gap-1 ps-0">
        <span>首頁</span>
        <ChevronRight size={16} />
        <span>{stockSelect} 元大高股息</span>
      </div>

      {/* Tab 手機版 */}
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
            key={stockSelect + '-line'} // 強制 Chart 重建
            stockData={stockData}
          />
        )}

        {activeTab === '股利政策' && stockData && (
          <DividendPolicy stockId={stockSelect} />
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
