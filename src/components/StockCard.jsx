import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';

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
          `${baseURL}/symbols?_embed=prices&_limit=50`
        );

        // 過濾掉沒有 prices 的 symbol
        const symbolsWithPrices = res.data
          .filter((symbol) => symbol.prices && symbol.prices.length > 0)
          .map((symbol) => {
            // 依日期排序，取最新一筆
            const sortedPrices = symbol.prices.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );
            return {
              ...symbol,
              latestPrice: sortedPrices[0],
            };
          });

        setStocks(symbolsWithPrices);
      } catch (error) {
        console.error('讀取資料失敗', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>資料載入中...</div>;

  return (
    <>
      <span className="stockTitle fs-2">熱門個股</span>
      <p className="stockEngtitle">Popular Stocks</p>

      <div className="swiperContainer" style={{ position: 'relative' }}>
        <Swiper
          modules={[Grid, Pagination]}
          spaceBetween={16}
          pagination={{ clickable: true }}
          slidesPerView={1}
          grid={{ rows: 4, fill: 'row' }}
          breakpoints={{
            768: {
              slidesPerView: 2,
              grid: { rows: 2, fill: 'row' },
              allowTouchMove: true,
            },
          }}
          className="stockSwiper"
        >
          {stocks.map((stock) => {
            const price = stock.latestPrice;
            const changePct = price?.dailyChangePct ?? 0;
            const totalPct = price?.totalChangePct ?? 0;

            let trend = 'flat';
            if (changePct > 0) trend = 'up';
            else if (changePct < 0) trend = 'down';

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

        <div
          className="custom-pagination"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            textAlign: 'center',
            padding: '12px 0',
            zIndex: 10,
          }}
        ></div>
      </div>
    </>
  );
}
