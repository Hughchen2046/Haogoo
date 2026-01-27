// TradingChart1.jsx
import React, { useMemo } from 'react';
import dayjs from 'dayjs';

/**
 * lightweight-charts-react-components 元件說明：
 *
 * 1. Chart - 主圖表容器
 *    - Props: options (圖表配置), containerProps (容器樣式)
 *    - Children: TimeScale, Pane (可多個), Series
 *
 * 2. Pane - 圖表面板/窗格（用於分隔不同指標）
 *    - Props: stretchFactor (面板高度比例，數字越大佔比越高)
 *    - Children: CandlestickSeries, LineSeries, HistogramSeries, WatermarkText
 *
 * 3. CandlestickSeries - K線/蠟燭圖系列
 *    - Props: data (OHLC資料陣列), options (樣式配置)
 *    - Data格式: [{ time: 'YYYY-MM-DD', open, high, low, close }]
 *    - Children: 無
 *
 * 4. LineSeries - 折線圖系列
 *    - Props: data (線圖資料陣列), options (樣式配置)
 *    - Data格式: [{ time: 'YYYY-MM-DD', value }]
 *    - Children: PriceLine (可多個，用於標示水平線)
 *
 * 5. HistogramSeries - 柱狀圖系列（常用於成交量）
 *    - Props: data (柱狀圖資料陣列), options (樣式配置)
 *    - Data格式: [{ time: 'YYYY-MM-DD', value, color? }]
 *    - Children: 無
 *
 * 6. PriceLine - 價格水平線（用於標示關鍵價位）
 *    - Props: price (價格值), options (線條樣式)
 *    - 必須放在 LineSeries 內
 *    - Children: 無
 *
 * 7. TimeScale - 時間軸控制器
 *    - Props: 無
 *    - Children: TimeScaleFitContentTrigger
 *
 * 8. TimeScaleFitContentTrigger - 自動調整時間軸
 *    - Props: deps (依賴陣列，類似 useEffect)
 *    - Children: 無
 *
 * 9. WatermarkText - 浮水印文字
 *    - Props: lines (文字配置陣列), horzAlign, vertAlign
 *    - Children: 無
 */
import {
  CandlestickSeries,
  Chart,
  HistogramSeries,
  LineSeries,
  PriceLine,
  TimeScale,
  TimeScaleFitContentTrigger,
  Pane,
  WatermarkText,
} from 'lightweight-charts-react-components';

// ---- Colors ----
const colors = {
  blue: '#2962FF',
  blue100: '#82B1FF',
  green: '#26a69a',
  red: '#ef5350',
  orange100: '#FFB74D',
  violet: '#9C27B0',
  gray100: '#E0E0E0',
};

// ---- Helper functions ----
// 創建指定長度的空陣列
const createStubArray = (length) => Array.from({ length });

/**
 * 生成折線圖資料
 * @param {number} length - 資料點數量
 * @param {Object} options - 選項
 * @param {string} options.lastItemTime - 最後一個時間點（可選）
 * @returns {Array} 格式: [{ time: 'YYYY-MM-DD', value: number }]
 */
const generateLineData = (length, { lastItemTime } = {}) => {
  // 計算開始日期（從今天往前推 length 天）
  const start = lastItemTime
    ? dayjs(lastItemTime).subtract(length, 'day')
    : dayjs().subtract(length, 'day');
  let lastValue = Math.floor(Math.random() * 100);

  return createStubArray(length).map((_, i) => {
    // 每天隨機變化 -10 到 +10
    const change = Math.floor(Math.random() * 21) - 10;
    lastValue = Math.max(0, lastValue + change); // 確保不為負數

    return {
      time: start.add(i, 'day').format('YYYY-MM-DD'),
      value: lastValue,
    };
  });
};

/**
 * 生成 OHLC (開高低收) 蠟燭圖資料
 * @param {number} length - 資料點數量
 * @returns {Array} 格式: [{ time, open, high, low, close }]
 */
const generateOHLCData = (length) => {
  const start = dayjs().subtract(length, 'day');
  let previousClose = Math.max(1, Math.random() * 100);

  return createStubArray(length).map((_, i) => {
    // 開盤價 = 前一天的收盤價
    const open = previousClose;
    // 最高價 = 開盤價 + 隨機值
    const high = open + Math.random() * 10;
    // 最低價 = 開盤價 - 隨機值
    let low = open - Math.random() * 10;

    low = Math.max(0, low); // 確保不為負數

    // 確保 high >= low（最小間距 0.01）
    const minimalDistance = 0.01;
    const adjustedHigh = Math.max(high, low + minimalDistance);

    // 收盤價在最高和最低之間隨機
    const close = low + Math.random() * (adjustedHigh - low);

    previousClose = close; // 儲存為下一根K線的開盤價

    return {
      time: start.add(i, 'day').format('YYYY-MM-DD'),
      open,
      high: adjustedHigh,
      low,
      close,
    };
  });
};

/**
 * 生成柱狀圖資料（常用於成交量）
 * @param {number} length - 資料點數量
 * @param {Object} options - 選項
 * @param {string} options.upColor - 上漲顏色
 * @param {string} options.downColor - 下跌顏色
 * @returns {Array} 格式: [{ time, value, color }]
 */
const generateHistogramData = (length, { upColor, downColor } = {}) => {
  const lineData = generateLineData(length);

  return lineData.map((data, i) => {
    const isFirst = i === 0;
    // 判斷是否比前一天下跌
    const valueDecreased = !isFirst && data.value < lineData[i - 1].value;

    return {
      time: data.time,
      value: data.value,
      color: valueDecreased ? downColor : upColor, // 下跌用 downColor，上漲用 upColor
    };
  });
};

// ---- Watermark ----
function Watermark({ text }) {
  return (
    <WatermarkText
      lines={[
        {
          text,
          color: `${colors.blue}90`,
          fontSize: 12,
        },
      ]}
      horzAlign="center"
      vertAlign="center"
    />
  );
}

/**
 * 計算 RSI (相對強弱指標)
 * RSI 範圍: 0-100
 * - RSI > 70: 超買區（可能回調）
 * - RSI < 30: 超賣區（可能反彈）
 *
 * @param {Array} ohlcData - OHLC 資料陣列
 * @param {number} period - 計算週期（預設 14 天）
 * @returns {Array} 格式: [{ time, value? }] (前 period 天無 value)
 */
function calculateRSI(ohlcData, period = 14) {
  const closes = ohlcData.map((d) => d.close); // 提取收盤價
  const rsiData = [];

  let gainSum = 0; // 累計漲幅
  let lossSum = 0; // 累計跌幅
  let avgGain = null; // 平均漲幅
  let avgLoss = null; // 平均跌幅

  for (let i = 0; i < closes.length; i++) {
    if (i === 0) {
      // 第一天: 只有時間，無數值（佔位點）
      rsiData.push({ time: ohlcData[i].time });
      continue;
    }

    // 計算價格變化
    const change = closes[i] - closes[i - 1];
    const gain = Math.max(change, 0); // 上漲幅度（負數視為 0）
    const loss = Math.max(-change, 0); // 下跌幅度（正數視為 0）

    // 累積前 period 天的漲跌幅，還無法計算 RSI
    if (i < period) {
      gainSum += gain;
      lossSum += loss;
      rsiData.push({ time: ohlcData[i].time }); // 佔位點
      continue;
    }

    // 第 period 天: 計算初始平均漲跌幅
    if (i === period) {
      gainSum += gain;
      lossSum += loss;
      avgGain = gainSum / period;
      avgLoss = lossSum / period;
    } else {
      // 之後使用平滑移動平均(Wilder's smoothing)
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
    }

    // 計算 RSI
    // RS = 平均漲幅 / 平均跌幅
    // RSI = 100 - (100 / (1 + RS))
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    rsiData.push({ time: ohlcData[i].time, value: rsi });
  }

  return rsiData;
}

export default function TradingChart1() {
  /**
   * 使用 useMemo 只在組件初次渲染時生成資料
   * 避免每次 re-render 都重新計算
   */
  const { ohlcData, rsiData, volumeData } = useMemo(() => {
    // 1. 生成 100 天的 OHLC 資料
    const ohlc = generateOHLCData(100);

    // 2. 計算 14 日 RSI
    const rsi = calculateRSI(ohlc, 14);

    // 3. 生成成交量資料
    // 根據 K線紅綠設定顏色（收盤 > 開盤 = 紅色，否則綠色）
    const volume = generateHistogramData(100).map((d, i) => {
      const bar = ohlc[i];
      return {
        time: bar.time,
        value: d.value,
        color: bar.close > bar.open ? `${colors.red}90` : `${colors.green}90`,
      };
    });

    return { ohlcData: ohlc, rsiData: rsi, volumeData: volume };
  }, []);

  return (
    // Chart: 主圖表容器
    <Chart
      options={{
        layout: {
          panes: {
            enableResize: true, // 允許拖曳調整面板高度
            separatorColor: colors.gray100, // 面板間分隔線顏色
          },
        },
      }}
      containerProps={{ style: { flexGrow: '1' } }} // 讓圖表填滿父容器
    >
      {/* TimeScale: 時間軸控制 */}
      <TimeScale>
        {/* 自動調整時間軸以顯示所有資料 */}
        <TimeScaleFitContentTrigger deps={[]} />
      </TimeScale>

      {/* Pane 1: 主圖 - K線圖 (高度比例 3) */}
      <Pane stretchFactor={3}>
        {/* CandlestickSeries: K線圖 */}
        <CandlestickSeries
          data={ohlcData}
          options={{
            upColor: colors.red, // 漲K內部顏色（透明 = 空心）
            downColor: colors.green, // 跌K內部顏色（實心橘）
            borderUpColor: colors.red, // 漲K邊框顏色（藍）
            borderDownColor: colors.green, // 跌K邊框顏色（橘）
            wickUpColor: colors.red, // 漲K上下影線顏色
            wickDownColor: colors.green, // 跌K上下影線顏色
            priceLineVisible: false, // 隱藏價格線
          }}
        />
      </Pane>

      {/* Pane 2: RSI 指標 (高度比例 1) */}
      <Pane stretchFactor={1}>
        {/* LineSeries: RSI 折線圖 */}
        <LineSeries
          data={rsiData}
          options={{
            priceLineVisible: false, // 隱藏價格線
            color: colors.blue100, // 線條顏色
            lineWidth: 2, // 線條寬度
            priceScaleId: 'right', // 價格軸位置（右側）
          }}
        >
          {/* PriceLine: 超買線 (RSI > 70) */}
          <PriceLine
            price={70}
            options={{
              color: colors.violet, // 線條顏色
              lineWidth: 1, // 線條寬度
              lineStyle: 3, // 線條樣式 (3 = 虛線)
              axisLabelVisible: true, // 顯示軸標籤
            }}
          />
          {/* PriceLine: 超賣線 (RSI < 30) */}
          <PriceLine
            price={30}
            options={{
              color: colors.violet,
              lineWidth: 1,
              lineStyle: 3, // 虛線
              axisLabelVisible: true,
            }}
          />
        </LineSeries>
        {/* Watermark: 浮水印文字 */}
        <Watermark text="RSI-14" />
      </Pane>

      {/* Pane 3: 成交量 (高度比例 1) */}
      <Pane stretchFactor={1}>
        {/* HistogramSeries: 成交量柱狀圖 */}
        <HistogramSeries
          data={volumeData}
          options={{
            priceLineVisible: false, // 隱藏價格線
          }}
        />
        <Watermark text="VOLUME" />
      </Pane>
    </Chart>
  );
}
