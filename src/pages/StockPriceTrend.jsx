import React, { useEffect, useMemo, useRef } from 'react';
import { createChart, LineSeries } from 'lightweight-charts';

const colors = { blue: '#2962FF', gray100: '#E0E0E0' };

const generateLineData = (stockData) =>
  stockData?.prices?.map((p) => ({ time: p.date, value: p.close })) || [];

export default function StockPriceTrend({ stockData }) {
  const lineData = useMemo(() => generateLineData(stockData), [stockData]);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !lineData.length) return undefined;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 500,
      layout: { background: { color: '#fff' }, textColor: '#333' },
      grid: { vertLines: { color: colors.gray100 }, horzLines: { color: colors.gray100 } },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, timeVisible: true },
    });

    const series = chart.addSeries(LineSeries, {
      color: colors.blue,
      lineWidth: 2,
    });
    series.setData(lineData);
    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({ width: container.clientWidth });
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [lineData]);

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
    <div style={{ position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '500px' }} />
      <div
        style={{
          position: 'absolute',
          right: 12,
          bottom: 10,
          color: '#999',
          fontSize: 12,
          pointerEvents: 'none',
        }}
      >
        股價走勢
      </div>
    </div>
  );
}
