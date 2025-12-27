import React from 'react';

const Guideline = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-5 border-bottom pb-3">Design Guideline</h1>

      {/* Colors */}
      <section className="mb-12">
        <h2 className="mb-4">顏色 (Color)</h2>
        <div className="mb-3 fw-bold text-gray-700">
          使用 primary, success, danger, info, warning...
        </div>
        <div className="d-flex flex-wrap gap-3 mb-5">
          {[
            {name: 'Primary', bg: 'bg-primary'},
            {name: 'Secondary', bg: 'bg-secondary'},
            {name: 'Success', bg: 'bg-success'},
            {name: 'Warning', bg: 'bg-warning'},
            {name: 'Info', bg: 'bg-info', text: 'text-dark', border: 'border'},
            {name: 'Danger', bg: 'bg-danger'},
            {name: 'Dark', bg: 'bg-dark'},
            {
              name: 'Light',
              bg: 'bg-light',
              text: 'text-dark',
              border: 'border',
            },
          ].map((c) => (
            <div
              key={c.name}
              className={`p-4 ${c.bg} ${c.text || 'text-white'} ${
                c.border || ''
              } rounded shadow-sm d-flex align-items-center justify-content-center`}
              style={{minWidth: '120px'}}
            >
              {c.name}
            </div>
          ))}
        </div>

        <div className="mb-3 fw-bold text-gray-700">
          新增使用 primary-數值, gray 數值
        </div>
        <div className="row g-4">
          <div className="col-md-6">
            <h5 className="mb-3">Primary Extended</h5>
            {[50, 100, 200, 300, 400, 500, 600, 700].map((v) => (
              <div
                key={`p-${v}`}
                className="d-flex align-items-center justify-content-between mb-2 p-2 border-bottom"
              >
                <span className="text-sm font-monospace">primary-{v}</span>
                <span className={`text-primary-${v} fw-bold`}>Text</span>
                <span
                  className={`
    bg-primary-${v} px-3 py-1 rounded text-xs 
    ${v === 50 ? 'text-dark' : 'text-light'}
  `}
                >
                  Background
                </span>
                <div
                  className={`border-3 border-solid border-primary-${v} p-1 rounded text-xs`}
                >
                  Border
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-6">
            <h5 className="mb-3">Gray Extended</h5>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((v) => (
              <div
                key={`g-${v}`}
                className="d-flex align-items-center justify-content-between mb-2 p-2 border-bottom"
              >
                <span className="text-sm font-monospace">gray-{v}</span>
                <span className={`text-gray-${v} fw-bold`}>Text</span>
                <span
                  className={`bg-gray-${v} px-3 py-1 rounded text-xs ${
                    v > 600 ? 'text-white' : ''
                  }`}
                >
                  Background
                </span>
                <div
                  className={`border-3 border-solid border-gray-${v} p-1 rounded text-xs`}
                >
                  Border
                </div>
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
          <p className="fs-5 mb-3">
            這是 <span className="font-zh-tw">中文字形</span>
          </p>
          <p className="fs-5 mb-3">
            這是 <span className="font-en">英文字型</span>
          </p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <h5 className="text-gray-500 mb-3 text-dark">中文字體</h5>
            <div className="display-1 fw-bold">Display 1</div>
            <small className="text-muted">(80px)</small>
            <div className="display-2 fw-bold">Display 2</div>
            <small className="text-muted">(48px)</small>
            <h1>
              Heading 1 <small className="text-muted">(40px)</small>
            </h1>
            <h2>
              Heading 2 <small className="text-muted">(32px)</small>
            </h2>
            <h3>
              Heading 3 <small className="text-muted">(28px)</small>
            </h3>
            <h4>
              Heading 4 <small className="text-muted">(24px)</small>
            </h4>
            <h5>
              Heading 5 <small className="text-muted">(20px)</small>
            </h5>
            <h6>
              Heading 6 <small className="text-muted">(16px)</small>
            </h6>
          </div>
          <div className="col-md-6">
            <h5 className="text-gray-500 mb-3 text-dark">英文字體</h5>
            <p className="en-1 fw-light">
              fs-1 text <small className="text-muted">(40px)</small>
            </p>
            <p className="en-2 fw-light">
              fs-2 text <small className="text-muted">(32px)</small>
            </p>
            <p className="en-3 fw-light">
              fs-3 text <small className="text-muted">(28px)</small>
            </p>
            <p className="en-4 fw-light">
              fs-4 text <small className="text-muted">(24px)</small>
            </p>
            <p className="en-5 fw-light">
              fs-5 text <small className="text-muted">(20px)</small>
            </p>
            <p className="en-6 fw-light">
              fs-6 text <small className="text-muted">(16px)</small>
            </p>
            <p className="caption fw-light">
              caption text <small className="text-muted">(14px)</small>
            </p>
          </div>
        </div>
      </section>

      <hr className="my-10" />

      {/* Spacing */}
      <section className="mb-20">
        <h2 className="mb-4">bs5 預設間距 (Spacing)</h2>
        <div className="row g-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((s) => (
            <div key={`s-${s}`} className="col-auto">
              <div
                className="bg-light border p-2 text-center rounded"
                style={{minWidth: '80px'}}
              >
                <div className="fw-bold fs-5">"{s}"</div>
                <div className="text-muted text-xs">
                  {[4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 80, 100, 120][s - 1]}
                  px
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 自訂間距 */}
        <h2 className="mb-4">自訂間距 </h2>
        <div className="row g-2 mb-4">
          {[10, 20, 72, 96].map((s) => (
            <div key={`s-${s}`} className="col-auto">
              {/* 務實建議：使用 p-px{s} 這種命名的 Class */}
              <div
                className={`bg-light border text-center rounded p-px${s}`}
                style={{minWidth: '100px'}}
              >
                <div className="fw-bold fs-5">.p-px{s}</div>
                <div className="text-muted text-xs">{s}px</div>

                {/* 視覺化演示：顯示該間距的佔位區塊 */}
                <div
                  className="bg-primary opacity-25 mt-2 mx-auto"
                  style={{height: '10px', width: `${s}px`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="alert alert-info d-flex align-items-center">
          <div className="my-4 border-solid border-gray-700 p-10 bg-white shadow-sm round-xl">
            測試 Box (Margin/Padding Test)
          </div>
          <span className="ms-4 text-muted small">
            可以開啟網頁檢查功能，利用元素樣式調整測試間距。
          </span>
        </div>
      </section>

      <hr className="my-10" />

      {/* Radius */}
      <section className="mb-5">
        <h2 className="mb-4">圓角 (Radius)</h2>
        <div className="d-flex flex-wrap gap-4">
          {[
            {name: 'round-sm', val: '8px', bg: 'bg-primary'},
            {name: 'round-lg', val: '24px', bg: 'bg-success'},
            {name: 'round-xl', val: '96px', bg: 'bg-danger'},
            {
              name: 'rounded-pill',
              val: '999px',
              bg: 'bg-info',
              text: 'text-dark',
            },
          ].map((r) => (
            <div key={r.name} className="d-flex flex-column align-items-center">
              <div
                className={`${r.bg} ${r.text || 'text-white'} p-4 ${
                  r.name
                } shadow-sm mb-2 d-flex align-items-center justify-content-center`}
                style={{width: '100px', height: '100px'}}
              >
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
