import React from 'react';
import { motion } from 'framer-motion';
import '../scss/all.scss';
import '../scss/EtfsList.scss';

export default function EtfsList() {
  // 標籤分行堆疊
  const tagRows = [
    ["國泰永續高股息", "群益台灣精選高股息"],
    ["元大台灣50正2", "元大高股息", "復華富時不動產"],
    ["元大台灣50", "富邦特選高股息30"],
    ["中信高評級公司債", "統一FANG+", "富邦台50"],
    ["國泰台灣科技龍頭"],
  ];

  // 動畫設定：自然重力落下
  const tagVariants = {
    hidden: { y: -120, opacity: 1, rotate: 0 }, // 初始上方
    visible: (i) => ({
      y: 0,
      opacity: 1,
      rotate: (Math.random() - 0.5) * 40, // 微微旋轉
      transition: {
        y: { type: "spring", stiffness: 90, damping: 40 }, // 模擬重力落下
        rotate: { type: "spring", stiffness: 100, damping: 40 },
        delay: i * 0.02, // 每個標籤延遲
      },
    }),
  };

  return (
    <div className='etfsbox round-96 position-relative p-5'>
      {/* 左側內容 */}
      <div className="etfs-content text-center text-md-start">
        <section className="etfstitle fs-2 pt-6 px-4">熱門ETF</section>
        <span className='etfsEngtitle p-3'>Popular ETFs</span> 
        <div className="d-flex justify-content-center justify-content-md-start">
          <button className='etfsbtn bt-btn primarly-light round-8 fs-6 mt-3' a href="#">
            查看更多
          </button>
        </div>
      </div> 

      {/* 標籤區塊 */}
      <div className="etfsTagContainer mt-4 mt-md-0">
        {tagRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="d-flex justify-content-center justify-content-md-start gap-3 mb-3"
          >
            {row.map((tagText, i) => (
              <motion.a
                key={tagText}
                href ="#"
                custom={i + rowIndex * 10}
                initial="hidden"                     // 頁面刷新先堆疊
                whileInView="visible"                 // 滑到才掉落
                viewport={{ once: true, amount: 0.3 }} // 30%可見才觸發
                variants={tagVariants}
                className="etfsTag fs-5 round-pill p-3"
              >
                {tagText}
              </motion.a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
