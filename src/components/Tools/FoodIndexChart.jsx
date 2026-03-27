import axios from 'axios';
import { useEffect } from 'react';
// import { createChart, LineSeries } from 'lightweight-charts';
import dayjs from 'dayjs';

const FoodIndexChart = () => {
  // const [foodIndexData, setFoodIndexData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [chartMode, setChartMode] = useState('realtime'); // 'realtime' 跟 'static'

  useEffect(() => {
    const testGetFromStock = async () => {
      try {
        const now = dayjs();
        const response = await axios.get(
          `https://backend.taiwanindex.com.tw/api/indexes/t02/records?start=2020-01-01&end=${now.format('YYYY-MM-DD')}`
        );
        console.log(response.data);
        // const taiex = [
        //   {
        //     title: response.data.title,
        //     date: response.data.date,
        //     tablehead: [response.data.fields[0], response.data.fields[1]],
        //     tabledata: response.data.data.map((item) => {
        //       return {
        //         time: item[0],
        //         value: item[1],
        //       };
        //     }),
        //   },
        // ];
        // setTaiwanIndexData(taiex);
        // console.log(taiex);
      } catch (error) {
        console.error(error);
      }
    };
    testGetFromStock();
  }, []);

  //   tradingViewChart
  //   useEffect(() => {
  //     if (taiwanIndexData.length === 0) return;

  //     const dataObj = taiwanIndexData[0];
  //     const baseDate = dayjs(dataObj.date, 'YYYYMMDD'); // 使用 dayjs 日期

  //     // 取得開盤時間（第一筆資料的時間）
  //     const openingTime = dataObj.tabledata[0].time; //  "09:00:00"
  //     const closingTime = dataObj.tabledata[dataObj.tabledata.length - 1].time; // 收盤時間

  //     // console.log('開盤時間:', openingTime);
  //     // console.log('收盤時間:', closingTime);

  //     // 處理資料
  //     const formattedPoints = dataObj.tabledata
  //       .map((item) => {
  //         // 使用 dayjs 結合日期與時間（不加時區偏移，使用本地時間）
  //         const pointTime = dayjs(`${baseDate.format('YYYY-MM-DD')} ${item.time}`);
  //         const value = parseFloat(item.value.replace(/,/g, ''));

  //         return {
  //           time: pointTime.unix(),
  //           value: value,
  //           rawTime: item.time,
  //         };
  //       })
  //       .filter((p) => {
  //         // 條件：時間有效 && 數值有效 && 時間在開盤到收盤之間
  //         return (
  //           !isNaN(p.time) && !isNaN(p.value) && p.rawTime >= openingTime && p.rawTime <= closingTime
  //         );
  //       });

  //     // console.log('有效資料數:', formattedPoints.length);
  //     // console.log('圖表模式:', chartMode);

  //     if (formattedPoints.length === 0) return;

  //     const container = document.getElementById('taiwan-index-chart-container');
  //     if (!container) return;
  //     container.innerHTML = ''; // 清空舊圖表

  //     const fmtTW = (unixSec, withSeconds = true) => {
  //       const opt = {
  //         timeZone: 'Asia/Taipei',
  //         hour: '2-digit',
  //         minute: '2-digit',
  //         hour12: false,
  //       };
  //       if (withSeconds) opt.second = '2-digit';

  //       return new Intl.DateTimeFormat('zh-TW', opt).format(new Date(unixSec * 1000));
  //     };

  //     const chart = createChart(container, {
  //       width: container.clientWidth,
  //       height: 400,
  //       layout: { background: { color: '#ffffff' }, textColor: '#333' },
  //       grid: {
  //         vertLines: { color: '#f0f0f0' },
  //         horzLines: { color: '#f0f0f0' },
  //       },
  //       timeScale: {
  //         timeVisible: true,
  //         secondsVisible: chartMode === 'realtime', // 動態模式顯示秒數

  //         // 底部刻度的格式化
  //         tickMarkFormatter: (time) => {
  //           // time 物件
  //           const unixSec =
  //             typeof time === 'number'
  //               ? time
  //               : Math.floor(new Date(time.year, time.month - 1, time.day).getTime() / 1000);

  //           return fmtTW(unixSec, chartMode === 'realtime');
  //         },
  //       },

  //       // 十字線 tooltip
  //       localization: {
  //         timeFormatter: (time) => fmtTW(time, chartMode === 'realtime'),
  //       },
  //     });

  //     const lineSeries = chart.addSeries(LineSeries, {
  //       color: '#2962FF',
  //       lineWidth: 2,
  //     });

  //     let intervalId = null;

  //     if (chartMode === 'realtime') {
  //       let currentIndex = 0;
  //       lineSeries.setData([formattedPoints[0]]);
  //       currentIndex = 1;

  //       intervalId = setInterval(() => {
  //         if (currentIndex < formattedPoints.length) {
  //           lineSeries.update(formattedPoints[currentIndex]);
  //           currentIndex++;
  //         } else {
  //           clearInterval(intervalId);
  //         }
  //       }, 100); // 設定速度來展現動畫效果
  //     } else {
  //       // 靜態模式：每1分鐘取一筆資料
  //       const oneMinuteData = formattedPoints.filter((point) => {
  //         // 只保留秒數為 :00 的資料點（即每分鐘的整點）
  //         return point.rawTime.endsWith(':00');
  //       });

  //       //   console.log('靜態模式資料點數（每1分鐘）:', oneMinuteData.length);

  //       lineSeries.setData(oneMinuteData);
  //       chart.timeScale().setVisibleRange({
  //         from: oneMinuteData[0].time,
  //         to: oneMinuteData.at(-1).time,
  //       });
  //     }

  //     const handleResize = () => {
  //       chart.applyOptions({ width: container.clientWidth });
  //     };

  //     window.addEventListener('resize', handleResize);

  //     return () => {
  //       window.removeEventListener('resize', handleResize);
  //       if (intervalId) clearInterval(intervalId);
  //       chart.remove();
  //     };
  //   }, [taiwanIndexData, chartMode]); // 加入 chartMode

  //   return (
  //     <div className="p-24">
  //       <h2 className="mb-16 d-flex justify-content-between">
  //         {taiwanIndexData[0].tablehead[1]}{' '}
  //         <span className="caption">
  //           {chartMode === 'realtime'
  //             ? taiwanIndexData[0].title
  //             : `${dayjs(taiwanIndexData[0].date).format('YYYY/MM/DD')}`}
  //         </span>
  //       </h2>
  //       <div id="taiwan-index-chart-container" className="w-100 mb-24 mb-lg-48"></div>
  //       <div className="d-flex justify-content-center gap-24 gap-lg-96">
  //         <button
  //           type="button"
  //           className={`btn py-lg-16 px-lg-24 ${chartMode === 'realtime' ? 'btn-primary text-white' : 'btn-outline-primary'}`}
  //           onClick={() => setChartMode('realtime')}
  //         >
  //           動態顯示:每5秒
  //         </button>
  //         <button
  //           type="button"
  //           className={`btn py-lg-16 px-lg-24 ${chartMode === 'static' ? 'btn-primary text-white' : 'btn-outline-primary'}`}
  //           onClick={() => setChartMode('static')}
  //         >
  //           整體線圖
  //         </button>
  //       </div>
  //     </div>
  //   );
};

export default FoodIndexChart;
