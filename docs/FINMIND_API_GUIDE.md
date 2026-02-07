# FinMind API 使用說明

## 📡 API 代理設定

已在 `server.cjs` 中設定 FinMind API 代理路由，避免 CORS 問題。

### 路由格式

```
GET /api/finmind/:dataset
```

### 支援的查詢參數

- `data_id` 或 `stock_id`: 股票代碼（例如 2330）
- `start_date`: 開始日期（格式：YYYY-MM-DD）
- `end_date`: 結束日期（格式：YYYY-MM-DD）
- `token`: FinMind API Token（可選，用於提升請求限制）

---

## 🎯 常用 Dataset

### 1. 股利政策表 (TaiwanStockDividend)

**資料區間**: 2005-05-01 ~ now

**範例**：

```javascript
const res = await axios.get(`${API_BASE}/api/finmind/TaiwanStockDividend`, {
  params: {
    data_id: '2330', // 台積電
    start_date: '2020-01-01',
  },
});
```

**回應格式**：

```json
{
  "success": true,
  "code": 200,
  "message": "成功",
  "data": [
    {
      "StockID": "2330",
      "AnnouncementDate": "2023-03-14",
      "CashEarningsDistribution": 2.75,
      "CashExDividendTradingDate": "2023-06-15",
      "StockEarningsDistribution": 0,
      ...
    }
  ]
}
```

---

### 2. 綜合損益表 (TaiwanStockFinancialStatements)

**資料區間**: 1990-03-01 ~ now

**範例**：

```javascript
const res = await axios.get(`${API_BASE}/api/finmind/TaiwanStockFinancialStatements`, {
  params: {
    data_id: '2330',
    start_date: '2023-01-01',
  },
});
```

---

### 3. 資產負債表 (TaiwanStockBalanceSheet)

**資料區間**: 1990-03-01 ~ now

**範例**：

```javascript
const res = await axios.get(`${API_BASE}/api/finmind/TaiwanStockBalanceSheet`, {
  params: {
    data_id: '2330',
    start_date: '2023-01-01',
  },
});
```

---

### 4. 現金流量表 (TaiwanStockCashFlowsStatement)

**資料區間**: 2008-06-01 ~ now

**範例**：

```javascript
const res = await axios.get(`${API_BASE}/api/finmind/TaiwanStockCashFlowsStatement`, {
  params: {
    data_id: '2330',
    start_date: '2023-01-01',
  },
});
```

---

### 5. 月營收表 (TaiwanStockMonthRevenue)

**資料區間**: 1999-01-01 ~ now

**範例**：

```javascript
const res = await axios.get(`${API_BASE}/api/finmind/TaiwanStockMonthRevenue`, {
  params: {
    data_id: '2330',
    start_date: '2024-01-01',
  },
});
```

---

### 6. 除權除息結果表 (TaiwanStockDividendResult)

**資料區間**: 2005-05-01 ~ now

**範例**：

```javascript
const res = await axios.get(`${API_BASE}/api/finmind/TaiwanStockDividendResult`, {
  params: {
    data_id: '2330',
    start_date: '2020-01-01',
  },
});
```

---

## 🔑 使用 API Token（可選）

如果你有 FinMind API Token，可以提升請求限制：

```javascript
const res = await axios.get(`${API_BASE}/api/finmind/TaiwanStockDividend`, {
  params: {
    data_id: '2330',
    start_date: '2020-01-01',
    token: 'your_finmind_api_token', // 加入 token
  },
});
```

**取得 Token**：

1. 前往 https://finmindtrade.com/
2. 註冊並登入
3. 在個人設定中取得 API Token

---

## 📦 完整範例

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

function StockDividendExample() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_BASE}/api/finmind/TaiwanStockDividend`, {
          params: {
            data_id: '2330',
            start_date: '2020-01-01',
          },
        });

        console.log('股利資料:', res.data);
        setData(res.data.data || []);
        setError(null);
      } catch (error) {
        console.error('API 錯誤:', error);
        setError('無法載入資料');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>載入中...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>台積電股利資料</h1>
      <p>共 {data.length} 筆資料</p>
      {/* 渲染你的資料 */}
    </div>
  );
}
```

---

## 🌐 部署注意事項

### 本地開發

```javascript
const API_BASE = 'http://localhost:3000';
```

### 部署到 GitHub Pages

1. 將後端部署到 Zeabur 或其他服務
2. 設定環境變數 `VITE_API_BASE` 指向後端 URL
3. 例如：`VITE_API_BASE=https://your-backend.zeabur.app`

---

## 📚 參考資源

- [FinMind 官方文檔](https://finmind.github.io/)
- [FinMind API 網站](https://finmindtrade.com/analysis/#/data/api)
- [基本面資料說明](https://finmind.github.io/tutor/TaiwanMarket/Fundamental/)
