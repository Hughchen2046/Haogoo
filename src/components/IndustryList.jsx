
import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

export default function IndustryList() {
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    fetch(
      'https://haogoo-data.zeabur.app/symbols?industryTW_ne=綜合&_embed=prices&_limit=18'
    )
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
      <span className="industryEngTitle mb-4 d-block">
        Featured Industries
      </span>

      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 3 },
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

            const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
            return avg.toFixed(2);
          })();

          return (
            <SwiperSlide key={index}>
              <div className="card round-24 h-100">
                <div className="cardContent">
                  {/* Header */}
                  <div className="cardHeader p-4 d-flex justify-content-between">
                    <span className="industryName fs-2">
                      {group[0]?.industryTW ?? '產業'}
                    </span>
                    <TrendingUp color="#ff0000" />
                  </div>

                  {/* 日期 */}
                  <div className="closePrice">12/05 收盤價</div>

                  {/* 公司列表 */}
                  <div className="industryContent">
                    {group.map(symbol => {
                      const latest = symbol.prices?.at(-1);
                      const isPositive = latest?.dailyChangePct >= 0;

                      return (
                        <div
                          key={symbol.id}
                          className="companyRow d-flex justify-content-between align-items-center"
                        >
                          <div className="companyName fs-6">{symbol.name}</div>

                          <div
                            className={`industryRate ${
                              isPositive ? 'text-danger' : 'text-success'
                            } d-flex align-items-center gap-1`}
                          >
                            {latest?.close != null
                              ? latest.close.toFixed(2)
                              : '--'}
                            (
                            {latest?.dailyChangePct != null
                              ? latest.dailyChangePct.toFixed(2)
                              : '--'}
                            )%
                            {isPositive ? (
                              <TrendingUp size={18} />
                            ) : (
                              <TrendingDown size={18} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 底部平均報酬率 */}
                  <div className="industrySummary">
                    <div className="industryTag fs-6">近60日報酬率</div>
                    <div
                      className={`industryRate fs-2 ${
                        avgDailyChangePct >= 0 ? 'text-danger' : 'text-success'
                      }`}
                    >
                      {avgDailyChangePct}%
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
