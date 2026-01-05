import Logo_DK from '../assets/Logo DK.png';
import Haogoo_DK from '../assets/Haogoo_DK.png';
import Google_Icon from '../assets/Google_Icon.png';

export default function Login() {
  return (
    <div className="col">
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#loginModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="loginLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen-sm-down">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h1 className="modal-title fs-5" id="loginLabel"></h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body mt-72 text-center">
              <img
                src={Logo_DK}
                style={{ width: '40px', height: '40px' }}
                className="me-4"
                alt="Logo_dark"
              />
              <img src={Haogoo_DK} alt="Haogoo_dark" />
              <h3 className="font-zh-tw mt-32 mb-32">立即登入，解鎖完整功能</h3>
              <div className="d-flex flex-column gap-24 align-items-center">
                <button
                  type="button"
                  className="btn btn-light w-100 d-flex justify-content-center align-items-center gap-8"
                >
                  <img
                    src={Google_Icon}
                    style={{ width: '24px', height: '24px' }}
                    alt="Google-icon"
                  />
                  <h6 className="m-0">使用 Google 帳號快速登入</h6>
                </button>
                <p className="caption">或</p>
                <div className="w-100">
                  <h6 className="text-start mb-8">帳號</h6>
                  <div className="form-floating">
                    <input
                      type="email"
                      className="form-control"
                      id="accountInput"
                      placeholder="請輸入信箱"
                    />
                    <label htmlFor="accountInput">請輸入信箱</label>
                  </div>
                </div>
                <div className="w-100">
                  <h6 className="text-start mb-8">密碼</h6>
                  <div className="form-floating">
                    <input
                      type="password"
                      className="form-control"
                      id="passwordInput"
                      placeholder="請輸入密碼"
                    />
                    <label htmlFor="passwordInput">請輸入密碼</label>
                  </div>
                </div>
                <button type="button" className="w-100 btn btn-primary py-12 px-40 round-8">
                  登入
                </button>
                <div className="d-flex">
                  <p>沒有帳號?</p>
                  <a href="#" style={{ color: '#0d6efd' }}>
                    立即註冊
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
