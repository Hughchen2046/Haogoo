import { useEffect, useState } from 'react';
import TaiwanIndexChart from '../Tools/TaiwanIndexChart';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import AllIndexChart from '../Tools/AllIndexChart';
import StockTable from '../Tools/StockTable';
import { BeatLoader } from 'react-spinners';

const API_URL = import.meta.env.VITE_stocksUrl;
const symbol_URL = import.meta.env.VITE_symbolsUrl;

export default function MarketInfo() {
  const [primaryColor, setPrimaryColor] = useState('#0d6efd');

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
      label: '食品類指數',
      indicator: 't02',
      path: '#',
      slug: '食品類指數',
    },
    {
      label: '電子類指數',
      indicator: 't13',
      path: '#',
      slug: '電子類指數',
    },
    {
      label: '金融保險類指數',
      indicator: 't17',
      path: '#',
      slug: '金融保險類指數',
    },
    {
      label: '生技醫療類指數',
      indicator: 't22',
      path: '#',
      slug: '生技醫療類指數',
    },
    {
      label: '半導體類指數',
      indicator: 't24',
      path: '#',
      slug: '半導體類指數',
    },
    {
      label: '資訊服務類指數',
      indicator: 't30',
      path: '#',
      slug: '資訊服務類指數',
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
  const [industryData, setIndustryData] = useState([]);
  const [industryLoading, setIndustryLoading] = useState(false);
  const [industryError, setIndustryError] = useState(null);
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
  const [collectionsData, setCollectionsData] = useState([]);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [collectionError, setCollectionError] = useState(null);
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

  //Loading的顏色設定
  useEffect(() => {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--bs-primary')
      .trim();
    if (color) setPrimaryColor(color);
  }, []);

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

  //取得精選產業的股票資料給Stocktable
  useEffect(() => {
    const getIndustryStocks = async () => {
      setIndustryLoading(true);
      setIndustryError(null);

      try {
        const response = await axios.get(`${symbol_URL}?industryTW=${industryTab}&_embed=prices`);

        // 取出有 prices 的資料
        const filterData = response.data.data.filter((item) => item.prices.length >= 2);
        // console.log('filterData', filterData);

        setIndustryData(filterData);
      } catch (error) {
        console.error('抓取產業股票資料失敗:', error);
        setIndustryError(error.message);
        setIndustryData([]); // 發生錯誤時清空資料
      } finally {
        setIndustryLoading(false);
      }
    };

    getIndustryStocks();
  }, [industryTab]);

  //取得精選選股的股票資料給Stocktable
  useEffect(() => {
    const getCollectionStocks = async () => {
      setCollectionLoading(true);
      setCollectionError(null);

      try {
        const response = await axios.get(`${symbol_URL}?securityType=01&_embed=prices`);

        // 取出有 prices 的資料
        const filterData = response.data.data.filter((item) => item.prices.length >= 2);
        console.log('filterData', filterData);
        // console.log('collectionTab', collectionTab);
        // console.log('test', filterData[0].prices[filterData[0].prices.length - 1].dailyChangePct);
        let sortData;
        switch (collectionTab) {
          // 即時排行計算
          case '即時排行':
            sortData = [...filterData].sort((a, b) => {
              return (
                b.prices[b.prices.length - 1].dailyChangePct -
                a.prices[a.prices.length - 1].dailyChangePct
              );
            });
            // console.log('sortData', sortData);
            break;
          case '技術面':
            sortData = [...filterData]
              .filter((item) => {
                const prices = item.prices;

                // 確保至少有20 天的資料來計算月線)
                if (prices.length < 20) return false;

                // 計算移動平均線 (MA)
                const calculateMA = (data, period) => {
                  if (data.length < period) return null;
                  const sum = data.slice(-period).reduce((acc, price) => acc + price.close, 0);
                  return sum / period;
                };

                // 計算各週期的移動平均線
                const ma5 = calculateMA(prices, 5); // 日線
                const ma10 = calculateMA(prices, 10); // 周線
                const ma20 = calculateMA(prices, 20); // 月線

                // 檢查所有均線
                if (ma5 === null || ma10 === null || ma20 === null) {
                  return false;
                }

                // 黃金交叉條件:日線 > 周線 > 月線
                const isGoldenCross = ma5 > ma10 && ma10 > ma20;

                // 檢查程式
                // if (isGoldenCross) {
                //   console.log(`${item.name} (${item.id}):`, {
                //     ma5: ma5.toFixed(2),
                //     ma10: ma10.toFixed(2),
                //     ma20: ma20.toFixed(2),
                //     isGoldenCross,
                //     crossStrength: ma5 - ma20,
                //   });
                // }

                // 計算前一天的均線
                const prevMA5 = calculateMA(prices.slice(0, -1), 5);
                const prevMA10 = calculateMA(prices.slice(0, -1), 10);

                // 是否剛發生日線突破周線
                const justCrossed = prevMA5 <= prevMA10 && ma5 > ma10;

                // 儲存到 item
                item.technicalData = {
                  ma5,
                  ma10,
                  ma20,
                  isGoldenCross,
                  justCrossed,
                  crossStrength: ma5 - ma20, // 交叉強度用來排序強弱
                };

                return isGoldenCross;
              })
              .sort((a, b) => {
                // 按交叉強度排序 (差距越大,排越前面)
                return b.technicalData.crossStrength - a.technicalData.crossStrength;
              });
            break;
          case '基本面':
            break;
          case '籌碼面':
            break;
          case '好股推薦':
            sortData = [...filterData]
              .filter((item) => {
                const prices = item.prices;
                if (prices.length < 60) return false; // 需要更多資料

                // 計算移動平均線
                const calculateMA = (period) => {
                  const sum = prices.slice(-period).reduce((acc, p) => acc + p.close, 0);
                  return sum / period;
                };

                const ma5 = calculateMA(5);
                const ma10 = calculateMA(10);
                const ma20 = calculateMA(20);
                const ma60 = calculateMA(60); // 季線

                // 多重黃金交叉條件
                const goldenCross = ma5 > ma10 && ma10 > ma20 && ma20 > ma60;

                // 成交量放大 (今日成交量 > 5日平均成交量)
                const avgVolume = prices.slice(-5).reduce((acc, p) => acc + p.volume, 0) / 5;
                const volumeIncrease = prices[prices.length - 1].volume > avgVolume * 1.2;

                // 價格在上升趨勢 (最新價 > 20日均線)
                const priceAboveMA20 = prices[prices.length - 1].close > ma20;

                // 儲存技術分數
                item.technicalScore =
                  (goldenCross ? 40 : 0) + (volumeIncrease ? 30 : 0) + (priceAboveMA20 ? 30 : 0);

                // 至少要符合黃金交叉
                return goldenCross;
              })
              .sort((a, b) => {
                // 按技術分數排序
                return b.technicalScore - a.technicalScore;
              });
            break;
        }
        setCollectionsData(sortData);
      } catch (error) {
        console.error('抓取產業股票資料失敗:', error);
        setCollectionError(error.message);
        setCollectionsData([]); // 發生錯誤時清空資料
      } finally {
        setCollectionLoading(false);
      }
    };

    getCollectionStocks();
  }, [collectionTab]);

  // console.log('industrySelectTab', industryTab);
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
                id={`pills-${topic.indicator}-tab`}
                data-bs-toggle="pill"
                data-bs-target={`#pills-${topic.indicator}`}
                role="tab"
                aria-controls={`pills-${topic.indicator}`}
                aria-selected={marketTab === topic.label}
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
            {marketTab === '加權指數' ? (
              <TaiwanIndexChart />
            ) : (
              <AllIndexChart
                indexId={
                  taiwanVariousIndicators.find((item) => item.label === marketTab)?.indicator
                }
              />
            )}
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
        {/* 股票列表 */}
        {industryLoading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: '340px' }}
          >
            <BeatLoader color={primaryColor} size={20} />
          </div>
        ) : industryError ? (
          <div className="alert alert-danger" role="alert">
            載入失敗: {industryError}
          </div>
        ) : (
          <StockTable
            data={industryData}
            category="industry"
            filterKey={industryTab}
            initialNumberCount={5}
          />
        )}
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

        {/* 股票列表 */}
        {collectionLoading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: '340px' }}
          >
            <BeatLoader color={primaryColor} size={20} />
          </div>
        ) : collectionError ? (
          <div className="alert alert-danger" role="alert">
            載入失敗: {collectionError}
          </div>
        ) : (
          <StockTable
            data={collectionsData}
            category="collection"
            filterKey={collectionTab}
            initialNumberCount={5}
          />
        )}
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
