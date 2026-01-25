import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../scss/_StockInfo.scss";

export default function StockInfo() {
  const [activeTab, setActiveTab] = useState("股價走勢");
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const tabs = ["股價走勢", "股利政策", "股價 K 線"];

  return (
    <div className="pt-5 stock-info-page">
      {/* 卡片區 */}
      <div className="custom-container d-flex justify-content-center mt-5 pt-5 mb-4">
        <div className="card bg-light shadow-sm rounded-4 stockInfoCard" style={{ width: "100%" }}>
          <div className="card-body">
            <h3 className="card-title mb-1">元大高股息</h3>
            <h6 className="card-subtitle text-muted mb-3">0056</h6>
            <h2 className="fw-light">36.59</h2>
            <p className="mb-0">2026/01/01 14:30 更新 | 總量 22.124 張</p>
          </div>
        </div>
      </div>

      {/* 手機 dropdown */}
      <div className="custom-container mb-4 d-md-none">
        <div className="position-relative">
          <button
            className="btn stock-dropdown-btn btn-lg w-100"
            onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
          >
            {activeTab}
          </button>
          {mobileDropdownOpen && (
            <ul className="dropdown-menu show w-100 mt-2">
              {tabs.map((tab) => (
                <li key={tab}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => {
                      setActiveTab(tab);
                      setMobileDropdownOpen(false);
                    }}
                  >
                    {tab}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 桌機水平排列 */}
      <div className="custom-container d-none d-md-flex flex-column mb-5">
        <div className="d-flex border-bottom">
          {tabs.map((tab) => (
            <button
              key={tab}
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
