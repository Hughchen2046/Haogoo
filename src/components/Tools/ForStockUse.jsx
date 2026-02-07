import { useState, useEffect } from 'react';
import axios from 'axios';

const stocklist = [
  '0056',
  '0050',
  '0053',
  '006208',
  '0052',
  '0055',
  '0051',
  '00739',
  '00752',
  '00878',
  '006204',
  '1103',
  '1104',
  '1101',
  '1101B',
  '1102',
  '1110',
  '1108',
  '1109',
  '1213',
  '1201',
  '1219',
  '1203',
  '1210',
  '1217',
  '1215',
  '1227',
  '1216',
  '1225',
  '1218',
  '1220',
  '1707',
  '1720',
  '1752',
  '1733',
  '1731',
  '1734',
  '1760',
  '1762',
  '1789',
  '2303',
  '2302',
  '2344',
  '2337',
  '2330',
  '2329',
  '2342',
  '2340',
  '2338',
  '2351',
  '2363',
  '2369',
  '2408',
  '2454',
  '2801',
  '2812',
  '2884',
  '2881',
  '2885',
  '2882',
  '2891',
  '3711',
  '4119',
];
//臺灣證券交易所 OpenAPI https://openapi.twse.com.tw/
// FinMind API https://finmind.github.io/
// 透過本地後端代理避免 CORS 問題
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const StockUse = () => {
  const [benifitData, setBenifitData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  console.log('股票清單:', stocklist);

  // 批次讀取所有股票的股利資料
  const fetchAllStockDividends = async () => {
    try {
      setLoading(true);
      setIsProcessing(true);
      setError(null);
      setProgress({ current: 0, total: stocklist.length });

      const allData = [];

      // 逐一讀取每支股票的資料
      for (let i = 0; i < stocklist.length; i++) {
        const stockId = stocklist[i];

        try {
          console.log(`📡 正在讀取 ${stockId} 的股利資料... (${i + 1}/${stocklist.length})`);

          const res = await axios.get(`${API_BASE}/api/finmind/TaiwanStockDividend`, {
            params: {
              data_id: stockId,
              start_date: '2015-01-01',
            },
          });

          // 將資料加入陣列
          allData.push({
            id: stockId,
            data: res.data.data || [],
          });

          setProgress({ current: i + 1, total: stocklist.length });

          // 避免請求過快，每次請求間隔 500ms
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (err) {
          console.error(`❌ 讀取 ${stockId} 失敗:`, err.message);
          // 即使失敗也繼續下一個
          allData.push({
            id: stockId,
            data: [],
            error: err.message,
          });
        }
      }

      console.log('✅ 所有資料讀取完成！');

      // 建立最終的 JSON 格式
      const finalData = {
        stockbenifit: allData,
      };

      setBenifitData(finalData);
      setError(null);

      // 自動下載 JSON 檔案
      downloadJSON(finalData, 'stockbenifit.json');
    } catch (error) {
      console.error('批次讀取錯誤:', error);
      setError('批次讀取失敗');
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  // 下載 JSON 檔案
  const downloadJSON = (data, filename) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log(`📥 已下載: ${filename}`);
  };

  useEffect(() => {
    // 在組件載入時自動開始批次讀取
    fetchAllStockDividends();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>FinMind API 測試 - 批次股利資料下載</h1>

      {isProcessing && (
        <div>
          <p>
            載入中... ({progress.current}/{progress.total})
          </p>
          <progress value={progress.current} max={progress.total} style={{ width: '100%' }} />
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && benifitData.stockbenifit && benifitData.stockbenifit.length > 0 && (
        <div>
          <p style={{ color: 'green', fontWeight: 'bold' }}>
            ✅ 成功載入 {benifitData.stockbenifit.length} 支股票的股利資料
          </p>

          <button
            onClick={() => downloadJSON(benifitData, 'stockbenifit.json')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0d6efd',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            📥 重新下載 JSON 檔案
          </button>

          <details style={{ marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', marginTop: '10px' }}>
              查看資料摘要（點擊展開）
            </summary>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '10px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>股票代碼</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>資料筆數</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>狀態</th>
                </tr>
              </thead>
              <tbody>
                {benifitData.stockbenifit.map((stock, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stock.id}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      {stock.data.length}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {stock.error ? (
                        <span style={{ color: 'red' }}>❌ {stock.error}</span>
                      ) : (
                        <span style={{ color: 'green' }}>✅ 成功</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>

          <details style={{ marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer' }}>查看完整 JSON（點擊展開）</summary>
            <pre
              style={{
                background: '#f5f5f5',
                padding: '10px',
                borderRadius: '5px',
                overflow: 'auto',
                maxHeight: '400px',
              }}
            >
              {JSON.stringify(benifitData, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default StockUse;
