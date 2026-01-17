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

  // 每 2 筆 symbols 分成一組（一張卡）
  const groups = [];
  for (let i = 0; i < symbols.length; i += 2) {
    groups.push(symbols.slice(i, i + 2));
  }

  return (
    <>
      {/* 標題 */}
      <section className="industryTitle fs-2 mb-1">精選產業</section>
      <span className="industryEngTitle text-align-center Display-1 extraBold mb-4">
        Featured Industries
      </span>

      <Swiper
        modules={[Pagination, Grid]}
        pagination={{ clickable: true }}
        spaceBetween={16}

        /* ===== 手機預設 ===== */
        slidesPerView={1}     
        slidesPerGroup={3}    
        grid={{ rows: 3, fill: 'row' }} 

        breakpoints={{
          1024: {
            slidesPerView: 3,     
            slidesPerGroup: 3,    
            grid: { rows: 1, fill: 'row' }, 
            spaceBetween: 12,
          },
        }}
        className="industrySwiper"
      >
        {groups.map((group, index) => {
          // 計算兩間公司的平均報酬率
          const avgDailyChangePct = (() => {
            const values = group
              .map(s => s.prices?.at(-1)?.dailyChangePct)
              .filter(v => typeof v === 'number');

            if (values.length === 0) return '--';

            const avg =
              values.reduce((sum, v) => sum + v, 0) / values.length;
            return avg.toFixed(2);
          })();

          return (
            <SwiperSlide key={index}>
              <div className="card round-24 h-100 d-flex flex-column">
                <div className="cardContent">
                  {/* Header */}
                  <div className="cardHeader p-4 d-flex justify-content-between">
                    <span className="industryName p-2 fs-2">
                      {group[0]?.industryTW ?? '產業'}
                    </span>

                    {/* Header icon 根據 avgDailyChangePct */}
                    {avgDailyChangePct !== '--' && (
                      Number(avgDailyChangePct) >= 0 ? (
                        <TrendingUp size={24} />
                      ) : (
                        <TrendingDown size={24} />
                      )
                    )}
                  </div>

                  {/* 日期 */}
                  <div className="closePrice">12/05 收盤價</div>

                  {/* 公司列表 */}
                  <div className="industryContent">
                    {group.map(symbol => {
                      const latest = symbol.prices?.at(-1);
                      const daily = latest?.dailyChangePct;
                      const total = latest?.totalChangePct;

                      const isDown =
                        (typeof daily === 'number' && daily < 0) ||
                        (typeof total === 'number' && total < 0);

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
                            {latest?.close != null ? latest.close.toFixed(2) : '--'}
                            (
                            {daily != null ? daily.toFixed(2) : '--'}%
                            )
                            {isDown ? (
                              <TrendingDown size={18} />
                            ) : (
                              <TrendingUp size={18} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 底部平均報酬率 */}
                  <div className="industrySummary d-flex align-items-center justify-content-between">
                    <div className="industryTag fs-6">近60日報酬率</div>
                    <div
                      className={`industryRate fs-2 d-flex align-items-center gap-2 ${
                        avgDailyChangePct !== '--' && Number(avgDailyChangePct) >= 0
                          ? 'text-danger'
                          : 'text-success'
                      }`}
                    >
                      {avgDailyChangePct}%
                      {avgDailyChangePct !== '--' &&
                        (Number(avgDailyChangePct) >= 0 ? (
                          <TrendingUp size={20} />
                        ) : (
                          <TrendingDown size={20} />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
