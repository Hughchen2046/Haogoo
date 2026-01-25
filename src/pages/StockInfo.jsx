import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../scss/_StockInfo.scss";
import { ArrowDown, ArrowUp, Minus, ChevronLeft, ChevronRight } from "lucide-react";

export default function StockInfo() {
  const [activeTab, setActiveTab] = useState("股價走勢");
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  // 假設股價漲跌百分比，實際可從 API 取得
  const changePct = 0.5;

  const trend = changePct > 0 ? "up" : changePct < 0 ? "down" : "flat";
  const trendColor =
    trend === "up" ? "text-danger" : trend === "down" ? "text-success" : "text-secondary";
  const trendBgColor =
    trend === "up" ? "bg-pink" : trend === "down" ? "bg-pinkgreen" : "border bg-light";

  const tabs = ["股價走勢", "股利政策", "股價 K 線"];

  return (
    <div className="stock-info-page pt-5">
      {/* ===== 麵包屑 ===== */}
      <div className="custom-container mt-5 text-muted mb-3 d-flex align-items-center gap-1 ps-0">
        <span>首頁</span>
        <ChevronRight size={16} />
        <span>0056 元大高股息</span>
      </div>

      {/* ===== 股票資訊卡片 ===== */}
      <div className="custom-container d-flex justify-content-center mb-4">
        <div className="card bg-light shadow-sm rounded-4 stockInfoCard w-100">
          <div className="card-body">
            {/* 標題列 */}
            <div className="d-flex align-items-center mb-2">
              <h3 className="card-title mb-0">元大高股息</h3>
              <h6 className="card-subtitle text-muted ms-3 mb-0">0056</h6>
            </div>

            {/* ===== card-number 與 icon 同行 ===== */}
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="card-number">36.59</div>
              <div
                className={`d-flex justify-content-center align-items-center icon-48 round-8 ${trendBgColor}`}
              >
                {trend === "up" && <ArrowUp className={`icon-24 ${trendColor}`} />}
                {trend === "down" && <ArrowDown className={`icon-24 ${trendColor}`} />}
                {trend === "flat" && <Minus className={`icon-24 ${trendColor}`} />}
              </div>
            </div>

            <p className="card-content mb-0 text-muted">
              2026/01/01 14:30 更新 | 總量 22,134 張
            </p>
          </div>
        </div>
      </div>

      {/* ===== 手機版 Dropdown ===== */}
      <div className="custom-container mb-4 d-md-none">
        <div className="position-relative">
          <button
            type="button"
            className="btn stock-dropdown-btn btn-lg w-100"
            onClick={() => setMobileDropdownOpen((prev) => !prev)}
          >
            {activeTab}
          </button>

          {mobileDropdownOpen && (
            <ul className="dropdown-menu show w-100 mt-2">
              {tabs.map((tab) => (
                <li key={tab}>
                  <button
                    type="button"
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
      </div>

      {/* ===== 桌機版 Tabs ===== */}
      <div className="custom-container d-none d-md-flex flex-column mb-5">
        <div className="d-flex border-bottom">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`btn stock-dropdown-btn btn-lg tab-btn ${
                activeTab === tab ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
