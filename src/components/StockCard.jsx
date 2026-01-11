
import '../scss/stockCard.scss';
import Button from './Button';
import '../scss/all.scss';
import React, { useEffect, useState} from "react";
import {ChevronLeft, ArrowDown, ArrowUp, ChevronRight } from 'lucide-react'
import axios from 'axios';


export default function StockCard({ articleName }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

   // 設定網頁標題
  useEffect(() => {
    document.title = articleName || "Haogoo 好股";
  }, [articleName]);

   // 從 db.json 讀取資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/db.json'); // db.json 放在 public 資料夾
        setStocks(res.data); // db.json 是一個陣列
        console.log(res.data.prices[0].symbolId);
      } catch (error) {
        console.error('讀取資料失敗', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>資料載入中...</div>;
  }


  
  return (
    <><section className="stockBox  ">
  <span className="stockTitle fs-2 ">熱門個股</span>  
  <p className="stockEngtitle">Popular Stocks</p>
     </section>
     
   


<div className="row g-4">
  {/* 第一張卡片 */}
  <div className="col-6">
    <div className="stockCard round-24">
      <div className="stockLeft d-flex align-items-center">
        <div className="stockIcon"><ArrowUp color="#ff0000" /></div>
        <div className="stockName fs-3">福茂科</div>
        <div className="stockSymbol round-4 fs-6 p-1">8131 上市</div>
      </div>
      <div className="stockRight pe-5">
        <div className="stockPrice fs-1">45.25</div>
        <div className="stockChange">+0.75 (+1.69%)</div>
      </div>
    </div>
  </div>
</div>


<div className="d-flex justify-content-start align-items-start gap-2 mt-4">
  <div className='align-items-center mt-2'><ChevronLeft color="#d1d1d1 " /></div>
  <div className="stockPage1 round-8 d-flex justify-content-center align-items-center">1</div>
  <div className="stockPage round-8 d-flex justify-content-center align-items-center">2</div>
  <div className="stockPage round-8 d-flex justify-content-center align-items-center">3</div>
  <div className="stockPage round-8 d-flex justify-content-center align-items-center">4</div>
  <div className="stockPage round-8 d-flex justify-content-center align-items-center">5</div>
  <div className='align-items-center mt-2'><ChevronRight color="#4d4a4aff " /></div>

</div>

    </>
  );
}
