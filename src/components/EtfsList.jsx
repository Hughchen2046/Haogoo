import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ButtonOutline from './ButtonOutline';
import Mixed from './Mixed';

export default function EtfsList() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });

  const tagRows = [
    ['國泰永續高股息', '群益台灣精選高股息'],
    ['元大台灣50正2', '元大高股息', '復華富時不動產'],
    ['元大台灣50', '富邦特選高股息30'],
    ['中信高評級公司債', '統一FANG+', '富邦台50'],
    ['國泰台灣科技龍頭'],
  ];

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
              <ButtonOutline className="w-initial mx-auto ms-md-0 py-12 px-40">
                查看更多
              </ButtonOutline>
            </div>

            <div className="col-12 col-md-6 etfsTagWrapper position-relative overflow-hidden">
              <Mixed tags={tagRows.flat()} start={isInView} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
