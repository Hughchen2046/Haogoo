import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TaiwanIndexChart from '../Tools/TaiwanIndexChart';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import axios from 'axios';
import AllIndexChart from '../Tools/AllIndexChart';
import StockTable from '../Tools/StockTable';
import { BeatLoader } from 'react-spinners';
import ButtonTC from '../Tools/ButtonTC';
import dayjs from 'dayjs';

import { useDispatch, useSelector } from 'react-redux';
import { loadingStarted, loadingStopped } from '../../app/features/loading/loadingSlice';
import { authUser } from '../../app/features/auth/authSlice';
import { useWishlist } from '../../contexts/WishlistContext';
import WishlistHeart from '../Tools/WishlistHeart';

const API_URL = import.meta.env.VITE_stocksUrl;
const symbol_URL = import.meta.env.VITE_symbolsUrl;
const API_BASE = import.meta.env.VITE_API_BASE;

export default function MarketInfo() {
  const location = useLocation();
  const [primaryColor, setPrimaryColor] = useState('#0d6efd');
  const dispatch = useDispatch();
  const industryLoading = useSelector(
    (state) => (state.loading.loadingState['marketInfo.industry'] || 0) > 0
  );
  const collectionLoading = useSelector(
    (state) => (state.loading.loadingState['marketInfo.collection'] || 0) > 0
  );
  const collectionETFLoading = useSelector(
    (state) => (state.loading.loadingState['marketInfo.collectionETF'] || 0) > 0
  );

  // 各個 dropdown 的開關狀態
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isETFOpen, setIsETFOpen] = useState(false);

  // 處理 hash 滾動
  useEffect(() => {
    if (location.hash) {
      // 延遲執行,確保 DOM 已渲染
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [location]);

  // 市場分析相關
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
  const [collectionsETFData, setCollectionsETFData] = useState([]);
  const [collectionETFError, setCollectionETFError] = useState(null);

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
      dispatch(loadingStarted({ status: 'marketInfo.industry' }));
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
      } finally {
        dispatch(loadingStopped({ status: 'marketInfo.industry' }));
      }
    };
    getIndustry();
  }, []);

  //取得精選產業的股票資料給Stocktable
  useEffect(() => {
    const getIndustryStocks = async () => {
      setIndustryError(null);
      dispatch(loadingStarted({ status: 'marketInfo.industry' }));

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
        dispatch(loadingStopped({ status: 'marketInfo.industry' }));
      }
    };

    getIndustryStocks();
  }, [industryTab]);

  //取得精選選股的股票資料給Stocktable
  useEffect(() => {
    const getCollectionStocks = async () => {
      setCollectionError(null);
      dispatch(loadingStarted({ status: 'marketInfo.collection' }));
      try {
        const response = await axios.get(`${symbol_URL}?securityType=01&_embed=prices`); //及時排行,技術面,好股推薦
        const resStock = await axios.get(`${API_BASE}/monthRevenue`); //基本面

        // 取出有 prices 的資料
        const filterData = response.data.data.filter((item) => item.prices.length >= 2);
        // console.log('filterData', filterData);
        // console.log('collectionTab', collectionTab);
        // console.log('test', filterData[0].prices[filterData[0].prices.length - 1].dailyChangePct);

        //月營收資料
        // console.log('resStock', resStock.data.data);
        const monthRevenueData = resStock.data.data
          .map((item) => ({
            id: item.id,
            data: item.data,
          }))
          .filter((item) => item.data.length > 0);
        // console.log('monthRevenueData', monthRevenueData);

        let sortData;
        switch (collectionTab) {
          // 即時排行計算:依據帳跌幅百分比
          case '即時排行':
            sortData = [...filterData].sort((a, b) => {
              return (
                b.prices[b.prices.length - 1].dailyChangePct -
                a.prices[a.prices.length - 1].dailyChangePct
              );
            });
            // console.log('sortData', sortData);
            break;
          // 依據日線 ma5 > 周線 ma10 > 月線 ma20 的條件來做搜尋; 並且依據 ma5 - ma10的差距來做強弱判定
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
                  crossStrength: (ma5 - ma20) / ma20, // 交叉強度用來排序強弱
                };

                return isGoldenCross;
              })
              .sort((a, b) => {
                // 按交叉強度排序 (差距越大,排越前面)
                return b.technicalData.crossStrength - a.technicalData.crossStrength;
              });
            break;
          // 依據 MoM 連續3個月成長, YoY年度成長, 股價在全年度平均以上, 以跟全年度的平均相差百分比作為排序強弱
          case '基本面':
            sortData = filterData
              .map((stock) => {
                // 找到對應的月營收資料
                const revenueData = monthRevenueData.find((item) => item.id === stock.id);

                if (!revenueData || revenueData.data.length < 25) {
                  return null;
                }

                const revenues = revenueData.data;
                const latestRevenue = revenues[revenues.length - 1];
                const prevRevenue1 = revenues[revenues.length - 2];
                const prevRevenue2 = revenues[revenues.length - 3];

                // 找去年同月的營收 (假設資料是月度,12 個月前)
                const yoyRevenue = revenues[revenues.length - 13];

                // 1. 檢查 MoM 連續 3 個月成長
                const momGrowth =
                  latestRevenue.revenue > prevRevenue1.revenue &&
                  prevRevenue1.revenue > prevRevenue2.revenue;

                // 2. 檢查 YoY 年度成長 (兩個條件都要滿足)
                // 條件 1: 最新月營收 > 去年同月營收
                const yoyMonthGrowth = yoyRevenue && latestRevenue.revenue > yoyRevenue.revenue;

                // 條件 2: 近 12 個月營收平均 > 去年同期 12 個月營收平均
                // 近 12 個月: revenues[length-12] ~ revenues[length-1]
                // 去年同期 12 個月: revenues[length-24] ~ revenues[length-13]
                let yoyYearAvgGrowth = false;
                if (revenues.length >= 25) {
                  const recent12Months = revenues.slice(-12);
                  const lastYear12Months = revenues.slice(-25, -13);

                  const recent12Avg =
                    recent12Months.reduce((sum, cur) => sum + cur.revenue, 0) /
                    recent12Months.length;
                  const lastYear12Avg =
                    lastYear12Months.reduce((sum, cur) => sum + cur.revenue, 0) /
                    lastYear12Months.length;

                  yoyYearAvgGrowth = recent12Avg > lastYear12Avg;
                }

                const yoyGrowth = yoyMonthGrowth && yoyYearAvgGrowth;

                // 3. 計算股價全年度平均
                const prices = stock.prices;
                const yearPrices = prices.slice(-121); // 約一年的交易日
                const avgPrice =
                  yearPrices.reduce((sum, p) => sum + p.close, 0) / yearPrices.length;
                const currentPrice = prices[prices.length - 1].close;

                // 4. 檢查股價在全年度平均以上
                const priceAboveAvg = currentPrice > avgPrice;

                // 5. 計算股價與平均的差異百分比
                const priceDiffPct = ((currentPrice - avgPrice) / avgPrice) * 100;

                // 只保留符合所有條件的股票
                if (momGrowth && yoyGrowth && priceAboveAvg) {
                  return {
                    ...stock,
                    fundamentalData: {
                      momGrowth,
                      yoyGrowth,
                      avgPrice: avgPrice.toFixed(2),
                      currentPrice: currentPrice.toFixed(2),
                      priceDiffPct: priceDiffPct.toFixed(2),
                      latestRevenue: latestRevenue.revenue,
                      yoyRevenue: yoyRevenue?.revenue,
                    },
                  };
                }
                return null;
              })
              .filter((item) => item !== null)
              .sort((a, b) => {
                // 按股價與平均的差異百分比排序 (差距越大,排越前面)
                return b.fundamentalData.priceDiffPct - a.fundamentalData.priceDiffPct;
              });
            break;
          // 依據 成交量來進行判斷, 單日成交量超過半年內成交量, 且連續3日成交量皆成長
          case '籌碼面':
            sortData = [...filterData]
              .filter((stock) => {
                const prices = stock.prices;
                if (!prices || prices.length < 3) return false;

                //計算股票成交量
                //計算去年同一時間到今年的length差
                const thisyear = prices[prices.length - 1].date;
                const lastyear = dayjs(`${thisyear}`, 'YYYY-MM-DD')
                  .subtract(1, 'year')
                  .format('YYYY-MM-DD');
                // console.log('lastyear', lastyear);
                //得出與去年同一日期的長度
                const lengh =
                  prices[prices.length - 1].id - prices.find((item) => item.date === lastyear).id;
                const yearPrices = prices.slice(-Math.floor(Math.abs(lengh / 2))); // 約半年的交易日
                // console.log('yearPrices', yearPrices);
                const maxVolume = Math.max(...yearPrices.map((p) => p.volume));
                const latestVolume = prices[prices.length - 1].volume;
                const prevVolume = prices[prices.length - 2].volume;
                const prevVolume2 = prices[prices.length - 3].volume;
                return (
                  latestVolume === maxVolume &&
                  latestVolume > prevVolume &&
                  prevVolume > prevVolume2
                );
              })
              .map((stock) => {
                const prices = stock.prices;
                //計算去年同一時間到今年的length差
                const thisyear = prices[prices.length - 1].date;
                const lastyear = dayjs(`${thisyear}`, 'YYYY-MM-DD')
                  .subtract(1, 'year')
                  .format('YYYY-MM-DD');
                // console.log('lastyear', lastyear);
                //得出與去年同一日期的長度
                const lengh =
                  prices[prices.length - 1].id - prices.find((item) => item.date === lastyear).id;
                // console.log('length', lengh);
                const yearPrices = prices.slice(-Math.floor(Math.abs(lengh / 2))); // 約半年的交易日

                return {
                  ...stock,
                };
              });
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
        dispatch(loadingStopped({ status: 'marketInfo.collection' }));
      }
    };

    getCollectionStocks();
  }, [collectionTab]);

  //取得精選ETF的股票給Stocktable
  useEffect(() => {
    const getCollectionETFStocks = async () => {
      setCollectionETFError(null);
      dispatch(loadingStarted({ status: 'marketInfo.collectionETF' }));

      try {
        const response = await axios.get(`${symbol_URL}?SECURITY_TW=ETF&_embed=prices`); //及時排行,獲利王,好股推薦
        const resStock = await axios.get(`${API_BASE}/stockbenifit`); //高殖利率
        // console.log('allData', response.data.data);
        // 取出有 prices 的資料
        const filterData = response.data.data.filter((item) => item.prices.length >= 2);
        // console.log('filterData', filterData);

        let sortData;
        switch (collectionETFTab) {
          // 即時排行計算:依據帳跌幅百分比
          case '即時排行':
            sortData = [...filterData].sort((a, b) => {
              return (
                b.prices[b.prices.length - 1].dailyChangePct -
                a.prices[a.prices.length - 1].dailyChangePct
              );
            });
            // console.log('sortData', sortData);
            break;
          // 依據去年同一時間投入價格與現在價格的差距來做強弱判定
          case '獲利王':
            sortData = [...filterData]
              .map((item) => {
                const prices = item.prices;

                // 檢查資料是否足夠
                if (!prices || prices.length < 252) return null;

                // 計算去年同一時間
                const thisyear = prices[prices.length - 1].date;
                const lastyear = dayjs(thisyear, 'YYYY-MM-DD')
                  .subtract(1, 'year')
                  .format('YYYY-MM-DD');

                const lastyearData = prices.find((p) => p.date === lastyear);

                if (!lastyearData) return null;

                // 計算獲利率
                const currentPrice = prices[prices.length - 1].close;
                const lastyearPrice = lastyearData.close;
                const profitRate = ((currentPrice - lastyearPrice) / lastyearPrice) * 100;

                return {
                  ...item,
                  profitData: {
                    currentPrice,
                    lastyearPrice,
                    profitRate: profitRate.toFixed(2),
                  },
                };
              })
              .filter((item) => item !== null && item.profitData.profitRate > 0) // 過濾掉 null 和獲利率 <= 0
              .sort((a, b) => b.profitData.profitRate - a.profitData.profitRate); // 按獲利率排序
            break;
          // 依據 股票的現金股利/目前股價來看殖利率的排序
          case '高殖利率':
            const benifitData = resStock.data.data;
            sortData = [...filterData]
              .map((stock) => {
                // console.log('benifit', benifitData);
                const stockbenifitData = benifitData.find((item) => item.id === stock.id);
                if (!stockbenifitData) return null;
                const totalBenifit = stockbenifitData.data
                  .filter((item) => dayjs(item.date).get('year') === 2025)
                  .reduce((sum, cur) => sum + (cur.CashEarningsDistribution || 0), 0);
                if (totalBenifit === 0) return null;
                const currentPrice = stock.prices[stock.prices.length - 1].close;
                const yieldRate = (totalBenifit / currentPrice) * 100;
                return {
                  ...stock,
                  yieldData: {
                    totalDividend: totalBenifit.toFixed(2),
                    currentPrice: currentPrice.toFixed(2),
                    yieldRate: yieldRate.toFixed(2),
                  },
                };
              })
              .filter((item) => item !== null)
              .sort((a, b) => b.yieldData.yieldRate - a.yieldData.yieldRate);
            // console.log('sortData', sortData);
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
        // console.log('sortData', sortData);
        setCollectionsETFData(sortData);
      } catch (error) {
        console.error('抓取產業股票資料失敗:', error);
        setCollectionETFError(error.message);
        setCollectionsETFData([]); // 發生錯誤時清空資料
      } finally {
        dispatch(loadingStopped({ status: 'marketInfo.collectionETF' }));
      }
    };

    getCollectionETFStocks();
  }, [collectionETFTab]);

  // console.log('industrySelectTab', industryTab);
  return (
    <>
      <div className="d-flex flex-column gap-32 position-relative overflow-x-hidden">
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
                <ButtonTC
                  label={topic.label}
                  className={`nav-link round-pill py-10 px-24 h5 fw-bold border border-primary ${marketTab === topic.label ? 'active' : ''}`}
                  type="button"
                  id={`pills-${topic.indicator}-tab`}
                  data-bs-toggle="pill"
                  data-bs-target={`#pills-${topic.indicator}`}
                  role="tab"
                  aria-controls={`pills-${topic.indicator}`}
                  aria-selected={marketTab === topic.label}
                  onClick={() => setMarketTab(topic.label)}
                />
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
        <section className="py-24 py-lg-40" id="popular-industry">
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
              <li key={topic.indicator} className="nav-item " role="presentation">
                <ButtonTC
                  label={topic.label}
                  className={`nav-link round-pill py-10 px-24 h5 fw-bold border border-primary ${industryTab === topic.label ? 'active' : ''}`}
                  type="button"
                  onClick={() => setIndustryTab(topic.label)}
                />
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
                <ButtonTC
                  label={topic.label}
                  className={`nav-link round-pill py-10 px-24 h5 fw-bold border border-primary ${collectionTab === topic.label ? 'active' : ''}`}
                  type="button"
                  onClick={() => setCollectionTab(topic.label)}
                />
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
        <section className="py-24 py-lg-40" id="ETF">
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
                <ButtonTC
                  label={topic.label}
                  className={`nav-link round-pill py-10 px-24 h5 fw-bold border border-primary ${collectionETFTab === topic.label ? 'active' : ''}`}
                  type="button"
                  onClick={() => setCollectionETFTab(topic.label)}
                />
              </li>
            ))}
          </ul>

          {/* 股票列表 */}
          {collectionETFLoading ? (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: '340px' }}
            >
              <BeatLoader color={primaryColor} size={20} />
            </div>
          ) : collectionETFError ? (
            <div className="alert alert-danger" role="alert">
              載入失敗: {collectionETFError}
            </div>
          ) : (
            <StockTable
              data={collectionsETFData}
              category="collectionETF"
              filterKey={collectionETFTab}
              initialNumberCount={5}
            />
          )}
        </section>
        {industryLoading && (
          <div
            className="position-absolute d-flex align-items-center justify-content-center"
            style={{
              top: 0,
              left: '-16px',
              right: '-16px',
              height: '100%',
              backdropFilter: 'blur(4px)',
              // boxShadow: '12px 12px 12px rgba(218, 218, 226, 0.45)',
              backgroundColor: 'rgba(218, 218, 226, 0.1)',
              zIndex: 5000,
            }}
          >
            <BeatLoader color={primaryColor} size={20} />
          </div>
        )}
      </div>
    </>
  );
}
