# 股利資料 Server 使用說明 (Port 3001)

## 📋 概述

第二個 Server (Port 3001) 專門用於提供股利資料 API，使用 `stockbenifit.json` 作為資料庫。

## 🚀 啟動方式

```bash
npm run server
```

**Console 輸出**：

```
Server running on port 3000
權限：Admin > VIP > Member > Guest

🚀 Stock Dividend Server running on port 3001
   使用資料庫: stockbenifit.json
   測試路由: http://localhost:3001/api/test
   股利資料: http://localhost:3001/stockbenifit
   查詢單支股票: http://localhost:3001/stockbenifit?id=0056
```

---

## 📦 資料結構

`stockbenifit.json` 格式：

```json
{
  "stockbenifit": [
    {
      "id": "0056",
      "data": [
        {
          "StockID": "0056",
          "AnnouncementDate": "2023-03-14",
          "CashEarningsDistribution": 2.75,
          "CashExDividendTradingDate": "2023-06-15",
          ...
        }
      ]
    },
    {
      "id": "0050",
      "data": [...]
    }
  ]
}
```

---

## 🎯 API 使用方式

### 1. 測試路由

```javascript
axios.get('http://localhost:3001/api/test');
```

**回應**：

```json
{
  "success": true,
  "code": 200,
  "message": "這是第二個 Server (Port 3001) - 股利資料專用",
  "data": {
    "server": "Stock Dividend Server",
    "port": 3001,
    "database": "stockbenifit.json",
    "totalStocks": 68
  }
}
```

---

### 2. 取得所有股票的股利資料

```javascript
axios.get('http://localhost:3001/stockbenifit');
```

**回應**：

```json
{
  "success": true,
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": "0056",
      "data": [...]
    },
    {
      "id": "0050",
      "data": [...]
    }
  ]
}
```

---

### 3. 查詢單支股票（使用 id 過濾）

```javascript
axios.get('http://localhost:3001/stockbenifit?id=0056');
```

**回應**：

```json
{
  "success": true,
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": "0056",
      "data": [
        {
          "StockID": "0056",
          "AnnouncementDate": "2023-03-14",
          "CashEarningsDistribution": 2.75,
          ...
        }
      ]
    }
  ]
}
```

---

### 4. 使用 JSON Server 的進階查詢

#### 分頁

```javascript
// 取得第 1 頁，每頁 10 筆
axios.get('http://localhost:3001/stockbenifit?_page=1&_limit=10');
```

#### 排序

```javascript
// 依 id 排序
axios.get('http://localhost:3001/stockbenifit?_sort=id&_order=asc');
```

#### 搜尋

```javascript
// 搜尋 id 包含 "005" 的股票
axios.get('http://localhost:3001/stockbenifit?id_like=005');
```

#### 範圍查詢

```javascript
// 查詢多支股票
axios.get('http://localhost:3001/stockbenifit?id=0056&id=0050');
```

---

## 💡 前端使用範例

### React 組件範例

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

function DividendData() {
  const [dividendData, setDividendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3001/stockbenifit?id=0056');

        // 取得 0056 的股利資料
        const stock0056 = res.data.data[0];
        setDividendData(stock0056.data);
      } catch (error) {
        console.error('讀取失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>載入中...</p>;

  return (
    <div>
      <h1>0056 股利資料</h1>
      <table>
        <thead>
          <tr>
            <th>公告日期</th>
            <th>現金股利</th>
            <th>除息日</th>
          </tr>
        </thead>
        <tbody>
          {dividendData.map((item, index) => (
            <tr key={index}>
              <td>{item.AnnouncementDate}</td>
              <td>{item.CashEarningsDistribution}</td>
              <td>{item.CashExDividendTradingDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

### 計算平均股利

```javascript
const calculateAvgDividend = async (stockId) => {
  const res = await axios.get(`http://localhost:3001/stockbenifit?id=${stockId}`);
  const stockData = res.data.data[0];

  if (!stockData || !stockData.data.length) return 0;

  const total = stockData.data.reduce((sum, item) => sum + (item.CashEarningsDistribution || 0), 0);

  return total / stockData.data.length;
};

// 使用
const avg = await calculateAvgDividend('0056');
console.log('0056 平均現金股利:', avg);
```

---

### 取得最新一筆股利

```javascript
const getLatestDividend = async (stockId) => {
  const res = await axios.get(`http://localhost:3001/stockbenifit?id=${stockId}`);
  const stockData = res.data.data[0];

  if (!stockData || !stockData.data.length) return null;

  // 依公告日期排序，取最新的
  const sorted = stockData.data.sort(
    (a, b) => new Date(b.AnnouncementDate) - new Date(a.AnnouncementDate)
  );

  return sorted[0];
};

// 使用
const latest = await getLatestDividend('0056');
console.log('最新股利:', latest);
```

---

## 🔧 自訂查詢路由

可以在 `server.cjs` 的 Server 2 區塊中新增自訂路由：

```javascript
// 範例：取得特定股票的股利資料（更簡潔的 API）
app1.get('/api/dividend/:stockId', (req, res) => {
  const { stockId } = req.params;
  const stock = app1.db.get('stockbenifit').find({ id: stockId }).value();

  if (stock) {
    res.json({
      success: true,
      code: 200,
      message: '成功',
      data: stock.data,
    });
  } else {
    res.status(404).json({
      success: false,
      code: 404,
      message: '找不到該股票',
      data: null,
    });
  }
});
```

**使用**：

```javascript
axios.get('http://localhost:3001/api/dividend/0056');
// 直接回傳股利陣列，不需要再從 data[0].data 取值
```

---

## 📊 資料更新

### 方式 1：重新執行批次下載

1. 前往 `http://localhost:5173/#/test`
2. 載入 `ForStockUse` 組件
3. 自動下載新的 `stockbenifit.json`
4. 重啟 server：`npm run server`

### 方式 2：手動編輯

直接編輯 `stockbenifit.json` 檔案，server 會自動重新載入（需要重啟）。

---

## ⚠️ 注意事項

1. **只讀模式**: 建議將此 server 設為只讀，避免意外修改股利資料
2. **資料同步**: 如果重新下載 `stockbenifit.json`，需要重啟 server
3. **效能**: 68 支股票的資料量不大，查詢速度很快
4. **CORS**: 已設定允許跨域請求

---

## 🎨 使用場景

- ✅ 股利資料查詢和分析
- ✅ 計算殖利率
- ✅ 股利成長率分析
- ✅ 歷史股利趨勢圖表
- ✅ 股利日曆功能
- ✅ 高股息股票篩選

---

## 📚 相關文件

- [批次股利資料下載說明](./BATCH_DIVIDEND_DOWNLOAD.md)
- [FinMind API 使用說明](./FINMIND_API_GUIDE.md)
- [JSON Server 官方文檔](https://github.com/typicode/json-server)
