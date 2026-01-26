import { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../scss/_StockInfo.scss";
import { ArrowDown, ArrowUp, Minus, ChevronRight } from "lucide-react";

export default function StockInfo() {
  const [activeTab, setActiveTab] = useState("股價走勢");
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const tvRef = useRef(null);
  const widgetRef = useRef(null);

  const changePct = 0.5;
  const trend = changePct > 0 ? "up" : changePct < 0 ? "down" : "flat";
  const trendColor =
    trend === "up" ? "text-danger" : trend === "down" ? "text-success" : "text-secondary";
  const trendBgColor =
    trend === "up" ? "bg-pink" : trend === "down" ? "bg-pinkgreen" : "border bg-light";

  const tabs = ["股價走勢", "股利政策", "股價 K 線"];

  // ===== TradingView Advanced Chart Widget =====
  useEffect(() => {
    if (activeTab !== "股價走勢") return;
    if (!tvRef.current) return;

    tvRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      widgetRef.current = new window.TradingView.widget({
        container_id: "tradingview_chart",
        symbol: "TWSE:0056",
        interval: "D",
        width: tvRef.current.offsetWidth,
        height: window.innerWidth < 768 ? 400 : 500, // 手機板/桌面板高度
        timezone: "Asia/Taipei",
        theme: "light",
        style: 1, // 1 = 折線圖
        locale: "zh_TW",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: false,
      });
    };

    tvRef.current.appendChild(script);

    // 監測寬度變化，讓 TradingView widget 自適應
    const resizeObserver = new ResizeObserver(() => {
      if (widgetRef.current) {
        widgetRef.current.resize(tvRef.current.offsetWidth, window.innerWidth < 768 ? 400 : 500);
      }
    });

    resizeObserver.observe(tvRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeTab]);

  return (
    <div className="stock-info-page pt-5">
      {/* 麵包屑 */}
      <div className="custom-container mt-5 text-muted mb-3 d-flex align-items-center gap-1 ps-0">
        <span>首頁</span>
        <ChevronRight size={16} />
        <span>0056 元大高股息</span>
      </div>

      {/* 股票卡 */}
      <div className="custom-container d-flex justify-content-center mb-4">
        <div className="card bg-light shadow-sm rounded-4 stockInfoCard">
          <div className="card-body">
            <div className="d-flex align-items-center mb-2">
              <h3 className="card-title mb-0">元大高股息</h3>
              <h6 className="card-subtitle text-muted ms-3 mb-0">0056</h6>
            </div>

            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="card-number">36.59</div>
              <div
                className={`d-flex justify-content-center align-items-center icon-48 round-8 ${trendBgColor}`}
              >
                {trend === "up" && <ArrowUp className={`icon-24 ${trendColor}`} />}
                {trend === "down" && <ArrowDown className={`icon-24 ${trendColor}`} />}
                {trend === "flat" && <Minus className={`icon-24 ${trendColor}`} />}
              </div>
              <div className="stockRate text-danger">0.01 (0.03%)</div>
            </div>

            <p className="card-content mb-0 text-muted">
              2026/01/01 14:30 更新 | 總量 22,134 張
            </p>
          </div>
        </div>
      </div>

      {/* 手機 dropdown */}
      <div className="custom-container mb-4 d-md-none">
        <button
          className="stock-dropdown-btn btn-lg w-100"
          onClick={() => setMobileDropdownOpen((p) => !p)}
        >
          {activeTab}
        </button>

        {mobileDropdownOpen && (
          <ul className="dropdown-menu show w-100 mt-2">
            {tabs.map((tab) => (
              <li key={tab}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setActiveTab(tab);
                    setMobileDropdownOpen(false);
                  }}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 桌機 tabs */}
      <div className="custom-container d-none d-md-flex mb-4 border-bottom">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`btn stock-dropdown-btn btn-lg ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 內容 */}
      <div className="custom-container mb-5">
        {activeTab === "股價走勢" && (
          <div ref={tvRef} id="tradingview_chart" style={{ width: "100%", height: "500px" }} />
        )}

        {activeTab !== "股價走勢" && (
          <div className="text-muted text-center py-5">尚未實作內容</div>
        )}
      </div>
    </div>
  );
}
