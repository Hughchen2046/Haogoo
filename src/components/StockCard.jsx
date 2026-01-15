import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Grid } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';

export default function StockCard() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = import.meta.env.PROD
          ? 'https://haogoo-data.zeabur.app'
          : 'http://localhost:3000';

        const res = await axios.get(
          `${baseURL}/symbols?_embed=prices&_limit=100`
        );

        const symbolsWithPrices = res.data
          .filter((s) => s.prices?.length)
          .map((s) => {
            const sorted = [...s.prices].sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );
            return { ...s, latestPrice: sorted[0] };
          });

        setStocks(symbolsWithPrices);
      } catch (e) {
        console.error('讀取資料失敗', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>資料載入中...</div>;

  return (
    <div className="stockBox">
      <span className="stockTitle fs-2">熱門個股</span>
      <p className="stockEngtitle display-1 align-start">Popular Stocks</p>

      <Swiper
        modules={[Pagination, Grid]}
        pagination={{ clickable: true }}
        spaceBetween={2}         // 桌機卡片左右間距
        slidesPerView={1}        // 手機一列一張
        slidesPerGroup={1}       // 手機一次滑一張
        grid={{ rows: 1, fill: 'row' }} // 手機一列
        breakpoints={{
          768: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 20,
            grid: { rows: 1, fill: 'row' },
          },
          1024: {
            slidesPerView: 2,       // 一列兩張
            slidesPerGroup: 4,      // 每次滑動換一頁四張
            spaceBetween: 3,        // 桌機左右間距
            grid: { rows: 2, fill: 'row' }, // 桌機兩列
          },
        }}
        className="stockSwiper"
      >
        {stocks.map((stock) => {
          const price = stock.latestPrice;
          const changePct = price?.dailyChangePct ?? 0;
          const totalPct = price?.totalChangePct ?? 0;

          const trend =
            changePct > 0 ? 'up' :
            changePct < 0 ? 'down' : 'flat';

          const trendColor =
            trend === 'up'
              ? 'text-danger'
              : trend === 'down'
              ? 'text-success'
              : 'text-secondary';

          return (
            <SwiperSlide key={stock.id}>
              <div className="stockCard">
                <div className="stockLeft">
                  <div className={`stockIcon ${trend}`}>
                    {trend === 'up' && <ArrowUp size={18} />}
                    {trend === 'down' && <ArrowDown size={18} />}
                    {trend === 'flat' && <Minus size={18} />}
                  </div>

                  <div className="d-flex flex-grow-1 align-items-center">
                    <div className="stockName text-truncate">{stock.name}</div>
                    <div className="stockSymbol ms-auto text-end">{stock.id} 上市</div>
                  </div>
                </div>

                <div className="stockRight">
                  <div className={`stockPrice ${trendColor}`}>
                    {Math.floor(price?.close ?? 0)}
                  </div>
                  <div className={`stockChange ${trendColor}`}>
                    {trend === 'up' && '+'}
                    {changePct} ({totalPct}%)
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
