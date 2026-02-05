import { useEffect, useRef } from 'react';

export default function StockPriceTrend({ stockSelect }) {
  const tvRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!tvRef.current) return;

    tvRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      widgetRef.current = new window.TradingView.widget({
        container_id: 'tradingview_chart',
        symbol: `TWSE:${stockSelect}`,
        interval: 'D',
        width: tvRef.current.offsetWidth,
        height: window.innerWidth < 768 ? 400 : 500,
        timezone: 'Asia/Taipei',
        theme: 'light',
        style: 1,
        locale: 'zh_TW',
        enable_publishing: false,
        allow_symbol_change: false,
      });
    };

    tvRef.current.appendChild(script);

    const resizeObserver = new ResizeObserver(() => {
      widgetRef.current?.resize(
        tvRef.current.offsetWidth,
        window.innerWidth < 768 ? 400 : 500
      );
    });

    resizeObserver.observe(tvRef.current);

    return () => resizeObserver.disconnect();
  }, [stockSelect]);

  return (
    <div
      ref={tvRef}
      id="tradingview_chart"
      style={{ width: '100%', height: '500px' }}
    />
  );
}
