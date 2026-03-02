import { useEffect, useState } from 'react';
import axios from 'axios';
import TradingChart1 from '../components/Tools/TradingChart1';

export default function StockKLine({ stockSelect, stockUrl }) {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${stockUrl}?id=${stockSelect}&_embed=prices`);

        // json-server 常見格式
        if (Array.isArray(res.data.data) && res.data.data.length > 0) {
          setStockData(res.data.data[0]);
        } else if (res.data?.data?.length > 0) {
          setStockData(res.data.data[0]);
        } else {
          setStockData(null);
        }
      } catch (error) {
        console.error('載入 K 線資料失敗:', error);
        setStockData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [stockSelect, stockUrl]);

  return (
    <div className="mb-80" style={{ height: '600px', display: 'flex', padding: '20px' }}>
      {loading ? (
        <div className="text-muted text-center w-100 d-flex align-items-center justify-content-center">
          載入中…
        </div>
      ) : stockData?.prices?.length > 0 ? (
        <TradingChart1 stockData={stockData} stockSelect={stockSelect} />
      ) : (
        <div className="text-muted text-center w-100 d-flex align-items-center justify-content-center">
          無 K 線資料
        </div>
      )}
    </div>
  );
}
