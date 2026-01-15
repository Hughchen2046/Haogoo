export default function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-gray-600 py-0 ">
        <div className="container ">
          <a class="navbar-brand" href="#">
            <img
              src="\src\assets\WH-HaoGoo-Logo.png"
              alt="Logo"
              width="153px"
              height="40px"
              class="d-inline-block align-text-top"
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            {/* 搜尋框 */}
            <form className="position-relative" style={{ width: 599, height: 48 }}>
              <input
                type="search"
                className="form-control h-100 pe-5 bg-gray-600 text-gray-800"
                placeholder="輸入台/美股代號，查看公司價值"
              />

              <button
                type="submit"
                className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent p-0 d-flex align-items-center justify-content-center"
                aria-label="search"
              >
                <i className="bi bi-search fs-5 text-white"></i>
              </button>
            </form>
          </div>

          <ul className="navbar-nav my-20">
            <li className="nav-item">
              <a className="nav-link text-gray-300 fw-bold tx-h6 mx-8" href="#">
                我的選股清單
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-gray-300 fw-bold tx-h6 mx-8" href="#">
                熱門話題
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-gray-300 fw-bold tx-h6 mx-8" href="#">
                登入
              </a>
            </li>
            <button className="btn bg-primary btn-login text-white fw-bold tx-h6 round-8 mx-8">
              免費註冊
            </button>
            
          </ul>
        </div>
      </nav>
    </>
  );
}
