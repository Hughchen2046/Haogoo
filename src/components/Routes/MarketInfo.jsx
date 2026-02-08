import React, { useEffect, useState } from 'react';
import TaiwanIndexChart from '../Tools/TaiwanIndexChart';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_stocksUrl;

export default function MarketInfo() {
  // 各個 dropdown 的開關狀態
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isETFOpen, setIsETFOpen] = useState(false);

  // 建立一個狀態來記錄愛心是否為實心
  const [liked, setLiked] = useState(false);
  // 記錄藥丸按鈕目前選哪一個
  const [marketTab, setMarketTab] = useState('加權指數');
  const [industryTab, setIndustryTab] = useState('水泥工業');
  const [collectionTab, setCollectionTab] = useState('即時排行');
  const [collectionETFTab, setCollectionETFTab] = useState('即時排行');

  //市場行情 的設定
  const taiwanVariousIndicators = [
    {
      label: '加權指數',
      indicator: 'TWSE:TAIEX',
      path: '#',
      slug: '',
    },
    {
      label: '櫃買指數',
      indicator: 'TWO:OTC',
      path: '#',
      slug: '櫃買指數',
    },
    {
      label: '台指期',
      indicator: 'TAIEX:FITX1!',
      path: '#',
      slug: '台指期',
    },
    {
      label: '各項指數',
      indicator: 'TWSE:IR0001',
      path: '#',
    },
  ];
  //精選產業 的設定
  const [industrySelect, setIndustrySelect] = useState([
    {
      label: '',
      indicator: '',
      path: '',
      slug: '',
    },
  ]);
  //精選選股 的設定
  const collectionStocks = [
    {
      label: '即時排行',
      indicator: 'TOP_GAINERS',
      path: '#',
      slug: '',
    },
    {
      label: '技術面',
      indicator: 'TOP_SKILLS',
      path: '#',
      slug: '技術面',
    },
    {
      label: '基本面',
      indicator: 'TOP_FUNDAMENTALS',
      path: '#',
      slug: '基本面',
    },
    {
      label: '籌碼面',
      indicator: 'TOP_CHIPS',
      path: '#',
      slug: '籌碼面',
    },
    {
      label: '好股推薦',
      indicator: 'TOP_RECOMMEND',
      path: '#',
      slug: '好股推薦',
    },
  ];
  //熱門ETF 的設定
  const collectionETF = [
    {
      label: '即時排行',
      indicator: 'TOP_ETF_GAINERS',
      path: '#',
      slug: '',
    },
    {
      label: '獲利王',
      indicator: 'TOP_ETF_PROFIT',
      path: '#',
      slug: '獲利王',
    },
    {
      label: '高殖利率',
      indicator: 'TOP_ETF_DIVIDEND',
      path: '#',
      slug: '高殖利率',
    },
    {
      label: '好股推薦',
      indicator: 'TOP_ETF_RECOMMEND',
      path: '#',
      slug: '好股推薦',
    },
  ];

  //取得精選產業的資料
  useEffect(() => {
    const getIndustry = async () => {
      try {
        const response = await axios.get(`${API_URL}`);
        // console.log(response.data.data);
        const data = response.data.data;
        const industry = data
          .filter((item) => item.prices.length > 3 && item.industryTW !== '綜合')
          .map((item) => {
            return {
              id: item.id,
              name: item.name,
              indicator: item.industry,
              industry: item.industryTW,
              prices: item.prices,
            };
          });
        // console.log(industry);

        // 使用 Map 來獲取不重複的產業，以 industryTW 為 key
        const uniqueIndustries = new Map();
        industry.forEach((item) => {
          if (!uniqueIndustries.has(item.industry)) {
            uniqueIndustries.set(item.industry, {
              label: item.industry,
              indicator: item.indicator,
              path: '#',
              slug: item.industry,
            });
          }
        });

        // 將 Map 轉換為陣列
        const uniqueIndustryArray = Array.from(uniqueIndustries.values());

        // 更新 state
        setIndustrySelect(uniqueIndustryArray);

        // console.log('不重複的產業:', uniqueIndustryArray);
        // console.log('產業數量:', uniqueIndustryArray.length);
      } catch (error) {
        console.error(error);
      }
    };
    getIndustry();
  }, []);

  return (
    <div className="d-flex flex-column gap-32">
      {/* 市場行情 */}
      <section className="py-24 py-lg-40">
        <h2 className="fs-bold mb-24 font-zh-tw h1-lg">市場行情</h2>
        {/* 小螢幕用dropdown */}
        <div className={`dropdown mb-32 font-zh-tw d-md-none ${isMarketOpen ? 'show' : ''}`}>
          <button
            className="btn border-0 w-100 bg-gray-400 d-flex justify-content-between align-items-center py-16 px-24"
            type="button"
            onClick={() => setIsMarketOpen(!isMarketOpen)}
            aria-expanded={isMarketOpen}
          >
            <span className="ps-16">{marketTab}</span>
            <ChevronDown />
          </button>
          <ul
            className={`mt-8 dropdown-menu w-100 py-16 px-24 border-0 ${isMarketOpen ? 'show' : ''}`}
            style={{
              backgroundColor: '#F3F3F3',
              display: isMarketOpen ? 'block' : 'none',
            }}
          >
            <li className="d-flex justify-content-between align-items-start">
              <span className="dropdown-item-text pt-0 pb-8">請選擇分類</span>
              <ChevronUp />
            </li>
            {taiwanVariousIndicators.map((topic) => (
              <li key={topic.indicator} className="dropdown-li-hover dropdown-btn-active">
                <button
                  className={`dropdown-item font-weight-light py-8 mb-8 border-0 bg-transparent text-start w-100 ${
                    marketTab === topic.label ? 'active' : ''
                  }`}
                  onClick={() => {
                    setMarketTab(topic.label);
                    setIsMarketOpen(false);
                  }}
                >
                  {topic.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* 大螢幕用nav-pill */}
        <ul className="nav nav-pills mb-24 d-none d-md-flex gap-16" id="pills-tab" role="tablist">
          {taiwanVariousIndicators.map((topic) => (
            <li key={topic.indicator} className="nav-item" role="presentation">
              <button
                className={`nav-link round-pill py-10 px-24 h5 fw-bold border border-primary ${marketTab === topic.label ? 'active' : ''}`}
                type="button"
                onClick={() => setMarketTab(topic.label)}
              >
                {topic.label}
              </button>
            </li>
          ))}
        </ul>

        {/* TradingViewChart */}
        <div
          className="round-8 mt-4 mb-40 shadow-sm"
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid white',
          }}
        >
          <div>
            <TaiwanIndexChart />
          </div>
        </div>
      </section>
      {/* 精選產業 */}
      <section className="py-24 py-lg-40">
        <h2 className="fs-bold mb-24 font-zh-tw h1-lg">精選產業</h2>
        {/* 小螢幕用dropdown */}
        <div className={`dropdown mb-24 font-zh-tw d-md-none ${isIndustryOpen ? 'show' : ''}`}>
          <button
            className="btn border-0 w-100 bg-gray-400 d-flex justify-content-between align-items-center py-16 px-24"
            type="button"
            onClick={() => setIsIndustryOpen(!isIndustryOpen)}
            aria-expanded={isIndustryOpen}
          >
            <span className="ps-16">{industryTab}</span>
            <ChevronDown />
          </button>
          <ul
            className={`mt-8 dropdown-menu w-100 py-16 px-24 border-0 ${isIndustryOpen ? 'show' : ''}`}
            style={{
              backgroundColor: '#F3F3F3',
              display: isIndustryOpen ? 'block' : 'none',
            }}
          >
            <li className="d-flex justify-content-between align-items-start">
              <span className="dropdown-item-text pt-0 pb-8">請選擇分類</span>
              <ChevronUp />
            </li>
            {industrySelect.map((topic) => (
              <li key={topic.indicator} className="dropdown-li-hover dropdown-btn-active">
                <button
                  type="submit"
                  className={`dropdown-item font-weight-light py-8 mb-8 border-0 bg-transparent text-start w-100 ${
                    industryTab === topic.label ? 'active' : ''
                  }`}
                  onClick={() => {
                    setIndustryTab(topic.label);
                    setIsIndustryOpen(false);
                  }}
                >
                  {topic.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* 大螢幕用nav-pill */}
        <ul className="nav nav-pills mb-24 d-none d-md-flex gap-16" id="pills-tab" role="tablist">
          {industrySelect.map((topic) => (
            <li key={topic.indicator} className="nav-item" role="presentation">
              <button
                className={`nav-link round-pill py-10 px-24 h5 fw-bold border border-primary ${industryTab === topic.label ? 'active' : ''}`}
                type="button"
                onClick={() => setIndustryTab(topic.label)}
              >
                {topic.label}
              </button>
            </li>
          ))}
        </ul>

        {/* TradingViewChart */}
        <div className="text-center">
          <div
            className="round-8 shadow-sm mb-24 text-start"
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid white',
            }}
          >
            <div className="table-responsive">
              <table className="table table-hover table-bordered round-8 border-gray-400 bg-white">
                <thead>
                  <tr className="h6 fw-bold">
                    <th scope="col" style={{ width: '150px', minWidth: '150px' }}>
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
          </div>
          <button type="button" className=" btn btn-outline-primary">
            查看更多
          </button>
        </div>
      </section>
      {/* 精選選股 */}
      <section className="py-24 py-lg-40">
        <h2 className="fs-bold mb-24 font-zh-tw h1-lg">精選選股</h2>
        {/* 小螢幕用dropdown */}
        <div className={`dropdown mb-24 font-zh-tw d-md-none ${isCollectionOpen ? 'show' : ''}`}>
          <button
            className="btn border-0 w-100 bg-gray-400 d-flex justify-content-between align-items-center py-16 px-24"
            type="button"
            onClick={() => setIsCollectionOpen(!isCollectionOpen)}
            aria-expanded={isCollectionOpen}
          >
            <span className="ps-16">{collectionTab}</span>
            <ChevronDown />
          </button>
          <ul
            className={`mt-8 dropdown-menu w-100 py-16 px-24 border-0 ${isCollectionOpen ? 'show' : ''}`}
            style={{
              backgroundColor: '#F3F3F3',
              display: isCollectionOpen ? 'block' : 'none',
            }}
          >
            <li className="d-flex justify-content-between align-items-start">
              <span className="dropdown-item-text pt-0 pb-8">請選擇分類</span>
              <ChevronUp />
            </li>
            {collectionStocks.map((topic) => (
              <li key={topic.indicator} className="dropdown-li-hover dropdown-btn-active">
                <button
                  type="submit"
                  className={`dropdown-item font-weight-light py-8 mb-8 border-0 bg-transparent text-start w-100 ${
                    collectionTab === topic.label ? 'active' : ''
                  }`}
                  onClick={() => {
                    setCollectionTab(topic.label);
                    setIsCollectionOpen(false);
                  }}
                >
                  {topic.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* 大螢幕用nav-pill */}
        <ul className="nav nav-pills mb-24 d-none d-md-flex gap-16" id="pills-tab" role="tablist">
          {collectionStocks.map((topic) => (
            <li key={topic.indicator} className="nav-item" role="presentation">
              <button
                className={`nav-link round-pill py-10 px-24 h5 fw-bold border border-primary ${collectionTab === topic.label ? 'active' : ''}`}
                type="button"
                onClick={() => setCollectionTab(topic.label)}
              >
                {topic.label}
              </button>
            </li>
          ))}
        </ul>

        {/* TradingViewChart */}
        <div className="text-center">
          <div
            className="round-8 shadow-sm mb-24 text-start"
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid white',
            }}
          >
            <div className="table-responsive">
              <table className="table table-hover table-bordered round-8 border-gray-400 bg-white">
                <thead>
                  <tr className="h6 fw-bold">
                    <th scope="col" style={{ width: '150px', minWidth: '150px' }}>
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
          </div>
          <button type="button" className=" btn btn-outline-primary">
            查看更多
          </button>
        </div>
      </section>
      {/* 熱門 ETF */}
      <section className="py-24 py-lg-40">
        <h2 className="fs-bold mb-24 font-zh-tw h1-lg">熱門 ETF</h2>
        {/* 小螢幕用dropdown */}
        <div className={`dropdown mb-24 font-zh-tw d-md-none ${isETFOpen ? 'show' : ''}`}>
          <button
            className="btn border-0 w-100 bg-gray-400 d-flex justify-content-between align-items-center py-16 px-24"
            type="button"
            onClick={() => setIsETFOpen(!isETFOpen)}
            aria-expanded={isETFOpen}
          >
            <span className="ps-16">{collectionETFTab}</span>
            <ChevronDown />
          </button>
          <ul
            className={`mt-8 dropdown-menu w-100 py-16 px-24 border-0 ${isETFOpen ? 'show' : ''}`}
            style={{
              backgroundColor: '#F3F3F3',
              display: isETFOpen ? 'block' : 'none',
            }}
          >
            <li className="d-flex justify-content-between align-items-start">
              <span className="dropdown-item-text pt-0 pb-8">請選擇分類</span>
              <ChevronUp />
            </li>
            {collectionETF.map((topic) => (
              <li key={topic.indicator} className="dropdown-li-hover dropdown-btn-active">
                <button
                  type="submit"
                  className={`dropdown-item font-weight-light py-8 mb-8 border-0 bg-transparent text-start w-100 ${
                    collectionETFTab === topic.label ? 'active' : ''
                  }`}
                  onClick={() => {
                    setCollectionETFTab(topic.label);
                    setIsETFOpen(false);
                  }}
                >
                  {topic.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* 大螢幕用nav-pill */}
        <ul className="nav nav-pills mb-24 d-none d-md-flex gap-16" id="pills-tab" role="tablist">
          {collectionETF.map((topic) => (
            <li key={topic.indicator} className="nav-item" role="presentation">
              <button
                className={`nav-link round-pill py-10 px-24 h5 fw-bold border border-primary ${collectionETFTab === topic.label ? 'active' : ''}`}
                type="button"
                onClick={() => setCollectionETFTab(topic.label)}
              >
                {topic.label}
              </button>
            </li>
          ))}
        </ul>

        {/* TradingViewChart */}
        <div className="text-center">
          <div
            className="round-8 shadow-sm mb-24 text-start"
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid white',
            }}
          >
            <div className="table-responsive">
              <table className="table table-hover table-bordered round-8 border-gray-400 bg-white">
                <thead>
                  <tr className="h6 fw-bold">
                    <th scope="col" style={{ width: '150px', minWidth: '150px' }}>
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
          </div>
          <button type="button" className=" btn btn-outline-primary">
            查看更多
          </button>
        </div>
      </section>
    </div>
  );
}
