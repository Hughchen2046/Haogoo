import React, { useEffect, useRef } from 'react';

export default function EtfsList() {
  const etfsBoxRef = useRef(null);
  const tagContainerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tags = tagContainerRef.current.querySelectorAll('.etfsTag');

            tags.forEach((tag, index) => {
              const delay = index * 0.1;

              // 隨機下墜高度 10~30px (小幅墜落)
              const dropY = 50 + Math.random() * 50;
              tag.style.setProperty('--drop-y', `${dropY}px`);

              // 隨機傾斜角度 -15~15deg
              const angle = (Math.random() - 0.5) * 30;
              tag.style.setProperty('--tilt-angle', `${angle}deg`);

              // 微疊落
              const offsetY = Math.random() * 5;
              tag.style.setProperty('--offset-y', `${offsetY}px`);

              setTimeout(() => {
                tag.classList.add('fall-tilt-stack');
              }, delay * 1000);
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (etfsBoxRef.current) observer.observe(etfsBoxRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="etfsbox round-96 position-relative p-5" ref={etfsBoxRef}>
      {/* 左側內容 */}
      <div className="etfs-content">
        <section className="etfstitle fs-2 pt-6 px-4">熱門ETF</section>
        <span className="etfsEngtitle p-3">Popular ETFs</span>
        <button className="etfsbtn bt-btn primarly-light round-8 fs-6 mt-3">查看更多</button>
      </div>

      {/* 右側標籤區塊 */}
      <div
        className="etfsTagContainer"
        ref={tagContainerRef}
        style={{ position: 'absolute', top: '65px', right: '100px' }}
      >
        <div className="d-flex justify-content-center gap-3">
          <div className="etfsTag fs-5 round-pill p-3">國泰永續高股息</div>
          <div className="etfsTag fs-5 round-pill p-3">群益台灣精選高股息</div>
        </div>
        <div className="d-flex justify-content-center gap-3">
          <div className="etfsTag fs-5 round-pill p-3">元大台灣50正2</div>
          <div className="etfsTag fs-5 round-pill p-3">元大高股息</div>
          <div className="etfsTag fs-5 round-pill p-3">復華富時不動產</div>
        </div>
        <div className="d-flex justify-content-center gap-3">
          <div className="etfsTag fs-5 round-pill p-3">元大台灣50</div>
          <div className="etfsTag fs-5 round-pill p-3">富邦特選高股息30</div>
        </div>
        <div className="d-flex justify-content-center gap-3">
          <div className="etfsTag fs-5 round-pill p-3">中信高評級公司債</div>
          <div className="etfsTag fs-5 round-pill p-3">統一FANG+</div>
          <div className="etfsTag fs-5 round-pill p-3">富邦台50</div>
        </div>
        <div className="d-flex justify-content-center gap-2">
          <div className="etfsTag fs-5 round-pill p-3">國泰台灣科技龍頭</div>
        </div>
      </div>
    </div>
  );
}
