import React, { useMemo } from 'react';
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

  return (
    <Chart
      key={stockData.id} // 防止舊 chart 殘留
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
