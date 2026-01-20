import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ButtonPrimary from '../ButtonPrimary';
import ButtonOutline from '../ButtonOutline';
import Logo from '../Logo';
import { Search, Menu, X } from 'lucide-react';
import Login from './Login';
import Regist from './Regist';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isRegist, setIsRegist] = useState(false);

  // 檢查登入狀態
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuth(!!token);
    };

    checkAuth();

    const checkRegist = (e) => {
      console.log('收到註冊成功了喔', e.detail.nickname);
    };

    // 監聽 storage 事件（跨頁面）和 authChange 事件（同頁面）
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);
    window.addEventListener('registSuccess', checkRegist);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('registSuccess', checkRegist);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoutAuth = () => {
    localStorage.removeItem('authToken');
    setIsAuth(false);
    window.dispatchEvent(new Event('authChange'));
  };

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg position-fixed top-0 start-0 end-0 p-12 font-zh-tw transition-all ${
          isScrolled ? 'navbar-scrolled' : ''
        }`}
        style={{ zIndex: 999 }}
        data-bs-theme="dark"
      >
        <div className="container d-flex gap-md-48 justify-content-between px-0 ">
          <Link className="navbar-brand" to="/">
            <Logo className="nav-logo" />
          </Link>
          <ButtonPrimary
            className="w-auto py-10 px-24 d-lg-none"
            data-bs-toggle={isAuth ? '' : 'modal'}
            data-bs-target={isAuth ? '' : '#registModal'}
          >
            {isAuth ? '使用者資料' : '免費註冊'}
          </ButtonPrimary>
          <div className=" d-none position-relative d-lg-flex w-100">
            <input
              type="text"
              className="form-control bg-gray-50 text-gray-200 font-weight-light placeholder-gray-200 border-0 round-8 py-12 ps-24 pe-16 shadow-none"
              placeholder="輸入台/美股代號，查看公司價值"
            />
            <button
              type="submit"
              className="position-absolute end-0 top-50 translate-middle-y me-12 text-white bg-transparent border-0"
            >
              <Search size={24} />
            </button>
          </div>
          <ul className="navbar-nav w-100 d-none d-lg-flex gap-md-8">
            <li className="nav-item">
              <Link className="nav-link text-gray-300 py-10 px-16" to="/test">
                我的選股清單
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-gray-300 py-10 px-16" to="/">
                熱門話題
              </Link>
            </li>
            <li className="nav-item">
              {isAuth ? (
                <button
                  className="nav-link btn btn-link text-gray-300 py-10 px-16 border-0 shadow-none"
                  onClick={logoutAuth}
                >
                  登出
                </button>
              ) : (
                <button
                  className="nav-link btn btn-link text-gray-300 py-10 px-16 border-0 shadow-none"
                  data-bs-toggle="modal"
                  data-bs-target="#loginModal"
                >
                  登入
                </button>
              )}
            </li>
            <ButtonPrimary
              className="w-auto py-10 px-32"
              data-bs-toggle={isAuth ? '' : 'modal'}
              data-bs-target={isAuth ? '' : '#registModal'}
            >
              {isAuth ? '使用者資料' : '免費註冊'}
            </ButtonPrimary>
          </ul>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
          >
            <Menu className="text-white" />
          </button>
        </div>
      </nav>

      {/* 手機版側邊選單 - 移至 nav 外部避免高度被縮限 */}
      <div
        className="offcanvas d-lg-none offcanvas-start w-100 border-0"
        tabIndex="-1"
        id="mobileMenu"
        data-bs-theme="light"
      >
        <div className="offcanvas-header bg-white border-bottom py-12 px-12">
          <Logo className="header-logo" />
          <button
            type="button"
            className="icon-40 btn-close text-reset shadow-none border-0 d-flex align-items-center justify-content-center"
            data-bs-dismiss="offcanvas"
          >
            <X size={24} />
          </button>
        </div>
        {/* Body: 搜尋框 + 選單連結 */}
        <div className="offcanvas-body d-flex flex-column p-12 bg-light text-gray-900">
          {/* 搜尋框區塊 */}
          <div className="position-relative mb-40">
            <input
              type="text"
              className="form-control bg-gray-400 text-gray-800 font-weight-light placeholder-gray-800 border-0 round-8 py-12 ps-24 pe-16 shadow-none"
              placeholder="輸入台/美股代號，查看公司價值"
            />
            <Search
              className="position-absolute end-0 top-50 translate-middle-y me-12 text-gray-800"
              size={24}
            />
          </div>
          {/* 選單列表 */}
          <ul className="navbar-nav font-zh-tw text-center gap-24 h6">
            <li className="nav-item py-10 px-16">
              <Link to="/test" className="text-decoration-none text-gray-900">
                我的選股清單
              </Link>
            </li>
            <li className="nav-item py-10 px-16">
              <Link to="/" className="text-decoration-none text-gray-900">
                熱門話題
              </Link>
            </li>
          </ul>
          {/* 底部按鈕 - 使用 mt-auto 推到底部 */}
          <div className="mt-auto d-flex gap-12 flex-column font-zh-tw">
            {isAuth ? (
              <ButtonOutline
                className="py-10 px-32"
                onClick={logoutAuth}
                data-bs-dismiss="offcanvas"
              >
                登出
              </ButtonOutline>
            ) : (
              <ButtonOutline
                className="py-10 px-32"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
                data-bs-dismiss="offcanvas"
              >
                登入
              </ButtonOutline>
            )}
            <ButtonPrimary
              className="py-10 px-32 mb-24"
              data-bs-toggle="modal"
              data-bs-target="#registModal"
            >
              免費註冊
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </>
  );
}
