import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { BeatLoader } from 'react-spinners';
import ButtonPrimary from './Tools/ButtonPrimary';
import { useSelector } from 'react-redux';
import { IsAuthed } from '../app/features/auth/authSlice';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Grid, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import 'swiper/css/navigation';

export default function IndustryList() {
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#0d6efd');
  const isAuth = useSelector(IsAuthed);
  const navigate = useNavigate();

  // 取得產業與股票資料
  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_BASE;

    fetch(`${baseURL}/symbols?industryTW_ne=綜合&_embed=prices&_limit=18`)
      .then((res) => res.json())
      .then((data) => setSymbols(data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 取得 CSS 主色
  useEffect(() => {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--bs-primary')
      .trim();
    if (color) setPrimaryColor(color);
  }, []);

  // 每 2 筆 symbols 組成一張卡
  const groups = [];
  const safeSymbols = symbols || [];
  for (let i = 0; i < safeSymbols.length; i += 2) {
    groups.push(safeSymbols.slice(i, i + 2));
  }

  if (loading) {
    return (
      <section>
        <div
          className="container py-64 py-md-96 d-flex justify-content-center align-items-center"
          style={{ minHeight: '300px' }}
        >
          <BeatLoader color={primaryColor} size={15} />
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="container py-64 py-md-96 font-zh-tw">
        <h3 className="h2-md mb-8">精選產業</h3>
        <h2 className="text-primary display-2 display-1-md mb-32 mb-md-40">
          Featured Industries
        </h2>

        <Swiper
          modules={[Pagination, Grid, Navigation]}
          pagination={{
            el: '.industry-pagination',
            clickable: true,
            renderBullet: (index, className) => `<span class="${className}">${index + 1}</span>`,
          }}
          slidesPerView={1}
          spaceBetween={12}
          breakpoints={{
            0: { slidesPerView: 1, grid: { rows: 3, fill: 'row' }, spaceBetween: 12 },
            1024: { slidesPerView: 3, grid: { rows: 1 }, spaceBetween: 12 },
          }}
          navigation={{ prevEl: '.industry-prev', nextEl: '.industry-next' }}
          className="industrySwiper"
        >
          {groups.map((group, index) => {
            // 🔥 計算每間公司近60日總報酬率
            const totalChangePct = group.map((symbol) => {
              const prices = symbol.prices || [];
              if (prices.length < 60) return null;

              const latest = prices.at(-1)?.close;
              const past = prices.at(-60)?.close;

              if (!latest || !past) return null;

              return ((latest - past) / past * 100).toFixed(2);
            });

            const shouldBlur = !isAuth && index >= 1;

            return (
              <SwiperSlide key={index} className={shouldBlur ? 'position-relative' : ''}>
                <div
                  className="card card-shadow-hover industryCard h-100"
                  style={shouldBlur ? { filter: 'blur(8px)', pointerEvents: 'none' } : {}}
                  onClick={() => navigate('/mystocklist#popular-industry')}
                >
                  <div className="p-24">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-16">
                      <h3 className="card-shadow-title">{group[0]?.industryTW ?? '產業'}</h3>
                    </div>

                    {/* 日期 */}
                    <div className="text-end text-gray-900 caption font-weight-light">
                      最新收盤價
                    </div>

                    {/* 公司列表 */}
                    <div className="industryContent">
                      {group.map((symbol) => {
                        const latest = symbol.prices?.at(-1);
                        const dailyChangePct = latest?.dailyChangePct;
                        const isDown = typeof dailyChangePct === 'number' && dailyChangePct < 0;

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
                              {latest?.close?.toFixed(2) ?? '--'} (
                              {dailyChangePct?.toFixed(2) ?? '--'}%)
                            </h6>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 底部：兩間公司各自近60日總報酬率 */}
                  <div className="industrySummary px-24 py-16 d-flex justify-content-between align-items-center">
                    <div className="industryTag font-weight-light">近60日報酬率</div>
                    <div className="industryRate h2 d-flex flex-column align-items-end gap-4">
                      {totalChangePct.map((pct, i) => {
                        const isUp = pct && Number(pct) >= 0;
                        return (
                          <div
                            key={i}
                            className={pct ? (isUp ? 'text-danger' : 'text-success') : ''}
                          >
                            {pct ? `${Number(pct) > 0 ? '+' : ''}${pct}%` : '--'}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {shouldBlur && (
                  <div
                    className="position-absolute top-50 start-50 translate-middle text-center"
                    style={{ zIndex: 10 }}
                  >
                    <ButtonPrimary
                      className="py-12 px-32 round-8"
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
