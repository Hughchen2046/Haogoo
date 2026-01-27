import Guideline from '../Tools/Guideline';
import StockInfo from '../../pages/StockInfo';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Test() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const api = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3000/symbols?SECURITY_TW=一般股票&_embed=prices'
        );
        console.log(res.data);
        setData(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    api();
  }, []);
  const filterData = data.filter((item) => item.prices.length > 0);
  console.log(
    '資料',
    filterData.map((e) => e.id)
  );

  return (
    <>
      <div className="bg-dark text-white py-96">
        <h2 className="mb-32">測試頁面</h2>
      </div>
      <StockInfo />
      <Guideline />
    </>
  );
}
