import { useState, useEffect } from 'react';
import axios from 'axios';

//臺灣證券交易所 OpenAPI https://openapi.twse.com.tw/
// FinMind API https://finmind.github.io/
// 透過本地後端代理避免 CORS 問題
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const StockUse = () => {
  const [benifitData, setBenifitData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [stocklist, setStocklist] = useState([
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
  ]);

  useEffect(() => {
    const getSymbols = async () => {
      try {
        const res = await axios.get(`${API_BASE}/symbols?_embed=prices`);
        const filterData = res.data.data
          .filter((item) => item.prices.length >= 2)
          .map((item) => item.id);
        console.log(filterData);
        setStocklist(filterData);
      } catch (error) {
        console.error('獲取股票清單失敗:', error);
      }
    };
    getSymbols();
  }, []);

  console.log('股票清單:', stocklist);

  // 批次讀取所有股票的產業鏈資料
  const fetchAllStockIndustryChain = async () => {
    try {
      setLoading(true);
      setIsProcessing(true);
      setError(null);
      setProgress({ current: 0, total: stocklist.length });

      const allData = [];

      for (let i = 0; i < stocklist.length; i++) {
        const stockId = stocklist[i];

        try {
          console.log(`📡 正在讀取 ${stockId} 的產業鏈資料... (${i + 1}/${stocklist.length})`);

          const res = await axios.get(`${API_BASE}/api/finmind/TaiwanStockIndustryChain`, {
            params: {
              data_id: stockId,
              start_date: '2015-01-01',
            },
          });

          allData.push({
            id: stockId,
            data: res.data.data || [],
          });

          setProgress({ current: i + 1, total: stocklist.length });
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (err) {
          console.error(`❌ 讀取 ${stockId} 失敗:`, err.message);
          allData.push({
            id: stockId,
            data: [],
            error: err.message,
          });
        }
      }

      console.log('✅ 所有產業鏈資料讀取完成!');

      const finalData = {
        stockIndustryChain: allData,
      };

      setBenifitData(finalData);
      setError(null);
      downloadJSON(finalData, 'stockbenifit.json');
    } catch (error) {
      console.error('批次讀取錯誤:', error);
      setError('批次讀取失敗');
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  // 批次讀取所有股票的月營收資料
  const fetchAllStockMonthRevenue = async () => {
    try {
      setLoading(true);
      setIsProcessing(true);
      setError(null);
      setProgress({ current: 0, total: stocklist.length });

      const allData = [];

      for (let i = 0; i < stocklist.length; i++) {
        const stockId = stocklist[i];

        try {
          console.log(`📡 正在讀取 ${stockId} 的月營收資料... (${i + 1}/${stocklist.length})`);

          const res = await axios.get(`${API_BASE}/api/finmind/TaiwanStockMonthRevenue`, {
            params: {
              data_id: stockId,
              start_date: '2021-01-31',
            },
          });

          allData.push({
            id: stockId,
            data: res.data.data || [],
          });

          setProgress({ current: i + 1, total: stocklist.length });
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (err) {
          console.error(`❌ 讀取 ${stockId} 失敗:`, err.message);
          allData.push({
            id: stockId,
            data: [],
            error: err.message,
          });
        }
      }

      console.log('✅ 所有月營收資料讀取完成!');

      const finalData = {
        monthRevenue: allData,
      };

      setBenifitData(finalData);
      setError(null);
      downloadJSON(finalData, 'TaiwanStockMonthRevenue.json');
    } catch (error) {
      console.error('批次讀取錯誤:', error);
      setError('批次讀取失敗');
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  // 儲存 JSON 檔案到後端
  const downloadJSON = async (data, filename) => {
    try {
      console.log(`📤 正在儲存檔案到後端: ${filename}`);

      const response = await axios.post(`${API_BASE}/api/save-json`, {
        filename,
        data,
      });

      if (response.data.success) {
        console.log(`✅ ${response.data.message}`);
        alert(`✅ 檔案已成功儲存到專案根目錄: ${filename}`);
      } else {
        console.error('❌ 儲存失敗:', response.data.message);
        alert(`❌ 儲存失敗: ${response.data.message}`);
      }
    } catch (error) {
      console.error('❌ 儲存檔案錯誤:', error);
      alert(`❌ 儲存檔案錯誤: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>FinMind API 測試 - 批次資料下載</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={fetchAllStockIndustryChain}
          disabled={isProcessing}
          style={{
            padding: '10px 20px',
            backgroundColor: isProcessing ? '#6c757d' : '#198754',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            marginRight: '10px',
          }}
        >
          📊 下載產業鏈資料 (stockbenifit.json)
        </button>

        <button
          onClick={fetchAllStockMonthRevenue}
          disabled={isProcessing}
          style={{
            padding: '10px 20px',
            backgroundColor: isProcessing ? '#6c757d' : '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          💰 下載月營收資料 (TaiwanStockMonthRevenue.json)
        </button>
      </div>

      {isProcessing && (
        <div>
          <p>
            載入中... ({progress.current}/{progress.total})
          </p>
          <progress value={progress.current} max={progress.total} style={{ width: '100%' }} />
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading &&
        !error &&
        benifitData.stockIndustryChain &&
        benifitData.stockIndustryChain.length > 0 && (
          <div>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              ✅ 成功載入 {benifitData.stockIndustryChain.length} 支股票的產業鏈資料
            </p>

            <button
              onClick={() => downloadJSON(benifitData, 'stockbenifit.json')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#198754',
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
                  {benifitData.stockIndustryChain.map((stock, index) => (
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
          </div>
        )}

      {!loading && !error && benifitData.monthRevenue && benifitData.monthRevenue.length > 0 && (
        <div>
          <p style={{ color: 'green', fontWeight: 'bold' }}>
            ✅ 成功載入 {benifitData.monthRevenue.length} 支股票的月營收資料
          </p>

          <button
            onClick={() => downloadJSON(benifitData, 'TaiwanStockMonthRevenue.json')}
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
                {benifitData.monthRevenue.map((stock, index) => (
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
        </div>
      )}
    </div>
  );
};

export default StockUse;
