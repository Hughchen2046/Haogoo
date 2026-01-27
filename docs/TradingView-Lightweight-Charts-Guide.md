# TradingView Lightweight Charts™ 使用指南

> 基於官方文檔：https://tradingview.github.io/lightweight-charts/docs

---

## 目錄

1. [Getting Started (入門)](#1-getting-started-入門)
2. [Series (系列)](#2-series-系列)
3. [Chart Types (圖表類型)](#3-chart-types-圖表類型)
4. [Price Scale (價格軸)](#4-price-scale-價格軸)
5. [Time Scale (時間軸)](#5-time-scale-時間軸)
6. [Panes (面板)](#6-panes-面板)
7. [Time Zones (時區)](#7-time-zones-時區)

---

## 1. Getting Started (入門)

### 1.1 系統需求

- **客戶端專用**：Lightweight Charts 是客戶端函式庫，不適用於 Node.js 等伺服器端環境
- **語言支援**：目標 ES2020 語言規範
- **瀏覽器相容性**：確保瀏覽器支援 ES2020
- **舊版支援**：若需支援舊版本，可使用 Babel 等工具進行轉譯

### 1.2 安裝

```bash
npm install --save lightweight-charts
```

套件包含 TypeScript 宣告檔，可無縫整合到 TypeScript 專案中。

### 1.3 授權與署名

根據 Lightweight Charts™ 授權條款，需在您的網站或應用程式公開頁面上標明：

1. [NOTICE 檔案](https://github.com/tradingview/lightweight-charts/blob/master/NOTICE)中的署名聲明
2. TradingView 官網連結：https://www.tradingview.com

### 1.4 建立圖表

#### 匯入函式庫

```javascript
import { createChart } from 'lightweight-charts';
```

#### 建立圖表實例

```javascript
// 建立第一個圖表
const firstChart = createChart(document.getElementById('firstContainer'));

// 建立第二個圖表
const secondChart = createChart(document.getElementById('secondContainer'));
```

`createChart` 返回 `IChartApi` 物件，用於與圖表互動。

### 1.5 建立系列 (Series)

圖表資料透過「系列」(Series) 顯示。支援的系列類型：

- **Area** (區域圖)
- **Bar** (柱狀圖)
- **Baseline** (基準線圖)
- **Candlestick** (蠟燭圖/K線圖)
- **Histogram** (直方圖)
- **Line** (折線圖)

#### 建立系列範例

```javascript
import { AreaSeries, BarSeries, BaselineSeries, createChart } from 'lightweight-charts';

const chart = createChart(container);

const areaSeries = chart.addSeries(AreaSeries);
const barSeries = chart.addSeries(BarSeries);
const baselineSeries = chart.addSeries(BaselineSeries);
```

**注意**：系列類型一旦建立無法轉換，因為不同類型需要不同的資料和選項格式。

### 1.6 設定與更新資料

#### 設定資料到系列

```javascript
// 設定蠟燭圖資料
candlestickSeries.setData([
  { time: '2021-01-01', open: 100, high: 105, low: 98, close: 102 },
  { time: '2021-01-02', open: 102, high: 108, low: 101, close: 106 },
  // ...
]);
```

#### 更新資料

```javascript
// 新增單筆資料
candlestickSeries.update({
  time: '2021-01-03',
  open: 106,
  high: 110,
  low: 105,
  close: 108,
});
```

---

## 2. Series (系列)

### 2.1 支援的系列類型

#### 2.1.1 Area (區域圖)

用於顯示趨勢和填充區域的圖表。

**資料格式**：

```javascript
{ time: 'YYYY-MM-DD', value: number }
```

#### 2.1.2 Bar (柱狀圖)

顯示開高低收 (OHLC) 資料的垂直柱狀圖。

**資料格式**：

```javascript
{ time: 'YYYY-MM-DD', open: number, high: number, low: number, close: number }
```

#### 2.1.3 Baseline (基準線圖)

以基準線為參考，顯示高於/低於基準的區域。

**資料格式**：

```javascript
{ time: 'YYYY-MM-DD', value: number }
```

#### 2.1.4 Candlestick (蠟燭圖/K線圖)

最常用於股票/加密貨幣的價格走勢圖。

**資料格式**：

```javascript
{ time: 'YYYY-MM-DD', open: number, high: number, low: number, close: number }
```

#### 2.1.5 Histogram (直方圖)

常用於顯示交易量等數據。

**資料格式**：

```javascript
{ time: 'YYYY-MM-DD', value: number, color?: string }
```

#### 2.1.6 Line (折線圖)

簡單的折線圖表。

**資料格式**：

```javascript
{ time: 'YYYY-MM-DD', value: number }
```

### 2.2 自訂系列

透過兩種方式自訂系列選項：

#### 方法 1：建立時指定預設選項

```javascript
const series = chart.addSeries(AreaSeries, {
  topColor: 'red',
  bottomColor: 'green',
});
```

#### 方法 2：使用 `applyOptions` 動態更新

```javascript
candlestickSeries.applyOptions({
  upColor: 'red',
  downColor: 'blue',
});
```

詳細選項請參考 [SeriesStyleOptionsMap API](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/SeriesStyleOptionsMap)。

---

## 3. Chart Types (圖表類型)

Lightweight Charts 提供不同類型的圖表以滿足各種資料視覺化需求：

### 3.1 Standard Time-based Chart (標準時間基礎圖表)

最常見的類型，橫軸顯示時間。

### 3.2 Yield Curve Chart (收益曲線圖)

用於顯示債券收益率等金融數據。

### 3.3 Options Chart (Price-based) (選擇權圖表)

基於價格而非時間的圖表。

### 3.4 Custom Horizontal Scale Chart (自訂橫軸圖表)

可自訂橫軸顯示的值（如價格、其他指標）。

### 選擇正確的圖表類型

根據您的資料特性選擇：

- **時間序列資料** → Standard Time-based Chart
- **價格分佈資料** → Price-based Chart
- **特殊需求** → Custom Horizontal Scale Chart

---

## 4. Price Scale (價格軸)

### 4.1 概述

Price Scale（價格軸）是垂直軸，用於將價格映射到座標，反之亦然。轉換規則取決於：

- 價格軸模式
- 圖表高度
- 資料的可見部分

### 4.2 建立價格軸

```javascript
const priceScale = chart.priceScale();
```

### 4.3 修改價格軸

```javascript
chart.applyOptions({
  priceScale: {
    mode: 0, // 0 = Normal, 1 = Logarithmic, 2 = Percentage, 3 = Index
    invertScale: false, // 反轉價格軸
    alignLabels: true, // 對齊標籤
    borderVisible: true, // 顯示邊框
    scaleMargins: {
      top: 0.1, // 上邊距 (10%)
      bottom: 0.2, // 下邊距 (20%)
    },
  },
});
```

### 4.4 移除價格軸

移除特定系列的價格軸顯示：

```javascript
series.applyOptions({
  priceScaleId: '', // 隱藏價格軸
});
```

---

## 5. Time Scale (時間軸)

### 5.1 概述

Time Scale（時間軸）是水平軸，顯示資料點的時間，位於圖表底部。

**注意**：橫軸也可以代表價格或其他自訂值，詳見 [Chart Types](#3-chart-types-圖表類型)。

### 5.2 時間軸外觀設定

```javascript
chart.applyOptions({
  timeScale: {
    rightOffset: 12, // 右側偏移量
    barSpacing: 3, // 柱狀間距
    fixLeftEdge: false, // 固定左邊緣
    lockVisibleTimeRangeOnResize: true, // 調整大小時鎖定可見範圍
    rightBarStaysOnScroll: true, // 滾動時保持最右側柱狀
    borderVisible: true, // 顯示邊框
    visible: true, // 顯示時間軸
    timeVisible: true, // 顯示時間
    secondsVisible: false, // 顯示秒數
  },
});
```

### 5.3 時間軸 API

#### 取得可見範圍

```javascript
const visibleRange = chart.timeScale().getVisibleRange();
// 返回: { from: timestamp, to: timestamp }
```

#### 設定可見範圍

```javascript
chart.timeScale().setVisibleRange({
  from: '2021-01-01',
  to: '2021-12-31',
});
```

#### 自動縮放至適合內容

```javascript
chart.timeScale().fitContent();
```

### 5.4 Visible Range (可見範圍)

可見範圍是時間軸上當前顯示的資料範圍。

### 5.5 Data Range (資料範圍)

資料範圍是所有系列中資料的完整時間範圍。

### 5.6 Logical Range (邏輯範圍)

邏輯範圍是以索引表示的範圍（第一個資料點為 0）。

### 5.7 Chart Margin (圖表邊距)

```javascript
chart.applyOptions({
  timeScale: {
    rightOffset: 12, // 右側留白 12 個柱狀寬度
  },
});
```

---

## 6. Panes (面板)

### 6.1 概述

Panes（面板）是在單一圖表中視覺化分離不同資料的重要元素。例如：

- **面板 1**：股票價格走勢（K線圖）
- **面板 2**：交易量（直方圖）

預設情況下，Lightweight Charts 有單一面板，但您可以新增更多面板來顯示不同的系列。

### 6.2 建立多面板圖表範例

```javascript
import {
  Chart,
  CandlestickSeries,
  HistogramSeries,
  Pane,
  TimeScale,
} from 'lightweight-charts-react-components';

function MultiPaneChart() {
  return (
    <Chart>
      <TimeScale />

      {/* 面板 1: K線圖 */}
      <Pane stretchFactor={3}>
        <CandlestickSeries data={ohlcData} />
      </Pane>

      {/* 面板 2: 交易量 */}
      <Pane stretchFactor={1}>
        <HistogramSeries data={volumeData} />
      </Pane>
    </Chart>
  );
}
```

### 6.3 自訂選項

#### `stretchFactor` (延展因子)

控制面板的高度比例。數字越大，面板佔用空間越多。

範例：

- `stretchFactor={3}` → 佔 3/4 高度
- `stretchFactor={1}` → 佔 1/4 高度

### 6.4 管理面板

```javascript
chart.applyOptions({
  layout: {
    panes: {
      enableResize: true, // 允許拖曳調整面板高度
      separatorColor: '#E0E0E0', // 面板間分隔線顏色
    },
  },
});
```

詳細範例請參考：[Panes Tutorial](https://tradingview.github.io/lightweight-charts/tutorials/how_to/panes)

---

## 7. Time Zones (時區)

### 7.1 概述

**重要**：Lightweight Charts™ 本身不支援時區。所有日期和時間值都以 **UTC** 處理。

如果需要時區支援，您必須**手動調整每個資料點的時間戳**。

### 7.2 時區轉換原理

假設您有一個資料點：

- **原始 UTC 時間**：`2021-01-01T10:00:00.000Z`
- **目標時區**：`Europe/Moscow` (UTC+03:00)
- **調整後時間**：`2021-01-01T13:00:00.000Z` (加 3 小時)

### 7.3 轉換注意事項

1. **日期變更**：時區偏移可能改變日期，不僅僅是時間
2. **夏令時 (DST)**：偏移量可能因 DST 或區域調整而變化
3. **僅日期資料**：如果資料僅包含營業日而無時間組件，通常不應調整時區

### 7.4 時區轉換方法

#### 方法 1：使用原生 JavaScript

```javascript
function convertToTimezone(utcTimestamp, offsetHours) {
  const date = new Date(utcTimestamp);
  date.setHours(date.getHours() + offsetHours);
  return date.toISOString();
}

// 範例：轉換到 UTC+8 (台北時區)
const taipeiTime = convertToTimezone('2021-01-01T10:00:00.000Z', 8);
// 結果: '2021-01-01T18:00:00.000Z'
```

#### 方法 2：使用 date-fns-tz 函式庫

```bash
npm install date-fns-tz
```

```javascript
import { utcToZonedTime, format } from 'date-fns-tz';

const utcDate = new Date('2021-01-01T10:00:00.000Z');
const timeZone = 'Asia/Taipei';
const zonedDate = utcToZonedTime(utcDate, timeZone);

console.log(format(zonedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone }));
```

#### 方法 3：使用 IANA 時區資料庫

使用 [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)：

```javascript
const date = new Date('2021-01-01T10:00:00.000Z');
const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Taipei',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

console.log(formatter.format(date));
```

### 7.5 為何不原生支援時區？

Lightweight Charts 的設計哲學是保持輕量化和高效能。時區處理會增加複雜性和檔案大小，因此由使用者根據需求自行處理更為靈活。

---

## 8. 實戰範例：完整的股票圖表

```javascript
// TradingChart.jsx
import React, { useMemo } from 'react';
import {
  Chart,
  CandlestickSeries,
  HistogramSeries,
  Pane,
  TimeScale,
  TimeScaleFitContentTrigger,
  WatermarkText,
} from 'lightweight-charts-react-components';

const colors = {
  red: '#ef5350',
  green: '#26a69a',
  gray: '#E0E0E0',
};

export default function TradingChart({ stockData }) {
  const { ohlcData, volumeData } = useMemo(() => {
    // 處理 OHLC 資料
    const ohlc = stockData.prices.map((price) => ({
      time: price.date,
      open: price.open,
      high: price.high,
      low: price.low,
      close: price.close,
    }));

    // 處理成交量資料
    const volume = stockData.prices.map((price) => ({
      time: price.date,
      value: price.volume,
      color: price.close > price.open ? `${colors.red}90` : `${colors.green}90`,
    }));

    return { ohlcData: ohlc, volumeData: volume };
  }, [stockData]);

  return (
    <Chart
      options={{
        layout: {
          panes: {
            enableResize: true,
            separatorColor: colors.gray,
          },
        },
      }}
      containerProps={{ style: { flexGrow: '1' } }}
    >
      <TimeScale>
        <TimeScaleFitContentTrigger deps={[]} />
      </TimeScale>

      {/* 面板 1: K線圖 */}
      <Pane stretchFactor={3}>
        <CandlestickSeries
          data={ohlcData}
          options={{
            upColor: colors.red,
            downColor: colors.green,
            borderUpColor: colors.red,
            borderDownColor: colors.green,
            wickUpColor: colors.red,
            wickDownColor: colors.green,
            priceLineVisible: false,
          }}
        />
      </Pane>

      {/* 面板 2: 成交量 */}
      <Pane stretchFactor={1}>
        <HistogramSeries
          data={volumeData}
          options={{
            priceLineVisible: false,
          }}
        />
        <WatermarkText
          lines={[{ text: 'VOLUME', color: '#2962FF', fontSize: 12 }]}
          horzAlign="right"
          vertAlign="bottom"
        />
      </Pane>
    </Chart>
  );
}
```

---

## 9. 常見問題與最佳實踐

### 9.1 效能優化

1. **使用 `useMemo`**：避免不必要的資料重新計算
2. **批次更新**：使用 `setData` 而非多次 `update`
3. **限制資料點數量**：顯示必要的資料範圍即可

### 9.2 資料格式注意事項

1. **時間格式**：
   - 字串格式：`'YYYY-MM-DD'` 或 `'YYYY-MM-DD HH:mm:ss'`
   - Unix 時間戳（秒）：`1609459200`
2. **資料排序**：資料必須按時間升序排列

3. **避免重複時間**：每個時間點只能有一個資料

### 9.3 響應式設計

```javascript
chart.applyOptions({
  width: container.clientWidth,
  height: 400,
});

// 監聽視窗大小變化
window.addEventListener('resize', () => {
  chart.applyOptions({
    width: container.clientWidth,
  });
});
```

---

## 10. 參考資源

- **官方文檔**：https://tradingview.github.io/lightweight-charts/docs
- **API 參考**：https://tradingview.github.io/lightweight-charts/docs/api
- **GitHub 倉庫**：https://github.com/tradingview/lightweight-charts
- **範例與教學**：https://tradingview.github.io/lightweight-charts/tutorials

---

## 授權資訊

本說明書基於 TradingView Lightweight Charts™ 官方文檔整理。

**Lightweight Charts™ 授權**：Apache License 2.0

**署名要求**：使用此函式庫時，請在您的應用程式中標明 TradingView 作為產品創建者，並提供 https://www.tradingview.com 連結。

---

**文檔版本**：2026-01-27  
**整理者**：基於官方文檔自動生成
