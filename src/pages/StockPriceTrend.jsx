import React, { useMemo, useEffect, useState } from 'react';
import {
  Chart,
  Pane,
  LineSeries,
  TimeScale,
  TimeScaleFitContentTrigger,
  WatermarkText,
} from 'lightweight-charts-react-components';

const colors = { blue: '#2962FF', gray100: '#E0E0E0' };

const generateLineData = (stockData) =>
  stockData?.prices?.map((p) => ({ time: p.date, value: p.close })) || [];

export default function StockPriceTrend({ stockData }) {
  const lineData = useMemo(() => generateLineData(stockData), [stockData]);
  const [shouldRender, setShouldRender] = useState(false);
  const [chartKey, setChartKey] = useState(0);

  // 延遲渲染,確保舊圖表完全清理
  useEffect(() => {
    setShouldRender(false);
    setChartKey((prev) => prev + 1);

    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 100); // 延遲 100ms 渲染

    return () => {
      clearTimeout(timer);
      setShouldRender(false);
    };
  }, [stockData?.id]);

  if (!lineData.length) {
    return (
      <div
        style={{
          width: '100%',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
        }}
      >
        無股價資料
      </div>
    );
  }

  // 延遲渲染期間顯示 loading
  if (!shouldRender) {
    return (
      <div
        style={{
          width: '100%',
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
        }}
      >
        載入圖表中...
      </div>
    );
  }

  return (
    <Chart
      key={`chart-${stockData?.id}-${chartKey}`}
      options={{
        layout: { background: { color: '#fff' }, textColor: '#333' },
        grid: { vertLines: { color: colors.gray100 }, horzLines: { color: colors.gray100 } },
        rightPriceScale: { borderVisible: false },
        timeScale: { borderVisible: false, timeVisible: true },
      }}
      containerProps={{ style: { flexGrow: 1, height: '500px' } }}
    >
      <TimeScale>
        <TimeScaleFitContentTrigger deps={[lineData]} />
      </TimeScale>

      <Pane stretchFactor={1}>
        <LineSeries data={lineData} options={{ color: colors.blue, lineWidth: 2 }} />
        <WatermarkText
          lines={[{ text: '股價走勢', color: '#999', fontSize: 12 }]}
          horzAlign="right"
          vertAlign="bottom"
        />
      </Pane>
    </Chart>
  );
}
