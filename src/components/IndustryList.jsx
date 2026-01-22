import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ButtonPrimary from './Tools/ButtonPrimary';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Grid, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import 'swiper/css/navigation';

export default function IndustryList() {
  const [symbols, setSymbols] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  // 檢查登入狀態
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuth(!!token);
    };

    checkAuth();

    // 監聽 storage 事件（跨頁面）和 authChange 事件（同頁面）
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  useEffect(() => {
    const baseURL = import.meta.env.PROD
      ? 'https://haogoo-data.zeabur.app'
      : 'http://localhost:3000';

    fetch(`${baseURL}/symbols?industryTW_ne=綜合&_embed=prices&_limit=18`)
      .then((res) => res.json())
      .then((data) => setSymbols(data))
      .catch((err) => console.error(err));
  }, []);

  // 每 2 筆 symbols 組成一張卡
  const groups = [];
  for (let i = 0; i < symbols.length; i += 2) {
    groups.push(symbols.slice(i, i + 2));
  }

  return (
    <section>
      <div className="container py-64 py-md-96 font-zh-tw">
        <h3 className="h2-md mb-8 ">精選產業</h3>
        <h2 className="text-primary display-2 display-1-md mb-32 mb-md-40">Featured Industries</h2>

        <Swiper
          modules={[Pagination, Grid, Navigation]} // <- 加入 Grid
          pagination={{
            el: '.industry-pagination',
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className}">${index + 1}</span>`;
            },
          }}
          slidesPerView={1}
          spaceBetween={12}
          breakpoints={{
            0: {
              slidesPerView: 1,
              grid: { rows: 3, fill: 'row' }, // 手機：三列
              spaceBetween: 12,
            },
            1024: {
              slidesPerView: 3,
              grid: { rows: 1 },
              spaceBetween: 12,
            },
          }}
          navigation={{
            prevEl: '.industry-prev',
            nextEl: '.industry-next',
          }}
          className="industrySwiper"
        >
          {groups.map((group, index) => {
            const avgDailyChangePct = (() => {
              const values = group
                .map((s) => s.prices?.at(-1)?.dailyChangePct)
                .filter((v) => typeof v === 'number');
              if (!values.length) return '--';
              return (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2);
            })();
            const shouldBlur = !isAuth && index >= 1;
            return (
              <SwiperSlide key={index} className={shouldBlur ? 'position-relative' : ''}>
                <div
                  className="card industryCard h-100"
                  style={shouldBlur ? { filter: 'blur(8px)', pointerEvents: 'none' } : {}}
                >
                  <div className="p-24">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-16">
                      <h3 className="">{group[0]?.industryTW ?? '產業'}</h3>
                      {avgDailyChangePct !== '--' &&
                        (Number(avgDailyChangePct) > 0 ? (
                          <TrendingUp size={36} className="text-danger" />
                        ) : (
                          <TrendingDown size={36} className="text-success" />
                        ))}
                    </div>

                    {/* 日期 */}
                    <div className="text-end text-gray-900 caption font-weight-light">
                      12/05 收盤價
                    </div>

                    {/* 公司列表 */}
                    <div className="industryContent">
                      {group.map((symbol) => {
                        const latest = symbol.prices?.at(-1);
                        const daily = latest?.dailyChangePct;
                        const isDown = typeof daily === 'number' && daily < 0;

                        return (
                          <div
                            key={symbol.id}
                            className="companyRow d-flex justify-content-between align-items-center mt-12"
                          >
                            <h6>{symbol.name}</h6>
                            <h6
                              className={`industryRate d-flex align-items-center gap-4 ${
                                isDown ? 'text-success' : 'text-danger'
                              }`}
                            >
                              {latest?.close?.toFixed(2) ?? '--'} ({daily?.toFixed(2) ?? '--'}%)
                            </h6>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* 底部 */}
                  <div className="industrySummary px-24 py-16 d-flex justify-content-between align-items-center">
                    <div className="industryTag font-weight-light">近60日報酬率</div>
                    <div
                      className={`industryRate h2 d-flex align-items-center ${
                        avgDailyChangePct !== '--' && Number(avgDailyChangePct) >= 0
                          ? 'text-danger'
                          : 'text-success'
                      }`}
                    >
                      {avgDailyChangePct > 0 ? '+' : ''}
                      {avgDailyChangePct}%
                    </div>
                  </div>
                </div>
                {shouldBlur && (
                  <div
                    className="position-absolute top-50 start-50 translate-middle text-center"
                    style={{ zIndex: 10 }}
                  >
                    <ButtonPrimary
                      className=" py-12 px-32 round-8"
                      data-bs-toggle="modal"
                      data-bs-target="#loginModal"
                    >
                      登入查看更多
                    </ButtonPrimary>
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="industry-pagination-container justify-content-md-start">
          <div className="industry-prev">
            <ChevronLeft size={24} />
          </div>
          <div className="industry-pagination"></div>
          <div className="industry-next">
            <ChevronRight size={24} />
          </div>
        </div>
      </div>
    </section>
  );
}
