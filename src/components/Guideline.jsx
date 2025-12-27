import React from 'react';

const Guideline = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-5 border-bottom pb-3">Design Guideline</h1>

      {/* Colors */}
      <section className="mb-12">
        <h2 className="mb-4">顏色 (Color)</h2>
        <div className="mb-3 fw-bold text-gray-700">使用 primary, success, danger, info, warning...</div>
        <div className="d-flex flex-wrap gap-3 mb-5">
          {[
            { name: 'Primary', bg: 'bg-primary' },
            { name: 'Success', bg: 'bg-success' },
            { name: 'Danger', bg: 'bg-danger' },
            { name: 'Info', bg: 'bg-info' },
            { name: 'Warning', bg: 'bg-warning', text: 'text-dark' },
            { name: 'Dark', bg: 'bg-dark' },
            { name: 'Light', bg: 'bg-light', text: 'text-dark', border: 'border' },
          ].map((c) => (
            <div
              key={c.name}
              className={`p-4 ${c.bg} ${c.text || 'text-white'} ${c.border || ''} rounded shadow-sm d-flex align-items-center justify-content-center`}
              style={{ minWidth: '120px' }}
            >
              {c.name}
            </div>
          ))}
        </div>

        <div className="mb-3 fw-bold text-gray-700">新增使用 primary-數值, gray 數值</div>
        <div className="row g-4">
          <div className="col-md-6">
            <h5 className="mb-3">Primary Extended</h5>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((v) => (
              <div key={`p-${v}`} className="d-flex align-items-center justify-content-between mb-2 p-2 border-bottom">
                <span className="text-sm font-monospace">primary-{v}</span>
                <span className={`text-primary-${v} fw-bold`}>Text</span>
                <span className={`bg-primary-${v} px-3 py-1 rounded text-xs`}>Background</span>
                <div className={`border-3 border-solid border-primary-${v} p-1 rounded text-xs`}>Border</div>
              </div>
            ))}
          </div>
          <div className="col-md-6">
            <h5 className="mb-3">Gray Extended</h5>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((v) => (
              <div key={`g-${v}`} className="d-flex align-items-center justify-content-between mb-2 p-2 border-bottom">
                <span className="text-sm font-monospace">gray-{v}</span>
                <span className={`text-gray-${v} fw-bold`}>Text</span>
                <span className={`bg-gray-${v} px-3 py-1 rounded text-xs ${v > 500 ? 'text-white' : ''}`}>Background</span>
                <div className={`border-3 border-solid border-gray-${v} p-1 rounded text-xs`}>Border</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="my-10" />

      {/* Typography */}
      <section className="mb-12">
        <h2 className="mb-4">字體 (Typography)</h2>
        <div className="card shadow-sm p-4 mb-4">
          <p className="fs-5 mb-3">這是 <strong>Sans-serif 預設字體</strong>（$font-family-sans-serif）。</p>
          <p className="font-handwriting fs-4 mb-3 text-primary-700">這是「辰宇落雁體」手寫字體（.font-handwriting）。</p>
          <p className="font-handwriting hd-title mb-4">header-title RWD（.hd-title）。</p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <h5 className="text-gray-500 mb-3 text-uppercase">Headings</h5>
            <h1>Heading 1 <small className="text-muted">(60px)</small></h1>
            <h2>Heading 2 <small className="text-muted">(40px)</small></h2>
            <h3>Heading 3 <small className="text-muted">(36px)</small></h3>
            <h4>Heading 4 <small className="text-muted">(32px)</small></h4>
            <h5>Heading 5 <small className="text-muted">(28px)</small></h5>
            <h6>Heading 6 <small className="text-muted">(24px)</small></h6>
          </div>
          <div className="col-md-6">
            <h5 className="text-gray-500 mb-3 text-uppercase">Body Text Sizes</h5>
            <p className="text-xl">文字 XL (20px) - The quick brown fox jumps over the lazy dog.</p>
            <p className="text-md">文字 MD (16px) - The quick brown fox jumps over the lazy dog.</p>
            <p className="text-sm">文字 SM (14px) - The quick brown fox jumps over the lazy dog.</p>
          </div>
        </div>
      </section>

      <hr className="my-10" />

      {/* Spacing */}
      <section className="mb-12">
        <h2 className="mb-4">間距 (Spacing)</h2>
        <div className="row g-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((s) => (
            <div key={`s-${s}`} className="col-auto">
              <div className="bg-light border p-2 text-center rounded" style={{ minWidth: '80px' }}>
                <div className="fw-bold fs-5">"{s}"</div>
                <div className="text-muted text-xs">{[4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 80, 100, 120][s - 1]}px</div>
              </div>
            </div>
          ))}
        </div>
        <div className="alert alert-info d-flex align-items-center">
          <div className="my-4 border-2 border-solid border-gray-700 p-7 bg-white rounded shadow-sm">
            測試 Box (Margin/Padding Test)
          </div>
          <span className="ms-4 text-muted small">可以開啟網頁檢查功能，利用元素樣式調整測試間距。</span>
        </div>
      </section>

      <hr className="my-10" />

      {/* Radius */}
      <section className="mb-5">
        <h2 className="mb-4">圓角 (Radius)</h2>
        <div className="d-flex flex-wrap gap-4">
          {[
            { name: 'round-s', val: '4px', bg: 'bg-primary' },
            { name: 'round-m', val: '8px', bg: 'bg-success' },
            { name: 'round-l', val: '12px', bg: 'bg-danger' },
            { name: 'round-xl', val: '16px', bg: 'bg-info' },
            { name: 'round-full', val: '800px', bg: 'bg-warning', text: 'text-dark' },
          ].map((r) => (
            <div key={r.name} className="d-flex flex-column align-items-center">
              <div className={`${r.bg} ${r.text || 'text-white'} p-4 ${r.name} shadow-sm mb-2 d-flex align-items-center justify-content-center`} style={{ width: '100px', height: '100px' }}>
                {r.name.split('-')[1].toUpperCase()}
              </div>
              <span className="fw-bold">{r.name}</span>
              <span className="text-muted text-xs">{r.val}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Guideline;
