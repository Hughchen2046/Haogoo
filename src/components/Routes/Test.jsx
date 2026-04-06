// import { useEffect, useState } from 'react';
// import SearchStock from '../Tools/SearchStock';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

export default function Test() {
  // const StockUrl = import.meta.env.VITE_stocksUrl;
  // const [symbols, setSymbols] = useState([]);
  // const navigate = useNavigate();

  // const getDatas = async () => {
  //   try {
  //     const response = await axios.get(StockUrl);
  //     const rawData = Array.isArray(response?.data?.data) ? response.data.data : [];
  //     const filteredData = rawData.filter(
  //       (item) => Array.isArray(item?.prices) && item.prices.length > 0
  //     );
  //     const mapFilteredData = filteredData.map((item) => ({
  //       symbol: item.id,
  //       name: item.name,
  //     }));
  //     setSymbols(mapFilteredData);
  //     // //console.log('股票資料:', mapFilteredData);
  //   } catch (error) {
  //     console.error('獲取股票資料失敗:', error);
  //   }
  // };

  // useEffect(() => {
  //   getDatas();
  // }, []);

  return (
    <>
      <div className="bg-dark text-white py-96">
        <h2 className="mb-32">測試頁面</h2>
        {/* <SearchStock
          symbols={symbols}
          onSelect={(item) => {
            //console.log('你選到的股票:', item);
            navigate(`/stockInfo/${item.symbol}`);
          }}
        /> */}
      </div>
    </>
  );
}
