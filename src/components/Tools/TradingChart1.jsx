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
/**
 * 從 stockData 提取 OHLC (開高低收) 蠟燭圖資料
 * @param {Object} stockData - 股票資料物件
 * @returns {Array} 格式: [{ time, open, high, low, close }]
 */
const generateOHLCData = (stockData) => {
  if (!stockData?.prices || stockData.prices.length === 0) {
    console.log('generateOHLCData: 沒有股票資料');
    return [];
  }
  console.log('generateOHLCData: 產生 K線資料', '，共', stockData.prices.length, '筆');

  return stockData.prices.map((price) => {
    return {
      time: price.date,
      open: price.open,
      high: price.high,
      low: price.low,
      close: price.close,
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
          color: `${colors.blue}`,
          fontSize: 12,
        },
      ]}
      horzAlign="right"
      vertAlign="bottom"
    />
  );
}

export default function TradingChart1({ stockData, stockSelect }) {
  /**
   * 使用 useMemo 只在組件初次渲染時生成資料
   * 避免每次 re-render 都重新計算
   */
  console.log('由父層來的資料', stockData);
  console.log('由父層來的資料', stockSelect);

  const { ohlcData, volumeData } = useMemo(() => {
    // 1. 生成 OHLC 資料從 stockData
    const ohlc = generateOHLCData(stockData);

    // 2. 如果沒有資料，返回空陣列
    if (ohlc.length === 0) {
      return { ohlcData: [], volumeData: [] };
    }

    // 3. 生成成交量資料（使用真實的 volume 數據）
    // 根據 K線紅綠設定顏色（收盤 > 開盤 = 紅色，否則綠色）
    const volume = stockData.prices.map((price) => {
      return {
        time: price.date,
        value: price.volume,
        color: price.close > price.open ? `${colors.red}90` : `${colors.green}90`,
      };
    });

    console.log('生成成交量資料:', volume.length, '筆，範例:', volume[0]);

    return { ohlcData: ohlc, volumeData: volume };
  }, [stockData, stockSelect]);

  // 早期返回：如果沒有資料，顯示提示訊息
  if (!stockData || !stockData.prices || stockData.prices.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          color: '#666',
        }}
      >
        無可用的股票資料
      </div>
    );
  }

  if (ohlcData.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          color: '#666',
        }}
      >
        資料處理失敗
      </div>
    );
  }

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

      {/* Pane 3: 成交量 (高度比例 1) */}
      <Pane stretchFactor={1}>
        {/* HistogramSeries: 成交量柱狀圖 */}
        <HistogramSeries
          data={volumeData}
          options={{
            priceLineVisible: false, // 隱藏價格線
          }}
        />
        <Watermark text="交易量" />
      </Pane>
    </Chart>
  );
}
