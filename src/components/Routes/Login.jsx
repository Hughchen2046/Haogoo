import { useState, useEffect } from 'react';
import Google_Icon from '../../assets/Google_Icon.png';
import Logo from '../Logo';
import ButtonOutline from '../ButtonOutline';
import ButtonPrimary from '../ButtonPrimary';
import axios from 'axios';

const loginUrl = import.meta.env.PROD
  ? 'https://haogoo-data.zeabur.app/login'
  : 'http://localhost:3000/login';
let method = 'POST';

export default function Login() {
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 初始化時檢查登入狀態
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuth(!!token);
  }, []);

  const logoutAuth = () => {
    localStorage.removeItem('authToken');
    setIsAuth(false);
    window.dispatchEvent(new Event('authChange'));
  };
  const loginSubmit = async (e) => {
    e.preventDefault();

    // 如果已登入，則執行登出
    if (isAuth) {
      localStorage.removeItem('authToken');
      setIsAuth(false);
      alert('已登出');
      return;
    }

    // 執行登入
    const loginData = {
      email,
      password,
    };
    try {
      const response = await axios.post(loginUrl, loginData);
      const token = response.data.accessToken;

      // 儲存 token 到 localStorage
      localStorage.setItem('authToken', token);
      console.log('登入成功，Token:', token);
      alert('登入成功');
      setIsAuth(true);
      setEmail('');
      setPassword('');
      // 觸發 custom event 通知其他組件更新認證狀態
      window.dispatchEvent(new Event('authChange'));
    } catch (error) {
      console.log('登入失敗:', error);
      alert('登入失敗，請檢查帳號密碼');
      setIsAuth(false);
    }
  };

  useEffect(() => {
    if (isAuth) {
      // 登入成功後關閉 modal
      const modalElement = document.getElementById('loginModal');
      if (modalElement) {
        // 觸發關閉按鈕的點擊事件
        const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
        if (closeButton) {
          closeButton.click();
        }
      }

      // 同時關閉 offcanvas（手機版選單）
      const offcanvasElement = document.getElementById('mobileMenu');
      if (offcanvasElement) {
        const offcanvasCloseButton = offcanvasElement.querySelector(
          '[data-bs-dismiss="offcanvas"]'
        );
        if (offcanvasCloseButton) {
          offcanvasCloseButton.click();
        }
      }
    }
  }, [isAuth]);

  return (
    <>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="passwordInput">請輸入密碼</label>
                  </div>
                </div>
                <ButtonPrimary
                  type="submit"
                  className="py-12 px-40 round-8"
                  onClick={isAuth ? logoutAuth : loginSubmit}
                >
                  {isAuth ? '登出' : '登入'}
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
    </>
  );
}
