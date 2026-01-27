import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ButtonPrimary from '../Tools/ButtonPrimary';
import ButtonOutline from '../Tools/ButtonOutline';
import Logo from '../Tools/Logo';
import { Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuth, logout } = useAuth();
  const location = useLocation();
  const isIndex = location.pathname === '/';
  const navLogoColor = isIndex ? 'text-white' : 'text-primary';
  const navLinkColor = isIndex ? 'text-white' : 'text-gray-900';
  const navSearchColor = isIndex
    ? 'bg-gray-50 text-gray-200 placeholder-gray-200'
    : 'bg-gray-400 text-gray-800 placeholder-gray-800';

  useEffect(() => {
    const handleScroll = () => {
      isIndex ? setIsScrolled(window.scrollY > 200) : setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const closeOffcanvas = () => {
    const offcanvasElement = document.getElementById('mobileMenu');
    if (offcanvasElement) {
      const closeBtn = offcanvasElement.querySelector('[data-bs-dismiss="offcanvas"]');
      if (closeBtn) closeBtn.click();
    }
  };

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg position-fixed top-0 start-0 end-0 p-12 py-lg-16 font-zh-tw transition-all ${
          isScrolled ? 'navbar-scrolled' : ''
        }`}
        style={{ zIndex: 999 }}
        data-bs-theme="dark"
      >
        <div className="container d-flex gap-md-48 justify-content-between px-0 ">
          <NavLink className="navbar-brand" to="/">
            <Logo className={`nav-logo ${navLogoColor}`} />
          </NavLink>
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
              className={`form-control ${navSearchColor} font-weight-light border-0 round-8 py-12 ps-24 pe-16 shadow-none`}
              placeholder="輸入台/美股代號，查看公司價值"
            />
            <button
              type="submit"
              className="position-absolute end-0 top-50 translate-middle-y me-12 text-white bg-transparent border-0"
            >
              <Search size={24} className={navLinkColor} />
            </button>
          </div>
          <ul className="navbar-nav w-100 d-none d-lg-flex gap-md-8">
            <li className="nav-item d-flex flex-column justify-content-center align-items-center">
              <NavLink className={`nav-link ${navLinkColor} py-10 px-16`} to="/">
                我的選股清單
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={`nav-link ${navLinkColor} py-10 px-16`} to="/topics">
                熱門話題
              </NavLink>
            </li>
            <li className="nav-item">
              {isAuth ? (
                <button
                  className={`nav-link btn btn-link ${navLinkColor} py-10 px-16 border-0 shadow-none`}
                  onClick={handleLogout}
                >
                  登出
                </button>
              ) : (
                <button
                  className={`nav-link btn btn-link ${navLinkColor} py-10 px-16 border-0 shadow-none`}
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
            <Menu className={navLogoColor} />
          </button>
        </div>
      </nav>

      {/* 小螢幕側邊 */}
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
        {/* 小螢幕側邊: 搜尋框 + 選單連結 */}
        <div className="offcanvas-body d-flex flex-column p-12 bg-light text-gray-900">
          {/* 搜尋框 */}
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
          {/* 選單 */}
          <ul className="navbar-nav font-zh-tw text-center gap-24 h6">
            <li className="nav-item py-10 px-16">
              <NavLink
                to="/"
                className="text-decoration-none text-gray-900"
                onClick={closeOffcanvas}
              >
                我的選股清單
              </NavLink>
            </li>
            <li className="nav-item py-10 px-16">
              <NavLink
                to="/topics"
                className="text-decoration-none text-gray-900"
                onClick={closeOffcanvas}
              >
                熱門話題
              </NavLink>
            </li>
            <li className="nav-item py-10 px-16">
              <NavLink
                to="/test"
                className="text-decoration-none text-gray-900"
                onClick={closeOffcanvas}
              >
                GuideLine
              </NavLink>
            </li>
          </ul>
          <div className="mt-auto d-flex gap-12 flex-column font-zh-tw">
            {isAuth ? (
              <ButtonOutline
                className="py-10 px-32"
                onClick={() => {
                  handleLogout();
                  closeOffcanvas();
                }}
              >
                登出
              </ButtonOutline>
            ) : (
              <ButtonOutline
                className="py-10 px-32"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
                onClick={closeOffcanvas}
              >
                登入
              </ButtonOutline>
            )}
            <ButtonPrimary
              className="py-10 px-32 mb-24"
              data-bs-toggle="modal"
              data-bs-target="#registModal"
              onClick={closeOffcanvas}
            >
              免費註冊
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </>
  );
}
