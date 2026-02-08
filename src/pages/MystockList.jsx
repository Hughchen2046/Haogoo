import React, { useState, useEffect, useRef } from 'react'; // Components & Icons
import TradingViewChart from '../components/Tools/TradingChart1';

import Navbar from '../components/Routes/Navbar';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Swiper & Styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Grid, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import 'swiper/css/navigation';

export default function MystockList() {
  const [activeTab, setActiveTab] = useState('我的好股');
  const tabs = ['我的好股', '精選與行情'];
  // 記錄藥丸按鈕目前選哪一個
  const [marketTab, setMarketTab] = useState('加權指數');
  // 建立一個狀態來記錄愛心是否為實心
  const [liked, setLiked] = useState(false);
  // 對應 TradingView 的代號
  const symbolMap = {
    加權指數: 'TWSE:TAIEX',
    櫃買指數: 'TWO:OTC',
    台指期: 'TAIEX:FITX1!',
    各項指數: 'TWSE:IR0001',
  };

  return (
    <>
      <Navbar />

      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mt-80 mb-48 caption">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#" className="text-decoration-none text-primary">
                首頁
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              我的選股清單
            </li>
          </ol>
        </nav>

        {/* Title Section */}
        <header className="mb-40">
          <h2 className="fs-bold mb-8 font-zh-tw">我的選股清單</h2>
          <h1 className="font-en display-1 text-primary mb-40">My Watchlist</h1>
        </header>

        {/* Section 1: Tabs */}
        <ul
          className="nav custom-tabs mb-24 d-flex align-items-center"
          style={{ borderBottom: '1px solid gray-500', gap: '40px' }}
        >
          {tabs.map((tab) => (
            <li className="nav-item" key={tab}>
              <a
                href="#"
                className={`nav-link px-0 py-2 h4 fw-bold ${activeTab === tab ? 'active' : 'text-gray-800'}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab);
                }}
                style={navLinkStyle(activeTab === tab)}
              >
                {tab}
              </a>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          {activeTab === '我的好股' ? (
            <div>
              <section className="pt-40">
                <h2 className="fs-bold mb-24 font-zh-tw h1">市場行情</h2>
                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active round-pill h5 fw-bold"
                      id="pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"
                    >
                      加權指數
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link round-pill h5 fw-bold"
                      id="pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#"
                      type="button"
                      role="tab"
                      aria-controls="pills-profile"
                      aria-selected="false"
                    >
                      櫃買指數
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link round-pill h5 fw-bold"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      台指期
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link round-pill h5 fw-bold"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      各項指數
                    </button>
                  </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-home"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                    tabindex="0"
                  >
                    {/* TradingViewChart */}
                    <div
                      className="round-8 mt-4 mb-40 shadow-sm"
                      style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid white',
                      }}
                    >
                      <TradingViewChart symbol={symbolMap[marketTab]} />
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-profile"
                    role="tabpanel"
                    aria-labelledby="pills-profile-tab"
                    tabindex="0"
                  >
                    ...
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-contact"
                    role="tabpanel"
                    aria-labelledby="pills-contact-tab"
                    tabindex="0"
                  >
                    ...
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-disabled"
                    role="tabpanel"
                    aria-labelledby="pills-disabled-tab"
                    tabindex="0"
                  >
                    ...
                  </div>
                </div>
              </section>

              <section className="pt-40">
                <h2 className="fs-bold mb-24 font-zh-tw h1">精選產業</h2>
                <ul className="nav nav-pills mb-24" id="pills-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active round-pill h5 fw-bold"
                      id="pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"
                    >
                      半導體
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link round-pill h5 fw-bold"
                      id="pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#"
                      type="button"
                      role="tab"
                      aria-controls="pills-profile"
                      aria-selected="false"
                    >
                      電子零組件
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link round-pill h5 fw-bold"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      通信網路
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link round-pill h5 fw-bold"
                      id="pills-contact-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#"
                      type="button"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="false"
                    >
                      資訊服務業
                    </button>
                  </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-home"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                    tabindex="0"
                  ></div>
                  <div
                    className="tab-pane fade"
                    id="pills-profile"
                    role="tabpanel"
                    aria-labelledby="pills-profile-tab"
                    tabindex="0"
                  >
                    ...
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-contact"
                    role="tabpanel"
                    aria-labelledby="pills-contact-tab"
                    tabindex="0"
                  >
                    ...
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-disabled"
                    role="tabpanel"
                    aria-labelledby="pills-disabled-tab"
                    tabindex="0"
                  >
                    ...
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover table-bordered round-8 border-gray-400 bg-white">
                    <thead>
                      <tr className="h6 fw-bold">
                        <th scope="col" style={{ width: '448px', minWidth: '448px' }}>
                          名稱
                        </th>
                        <th scope="col" style={{ width: '120px', minWidth: '120px' }}>
                          價格
                        </th>
                        <th scope="col" style={{ width: '120px', minWidth: '120px' }}>
                          開盤價
                        </th>
                        <th scope="col" style={{ width: '120px', minWidth: '120px' }}>
                          最低
                        </th>
                        <th scope="col" style={{ width: '120px', minWidth: '120px' }}>
                          最高
                        </th>
                        <th scope="col" style={{ width: '120px', minWidth: '120px' }}>
                          漲跌福(%)
                        </th>
                        <th scope="col" style={{ width: '120px', minWidth: '120px' }}>
                          成交量
                        </th>
                        <th scope="col" style={{ width: '120px', minWidth: '120px' }}>
                          收藏
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="h6">
                        <th scope="row">台積電 2330</th>
                        <td className="text-danger">
                          1460.00{' '}
                          <span className="p-4">
                            <TrendingUp color="#f2735b" size={16} />
                          </span>{' '}
                        </td>
                        <td>1445.00</td>
                        <td>1443.50</td>
                        <td>1461.30</td>
                        <td className="text-danger">+1.04</td>
                        <td>15,432</td>
                        {/* 收藏按鈕 */}
                        <td>
                          <i
                            className={`bi ${liked ? 'bi-heart-fill text-danger' : 'bi-heart'}`}
                            onClick={() => setLiked(!liked)}
                            style={{ cursor: 'pointer' }}
                          ></i>
                        </td>
                      </tr>
                      <tr className="h6">
                        <td>光罩 2338 </td>
                        <td className="text-warning">
                          34.25{' '}
                          <span className="p-4">
                            <TrendingDown color="#56b77e" size={16} />
                          </span>{' '}
                        </td>
                        <td>35.60</td>
                        <td>32.25</td>
                        <td>35.35</td>
                        <td>+0.00%</td>
                        <td>3,458</td>
                        {/* 收藏按鈕 */}
                        <td>
                          <i
                            className={`bi ${liked ? 'bi-heart-fill text-danger' : 'bi-heart'}`}
                            onClick={() => setLiked(!liked)}
                            style={{ cursor: 'pointer' }}
                          ></i>
                        </td>
                      </tr>
                      <tr className="h6">
                        <th scope="row">茂矽 2342</th>
                        <td className="text-danger">
                          29.30{' '}
                          <span className="p-4">
                            <TrendingUp color="#f2735b" size={16} />
                          </span>{' '}
                        </td>
                        <td>29.00</td>
                        <td>28.90</td>
                        <td>29.50</td>
                        <td className="text-danger">+1.74%</td>
                        <td>37,136</td>
                        {/* 收藏按鈕 */}
                        <td>
                          <i
                            className={`bi ${liked ? 'bi-heart-fill text-danger' : 'bi-heart'}`}
                            onClick={() => setLiked(!liked)}
                            style={{ cursor: 'pointer' }}
                          ></i>
                        </td>
                      </tr>
                      <tr className="h6">
                        <th scope="row">南亞科 2408</th>
                        <td className="bg-danger text-white">
                          140.50{' '}
                          <span className="p-4">
                            <TrendingUp color="white" size={16} />
                          </span>{' '}
                        </td>
                        <td>122.00</td>
                        <td>122.00</td>
                        <td className="bg-danger text-white">140.50</td>
                        <td className="bg-danger text-white">+9.99%</td>
                        <td>287,387</td>
                        {/* 收藏按鈕 */}
                        <td>
                          <i
                            className={`bi ${liked ? 'bi-heart-fill text-danger' : 'bi-heart'}`}
                            onClick={() => setLiked(!liked)}
                            style={{ cursor: 'pointer' }}
                          ></i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : (
            <div>
              <h2 className="fs-bold mb-24 font-zh-tw h1">精選與行情</h2>
              這裡顯示精選行情...
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const navLinkStyle = (isActive) => ({
  color: isActive ? '#2fa58d' : 'rgba(18, 18, 18, 0.6)',
  border: 'none',
  position: 'relative',
  transition: 'color 0.3s ease',
  // 下方圓角粗線
  ...(isActive && {
    borderBottom: 'none',
  }),
  // 使用偽元素或直接在 active 時加一個裝飾線
  // 這裡為了演示方便，如果 isActive 就給他一個自定義屬性，或者建議寫在 CSS 檔
});
