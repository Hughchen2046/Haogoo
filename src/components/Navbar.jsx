export default function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-gray-600 py-0 ">
        <div className="container ">
          <a class="navbar-brand" href="#">
            <img
              src="\src\assets\Logo.svg"
              alt="Logo"
              width="153"
              height="40"
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
            <form
              className="d-flex d-none d-md-block mb-0 mx-48"
              role="search"
              style={{ width: '599px' }}
            >
              <div className="input-group ">
                <input
                  className="form-control"
                  type="search"
                  placeholder="輸入台/美股代號，查看公司價值"
                  aria-label="Search"
                />
                {/* 搜尋欄裡的icon */}
                <i className="bi bi-search bg-white"></i>
              </div>
            </form>
        </div>

            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <a className="nav-link text-gray-300 fw-bold h6 py-10 px-16 mx-8 mb-0" href="#">
                  我的選股清單
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-gray-300 fw-bold h6 py-10 px-16 mx-8 mb-0" href="#">
                  熱門話題
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-gray-300 fw-bold h6 py-10 px-16 mx-8 mb-0" href="#">
                  登入
                </a>
              </li>
              <button className="btn bg-primary text-white fw-bold h6 round-8 mx-8 mb-0">
                免費註冊
              </button>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
