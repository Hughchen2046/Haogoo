import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Grid } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';

export default function IndustryList() {
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    const baseURL = import.meta.env.PROD
      ? 'https://haogoo-data.zeabur.app'
      : 'http://localhost:3000';

    fetch(`${baseURL}/symbols?industryTW_ne=綜合&_embed=prices&_limit=18`)
      .then(res => res.json())
      .then(data => setSymbols(data))
      .catch(err => console.error(err));
  }, []);

  // 每 2 筆 symbols 組成一張卡
  const groups = [];
  for (let i = 0; i < symbols.length; i += 2) {
    groups.push(symbols.slice(i, i + 2));
  }

  return (
    <div className="industryBox">
      {/* 標題 */}
      <section className="industryTitle fs-2 mb-1">精選產業</section>
      <p className="industryEngTitle display-1 text-align-center">
        Featured Industries
      </p>

      <Swiper
        modules={[Pagination, Grid]} // <- 加入 Grid
        pagination={{ clickable: true }}
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
        className="industrySwiper"
      >
        {groups.map((group, index) => {
          const avgDailyChangePct = (() => {
            const values = group
              .map(s => s.prices?.at(-1)?.dailyChangePct)
              .filter(v => typeof v === 'number');
            if (!values.length) return '--';
            return (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2);
          })();

          return (
            <SwiperSlide key={index}>
              <div className="card industryCard h-100">
                <div className="cardContent">
                  {/* Header */}
                  <div className="cardHeader p-4 d-flex justify-content-between">
                    <span className="industryName fs-2">
                      {group[0]?.industryTW ?? '產業'}
                    </span>
                    {avgDailyChangePct !== '--' &&
                      (Number(avgDailyChangePct) >= 0 ? (
                        <TrendingUp size={22} />
                      ) : (
                        <TrendingDown size={22} />
                      ))}
                  </div>

                  {/* 日期 */}
                  <div className="closePrice px-4">12/05 收盤價</div>

                  {/* 公司列表 */}
                  <div className="industryContent px-4">
                    {group.map(symbol => {
                      const latest = symbol.prices?.at(-1);
                      const daily = latest?.dailyChangePct;
                      const isDown = typeof daily === 'number' && daily < 0;

                      return (
                        <div
                          key={symbol.id}
                          className="companyRow d-flex justify-content-between align-items-center"
                        >
                          <div className="companyName fs-6">{symbol.name}</div>
                          <div
                            className={`industryRate d-flex align-items-center gap-1 ${
                              isDown ? 'text-success' : 'text-danger'
                            }`}
                          >
                            {latest?.close?.toFixed(2) ?? '--'}
                            ({daily?.toFixed(2) ?? '--'}%)
                            {isDown ? (
                              <TrendingDown size={16} />
                            ) : (
                              <TrendingUp size={16} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 底部 */}
                  <div className="industrySummary px-4 py-3 d-flex justify-content-between align-items-center">
                    <div className="industryTag fs-6">近60日報酬率</div>
                    <div
                      className={`industryRate fs-2 d-flex align-items-center gap-1 ${
                        avgDailyChangePct !== '--' && Number(avgDailyChangePct) >= 0
                          ? 'text-danger'
                          : 'text-success'
                      }`}
                    >
                      {avgDailyChangePct}%
                      {avgDailyChangePct !== '--' &&
                        (Number(avgDailyChangePct) >= 0 ? (
                          <TrendingUp size={18} />
                        ) : (
                          <TrendingDown size={18} />
                        ))}
                    </div>
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
