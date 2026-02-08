import axios from 'axios';
import { useEffect, useState } from 'react';
import { createChart, LineSeries } from 'lightweight-charts';
import dayjs from 'dayjs';

const AllIndexChart = ({ indexId = 't24' }) => {
  const [indexData, setIndexData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartMode, setChartMode] = useState('realtime'); // 'realtime' 跟 'static'
  const indexList = [
    { id: 't02', name: '食品類指數' },
    { id: 't13', name: '電子類指數' },
    { id: 't17', name: '金融保險類指數' },
    { id: 't22', name: '生技醫療類指數' },
    { id: 't24', name: '半導體類指數' },
    { id: 't30', name: '資訊服務類指數' },
  ];

  useEffect(() => {
    const getIndexData = async () => {
      try {
        const now = dayjs();
        const response = await axios.get(
          `https://backend.taiwanindex.com.tw/api/indexes/${indexId}/records?start=2020-01-01&end=${now.format('YYYY-MM-DD')}`
        );
        // console.log(response.data);
        const indexData = [
          {
            last_date: response.data.last_date,
            data: response.data.data.datasets[0].data,
            label: response.data.data.datasets[0].label,
            value_type: response.data.data.datasets[0].value_type,
            date: response.data.data.labels,
          },
        ];
        // console.log('由原始資料轉錄', indexData[0]);
        setIndexData(indexData[0]);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getIndexData();
  }, [indexId]);
  console.log('indexData', indexData, typeof indexData);

  // tradingViewChart
  useEffect(() => {
    if (!indexData || !indexData.date || !indexData.data) return;

    // 處理資料：將日期陣列和數值陣列配對
    const formattedPoints = indexData.date
      .map((dateStr, index) => {
        // dateStr 格式為 'YYYY-MM-DD'
        const date = dayjs(dateStr);
        const value = parseFloat(indexData.data[index]);

        return {
          time: date.format('YYYY-MM-DD'), // lightweight-charts 接受 'YYYY-MM-DD' 格式
          value: value,
        };
      })
      .filter((p) => {
        // 條件：數值有效
        return !isNaN(p.value) && p.time;
      });

    console.log('有效資料數:', formattedPoints.length);
    console.log('圖表模式:', chartMode);

    if (formattedPoints.length === 0) return;

    const container = document.getElementById('taiwan-index-chart-container');
    if (!container) return;
    container.innerHTML = ''; // 清空舊圖表

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 400,
      layout: { background: { color: '#ffffff' }, textColor: '#333' },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false, // 日線圖不需要秒數

        // 底部刻度的格式化
        tickMarkFormatter: (time) => {
          // time 為 'YYYY-MM-DD' 字串
          return dayjs(time).format('YYYY-MM-DD');
        },
      },

      // 十字線 tooltip
      localization: {
        timeFormatter: (time) => {
          // time 為 'YYYY-MM-DD' 字串
          return dayjs(time).format('YYYY/MM/DD');
        },
      },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: '#2962FF',
      lineWidth: 2,
    });

    let intervalId = null;

    if (chartMode === 'realtime') {
      // 動態模式：逐日顯示
      let currentIndex = 0;
      lineSeries.setData([formattedPoints[0]]);
      currentIndex = 1;

      intervalId = setInterval(() => {
        if (currentIndex < formattedPoints.length) {
          lineSeries.update(formattedPoints[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 50); // 設定速度來展現動畫效果
    } else {
      // 靜態模式：顯示所有日線資料
      lineSeries.setData(formattedPoints);
      chart.timeScale().setVisibleRange({
        from: formattedPoints[0].time,
        to: formattedPoints.at(-1).time,
      });
    }

    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (intervalId) clearInterval(intervalId);
      chart.remove();
    };
  }, [indexData, chartMode]); // 加入 chartMode

  return (
    <div className="p-24">
      <h2 className="mb-16 d-flex justify-content-between">
        {indexList.find((item) => item.id === indexId)?.name}
        <span className="caption">
          {chartMode === 'realtime' ? indexData.last_date : indexData.last_date}
        </span>
      </h2>
      <div id="taiwan-index-chart-container" className="w-100 mb-24 mb-lg-48"></div>
      <div className="d-flex justify-content-center gap-24 gap-lg-96">
        <button
          type="button"
          className={`btn py-lg-16 px-lg-24 ${chartMode === 'realtime' ? 'btn-primary text-white' : 'btn-outline-primary'}`}
          onClick={() => setChartMode('realtime')}
        >
          動態顯示(每日)
        </button>
        <button
          type="button"
          className={`btn py-lg-16 px-lg-24 ${chartMode === 'static' ? 'btn-primary text-white' : 'btn-outline-primary'}`}
          onClick={() => setChartMode('static')}
        >
          整體線圖
        </button>
      </div>
    </div>
  );
};

export default AllIndexChart;
