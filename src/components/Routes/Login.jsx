import { useRef, useState, useEffect } from 'react';
import * as bootstrap from 'bootstrap';
import Google_Icon from '../../assets/Google_Icon.png';
import Logo from '../Tools/Logo';
import ButtonOutline from '../Tools/ButtonOutline';
import ButtonPrimary from '../Tools/ButtonPrimary';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { isAuth, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isAuth) {
      logout();
      alert('已登出');
      return;
    }

    const { success, error } = await login({ email, password });

    if (success) {
      console.log('登入成功');
      alert('登入成功');
      setEmail('');
      setPassword('');
    } else {
      console.log('登入失敗:', error);
      alert('登入失敗，請檢查帳號密碼');
    }
  };

  const nextModalRef = useRef(null);

  // 處理切換 Modal 的邏輯
  const handleSwitch = (targetId) => {
    nextModalRef.current = targetId;
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      bootstrap.Modal.getOrCreateInstance(modalElement).hide();
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById('loginModal');
    if (!modalElement) return;

    const handleHidden = () => {
      setEmail('');
      setPassword('');
      document.querySelector('.modal-backdrop')?.remove();
      document.body.style.overflow = '';

      if (nextModalRef.current) {
        const nextEl = document.getElementById(nextModalRef.current);
        if (nextEl) {
          const modalInstance = bootstrap.Modal.getOrCreateInstance(nextEl);
          modalInstance.show();
        }
        nextModalRef.current = null;
      }
    };

    const handleShown = () => {
      document.getElementById('accountInput')?.focus();
    };

    modalElement.addEventListener('hidden.bs.modal', handleHidden);
    modalElement.addEventListener('shown.bs.modal', handleShown);

    return () => {
      modalElement.removeEventListener('hidden.bs.modal', handleHidden);
      modalElement.removeEventListener('shown.bs.modal', handleShown);
    };
  }, []);

  useEffect(() => {
    if (isAuth) {
      // 登入成功後觸發關閉
      const modalElement = document.getElementById('loginModal');
      if (modalElement) {
        const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
        closeButton?.click();
      }

      // 同時關閉 offcanvas
      const offcanvasElement = document.getElementById('mobileMenu');
      if (offcanvasElement) {
        const offcanvasCloseButton = offcanvasElement.querySelector(
          '[data-bs-dismiss="offcanvas"]'
        );
        offcanvasCloseButton?.click();
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
                <ButtonPrimary type="submit" className="py-12 px-40 round-8" onClick={handleLogin}>
                  {isAuth ? '登出' : '登入'}
                </ButtonPrimary>
                <div className="d-flex">
                  <p>沒有帳號？</p>
                  <a href="#" className="link-primary" onClick={() => handleSwitch('registModal')}>
                    立即註冊
                  </a>
                </div>
              </div>
              <a
                href="#"
                className="d-inline-block mb-8"
                onClick={() => handleSwitch('forgetPWModal')}
              >
                忘記密碼?
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
