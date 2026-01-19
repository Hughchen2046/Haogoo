import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Grid, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import 'swiper/css/navigation';

export default function StockCard() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = import.meta.env.PROD
          ? 'https://haogoo-data.zeabur.app'
          : 'http://localhost:3000';

        const res = await axios.get(`${baseURL}/symbols?_embed=prices&_limit=1000`);

        const symbolsWithPrices = res.data
          .filter((s) => s.prices?.length)
          .map((s) => {
            const sorted = [...s.prices].sort((a, b) => new Date(b.date) - new Date(a.date));
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
    <section className="bg-gray-400">
      <div className="container py-64 py-md-96 font-zh-tw">
        <h3 className="h2-md mb-8 ">熱門個股</h3>
        <h2 className="text-primary display-2 display-1-md mb-32 mb-md-40">Popular Stocks</h2>

        <Swiper
          modules={[Pagination, Grid, Navigation]}
          pagination={{
            el: '.stock-pagination',
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className}">${index + 1}</span>`;
            },
          }}
          navigation={{
            prevEl: '.stock-prev',
            nextEl: '.stock-next',
          }}
          spaceBetween={10} // 手機卡片間距
          slidesPerView={1} // 每列一張
          slidesPerGroup={3} // 一次滑動一頁（3張）
          grid={{ rows: 4, fill: 'row' }} // 手機三列
          breakpoints={{
            1024: {
              slidesPerView: 2, // 桌機每列兩張
              slidesPerGroup: 4, // 每次滑動換一頁（4張）
              spaceBetween: 20, // 桌機左右間距
              grid: { rows: 2, fill: 'row' }, // 桌機兩列
            },
          }}
          className="stockSwiper"
        >
          {stocks.map((stock) => {
            const price = stock.latestPrice;
            const changePct = price?.dailyChangePct ?? 0;
            const totalPct = price?.totalChangePct ?? 0;

            const trend = changePct > 0 ? 'up' : changePct < 0 ? 'down' : 'flat';

            const trendColor =
              trend === 'up' ? 'text-danger' : trend === 'down' ? 'text-success' : 'text-secondary';
            const trendBgColor =
              trend === 'up' ? 'bg-pink' : trend === 'down' ? 'bg-pinkgreen' : 'border bg-light';
            return (
              <SwiperSlide key={stock.id}>
                <div className="stockCard border round-24 p-16 d-md-flex justify-content-md-between py-md-48 px-md-24">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-8 mb-8 pb-md-0 mb-md-0 border-md-0">
                    <div className="d-flex gap-16 align-items-center me-md-16">
                      <div
                        className={`d-flex justify-content-center align-items-center icon-48 round-8 bg-pink ${trend} ${trendBgColor}`}
                      >
                        {trend === 'up' && <ArrowUp className={`icon-24 ${trendColor}`} />}
                        {trend === 'down' && <ArrowDown className={`icon-24 ${trendColor}`} />}
                        {trend === 'flat' && <Minus className={`icon-24 ${trendColor}`} />}
                      </div>
                      <h3>{stock.name}</h3>
                    </div>
                    <div className="font-weight-light round-4 bg-gray-500 py-10 px-8">
                      {stock.id} 上市
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center flex-md-column gap-md-8">
                    <div className={`h1 ${trendColor}`}>
                      {(price?.close ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className={`caption ${trendColor}`}>
                      {trend === 'up' && '+'}
                      {changePct.toFixed(2)}% ({totalPct.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="stock-pagination-container justify-content-md-start">
          <div className="stock-prev">
            <ChevronLeft size={24} />
          </div>
          <div className="stock-pagination"></div>
          <div className="stock-next">
            <ChevronRight size={24} />
          </div>
        </div>
      </div>
    </section>
  );
}
