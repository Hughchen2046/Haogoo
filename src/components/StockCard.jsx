import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Minus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';
import ButtonPrimary from './Tools/ButtonPrimary';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Grid, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IsAuthed } from '../app/features/auth/authSlice';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import 'swiper/css/navigation';

export default function StockCard() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#0d6efd');
  const isAuth = useSelector(IsAuthed);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE;

        const res = await axios.get(
          `${baseURL}/symbols?_embed=prices&_limit=1000`
        );

        const symbolsWithPrices = res.data.data
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

  useEffect(() => {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--bs-primary')
      .trim();
    if (color) setPrimaryColor(color);
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-400">
        <div
          className="container py-64 py-md-96"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px',
          }}
        >
          <BeatLoader color={primaryColor} size={15} />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-400">
      <div className="container py-64 py-md-96 font-zh-tw">
        <h3 className="h2-md mb-8">熱門個股</h3>
        <h2 className="text-primary display-2 display-1-md mb-32 mb-md-40">
          Popular Stocks
        </h2>

        <Swiper
          modules={[Pagination, Grid, Navigation]}
          pagination={{
            el: '.stock-pagination',
            clickable: true,
            renderBullet: (index, className) =>
              `<span class="${className}">${index + 1}</span>`,
          }}
          navigation={{
            prevEl: '.stock-prev',
            nextEl: '.stock-next',
          }}
          spaceBetween={10}
          slidesPerView={1}
          slidesPerGroup={3}
          grid={{ rows: 4, fill: 'row' }}
          breakpoints={{
            1024: {
              slidesPerView: 2,
              slidesPerGroup: 4,
              spaceBetween: 20,
              grid: { rows: 2, fill: 'row' },
            },
          }}
          className="stockSwiper"
        >
          {stocks.map((stock, index) => {
            const price = stock.latestPrice;
            const changePct = price?.dailyChangePct ?? 0;
            const totalPct = price?.totalChangePct ?? 0;

            const trend =
              changePct > 0 ? 'up' : changePct < 0 ? 'down' : 'flat';

            const trendColor =
              trend === 'up'
                ? 'text-danger'
                : trend === 'down'
                ? 'text-success'
                : 'text-secondary';

            const trendBgColor =
              trend === 'up'
                ? 'bg-pink'
                : trend === 'down'
                ? 'bg-pinkgreen'
                : 'border bg-light';

            // 前4張可看，其餘未登入模糊
            const shouldBlur = !isAuth && index >= 4;

            return (
              <SwiperSlide
                key={stock.id}
                className={shouldBlur ? 'position-relative' : ''}
              >
                <div
                  className="stockCard border round-24 p-16 d-md-flex justify-content-md-between py-md-48 px-md-24"
                  style={
                    shouldBlur
                      ? { filter: 'blur(8px)', pointerEvents: 'none' }
                      : { cursor: 'pointer' }
                  }
                  onClick={() => {
                    if (!shouldBlur) {
                      navigate(`/stockInfo/${stock.id}`);
                    }
                  }}
                >
                  {/* 上半部 */}
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-8 mb-8 pb-md-0 mb-md-0 border-md-0">
                    <div className="d-flex gap-16 align-items-center me-md-16">
                      <div
                        className={`d-flex justify-content-center align-items-center icon-48 round-8 ${trendBgColor}`}
                      >
                        {trend === 'up' && (
                          <ArrowUp className={`icon-24 ${trendColor}`} />
                        )}
                        {trend === 'down' && (
                          <ArrowDown className={`icon-24 ${trendColor}`} />
                        )}
                        {trend === 'flat' && (
                          <Minus className={`icon-24 ${trendColor}`} />
                        )}
                      </div>
                      <h3>{stock.name}</h3>
                    </div>
                    <div className="font-weight-light round-4 bg-gray-500 py-10 px-8">
                      {stock.id} 上市
                    </div>
                  </div>

                  {/* 價格區 */}
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

                {/* 未登入遮罩 */}
                {shouldBlur && (
                  <div
                    className="position-absolute top-50 start-50 translate-middle text-center"
                    style={{ zIndex: 10 }}
                  >
                    <ButtonPrimary
                      className="btn btn-outline-primary py-12 px-32 round-8"
                      onClick={() => navigate('/login')}
                    >
                      登入查看更多
                    </ButtonPrimary>
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* 分頁控制 */}
        <div className="stock-pagination-container justify-content-md-start d-flex align-items-center gap-16 mt-24">
          <div className="stock-prev cursor-pointer">
            <ChevronLeft size={24} />
          </div>
          <div className="stock-pagination"></div>
          <div className="stock-next cursor-pointer">
            <ChevronRight size={24} />
          </div>
        </div>
      </div>
    </section>
  );
}
