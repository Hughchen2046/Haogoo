import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import ButtonOutline from './Tools/ButtonOutline';
import axios from 'axios';
import Mixed from './Tools/Mixed';
import { useNavigate } from 'react-router-dom';

export default function EtfsList() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });
  const ETF_URL = import.meta.env.VITE_ETF_symbolsUrl;
  const [etfData, setEtfData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getEtfs = async () => {
      try {
        const response = await axios.get(`${ETF_URL}`);
        const data = response.data.data;
        // 過濾有足夠價格資料的 ETF
        const sortSymbol = data.filter((item) => item.prices.length > 3);
        console.log('ETF 資料:', sortSymbol);
        setEtfData(sortSymbol);
      } catch (error) {
        console.error(error);
      }
    };
    getEtfs();
  }, []);

  // 處理標籤點擊,導航到股票頁面
  const handleTagClick = (stockId) => {
    console.log('stockId', stockId);
    navigate(`/stockInfo/${stockId}`);
  };

  return (
    <section className="bg-gray-400">
      <div className="container py-64 py-md-96">
        <div className="etfsbox bg-primary-700 font-zh-tw round-48 round-md-96 p-32 mb-24 py-md-72 px-md-96">
          <div className="row">
            <div
              className="col-12 col-md-6 text-center text-white text-md-start"
              ref={containerRef}
            >
              <h3 className=" h3 h2-md mb-8">熱門ETF</h3>
              <h2 className="display-2 display-1-md mb-32 mb-md-64">Popular ETFs</h2>
              <ButtonOutline
                className="w-initial mx-auto ms-md-0 py-12 px-40"
                onClick={() => navigate('/mystocklist#ETF')}
              >
                查看更多
              </ButtonOutline>
            </div>

            <div className="col-12 col-md-6 etfsTagWrapper position-relative overflow-hidden">
              <Mixed etfData={etfData} start={isInView} onClick={handleTagClick} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
