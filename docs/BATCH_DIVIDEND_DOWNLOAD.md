# 批次股利資料下載功能說明

## 📋 功能概述

此功能會批次讀取 `stocklist` 中所有股票（共 68 支）的歷年股利資料，並自動下載為 JSON 檔案。

## 🎯 資料來源

- **API**: FinMind TaiwanStockDividend
- **資料區間**: 2015-01-01 至今
- **股票清單**: 包含 ETF 和個股共 68 支

## 📦 輸出格式

### JSON 結構

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
          "StockEarningsDistribution": 0,
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

### 資料欄位說明（FinMind 原始欄位）

- `StockID`: 股票代碼
- `AnnouncementDate`: 公告日期
- `CashEarningsDistribution`: 現金股利
- `CashExDividendTradingDate`: 除息交易日
- `StockEarningsDistribution`: 股票股利
- 其他欄位請參考 [FinMind 文檔](https://finmind.github.io/tutor/TaiwanMarket/Fundamental/#taiwanstockdividend)

## 🚀 使用方式

### 1. 自動執行

前往 `http://localhost:5173/#/test`，頁面載入時會自動開始批次讀取。

### 2. 進度顯示

- 即時顯示讀取進度：`(當前數量/總數量)`
- 進度條視覺化顯示

### 3. 自動下載

所有資料讀取完成後，會自動下載 `stockbenifit.json` 檔案到瀏覽器的下載資料夾。

### 4. 手動重新下載

點擊「📥 重新下載 JSON 檔案」按鈕可再次下載。

## 📊 資料摘要表

展開「查看資料摘要」可看到：

- 每支股票的代碼
- 該股票的股利資料筆數
- 讀取狀態（成功/失敗）

## ⚙️ 技術細節

### 請求間隔

每次 API 請求間隔 **500ms**，避免請求過快被限制。

### 錯誤處理

- 單一股票讀取失敗不會中斷整個流程
- 失敗的股票會標記 `error` 欄位
- 繼續讀取下一支股票

### 預估時間

- 68 支股票 × 500ms = 約 34 秒
- 實際時間會因網路速度而異

## 📝 範例程式碼

### 讀取下載的 JSON 檔案

```javascript
// 在其他組件中使用
import stockBenifitData from './stockbenifit.json';

// 取得特定股票的股利資料
const stock0056 = stockBenifitData.stockbenifit.find((s) => s.id === '0056');
console.log('0056 股利資料:', stock0056.data);

// 計算平均現金股利
const avgCashDividend =
  stock0056.data.reduce((sum, item) => sum + (item.CashEarningsDistribution || 0), 0) /
  stock0056.data.length;
```

### 過濾特定年份

```javascript
const year2023Data = stock0056.data.filter((item) => item.AnnouncementDate.startsWith('2023'));
```

## 🔧 自訂設定

### 修改股票清單

編輯 `forStockUse.jsx` 中的 `stocklist` 陣列：

```javascript
const stocklist = [
  '0056',
  '0050',
  // 加入或移除股票代碼
];
```

### 修改起始日期

修改 `start_date` 參數：

```javascript
params: {
  data_id: stockId,
  start_date: '2020-01-01',  // 改成你要的日期
}
```

### 修改檔案名稱

修改 `downloadJSON` 呼叫：

```javascript
downloadJSON(finalData, 'my_custom_name.json');
```

## ⚠️ 注意事項

1. **API 限制**: FinMind 免費版有請求限制，大量請求可能需要 API Token
2. **瀏覽器下載**: 檔案會下載到瀏覽器預設的下載資料夾
3. **資料更新**: 每次執行都會重新從 API 取得最新資料
4. **網路需求**: 需要穩定的網路連線，整個流程約需 30-40 秒

## 🎨 UI 功能

- ✅ 即時進度顯示
- ✅ 進度條視覺化
- ✅ 資料摘要表格
- ✅ 完整 JSON 預覽
- ✅ 一鍵重新下載
- ✅ 錯誤狀態標示

## 📚 相關文件

- [FinMind API 使用說明](./FINMIND_API_GUIDE.md)
- [FinMind 官方文檔](https://finmind.github.io/)
