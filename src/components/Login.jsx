import Google_Icon from '../assets/Google_Icon.png';
import Logo from '../components/Logo';
import ButtonOutline from './ButtonOutline';
import ButtonPrimary from './ButtonPrimary';

export default function Login() {
  return (
    <div className="col">
      <ButtonOutline className="py-10 px-32" data-bs-toggle="modal" data-bs-target="#loginModal">
        登入
      </ButtonOutline>

      <div
        className="modal fade "
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="loginLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen-sm-down">
          <div className="modal-content bg-bgc">
            <div className="modal-header border-0 ">
              <h1 className="modal-title fs-5" id="loginLabel"></h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center font-zh-tw">
              <Logo className="header-logo mx-auto"></Logo>
              <h3 className=" my-32 my-md-48">立即登入，解鎖完整功能</h3>
              <div className="d-flex flex-column gap-24 align-items-center">
                <ButtonOutline
                  type="button"
                  className="d-flex justify-content-center align-items-center py-8 px-16"
                >
                  <img src={Google_Icon} className="me-8 icon-24" alt="Google-icon" />
                  <h6 className="m-0">使用 Google 帳號快速登入</h6>
                </ButtonOutline>
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
                <ButtonPrimary type="button" className="py-12 px-40 round-8">
                  登入
                </ButtonPrimary>
                <div className="d-flex">
                  <p>沒有帳號？</p>
                  <a href="#" className="link-primary">
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
