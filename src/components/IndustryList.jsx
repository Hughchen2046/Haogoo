import '../scss/industryList.scss';
import Button from './Button';
import '../scss/all.scss';
import React, { useEffect, useState} from "react";
import {TrendingUp,ChevronLeft, ArrowDown, ArrowUp, ChevronRight } from 'lucide-react'
import axios from 'axios';


export default function IndustryList() {
  return (
    <>
  {/* 標題 */}
  <section className='industryTitle fs-2 mb-1'>精選產業</section>
  <span className="industryEngTitle mb-4 d-block">Featured Industries</span>

<div className="row g-3">


   {/* 卡片一 */}
  <div className="col-4">
    <div className="card round-24">
      <div className="cardContent">
        <div className="cardHeader p-4">
          <span className='industryName fs-2'>天線/射頻基頻</span>
          <span className='industryIcon'>
            <TrendingUp color="#ff0000" />
          </span>
        </div>
        <div className='industryContent'>
          <div className='closePrice'>12/05 收盤價</div>
          <div className='companyName fs-6'>穩懋</div>
          <div className='industryRate text-danger'>147.50(+2.43%)</div>
          <div className='companyName fs-6'>明泰</div>
          <div className='industryRate text-danger'>31.00(+1.47%)</div>
        </div>
        <div className="industrySummary">
          <div className='industryTag fs-6'>近60日報酬率</div>
          <div className='industryRate fs-2 text-danger'>+18.41%</div>
        </div>
        <div className="cardFooter">

        </div>
      </div>
    </div>
  </div>




<div className="cardDown">
  <div className='industryIconleft border round-8'><ChevronLeft /></div>
  <div className='industryIconright border round-8'><ChevronRight /></div>
</div>
</div>
    </> 
  )
}
