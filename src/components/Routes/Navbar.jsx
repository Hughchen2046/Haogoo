import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import ButtonPrimary from '../Tools/ButtonPrimary';
import ButtonOutline from '../Tools/ButtonOutline';
import Logo from '../Tools/Logo';
import { Search, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../../app/features/auth/authThunks';
import { IsAuthed } from '../../app/features/auth/authSlice';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchId, setSearchId] = useState(''); // 新增搜尋狀態
  const isAuth = useSelector(IsAuthed);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate(); // 用來導向搜尋結果

  const isIndex = location.pathname === '/';

  // 當 isScrolled 時，不論 isIndex 都使用相同的色系（白色）
  const navLogoColor = isScrolled ? 'text-white' : isIndex ? 'text-white' : 'text-primary';
  const navLinkColor = isScrolled ? 'text-white' : isIndex ? 'text-white' : 'text-gray-900';
  const navSearchColor = isScrolled
    ? 'bg-gray-50 text-gray-200 placeholder-gray-200'
    : isIndex
      ? 'bg-gray-50 text-gray-200 placeholder-gray-200'
      : 'bg-gray-400 text-gray-800 placeholder-gray-800';

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        isIndex ? setIsScrolled(scrollY > 200) : setIsScrolled(scrollY > 15);
      });
    };
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isIndex]); // 加入 isIndex

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  const openLogin = () => {
    navigate('/login');
  };

  const openRegist = () => {
    navigate('/regist');
  };

  const closeOffcanvas = () => {
    const offcanvasElement = document.getElementById('mobileMenu');
    if (offcanvasElement) {
      const closeBtn = offcanvasElement.querySelector('[data-bs-dismiss="offcanvas"]');
      if (closeBtn) closeBtn.click();
    }
  };

  // 新增：搜尋按鈕或 Enter 鍵事件
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim() !== '') {
      navigate(`/stockInfo/${searchId.trim()}`);
      setSearchId(''); // 清空輸入框
      closeOffcanvas(); // 如果是小螢幕，關閉側邊欄
    }
  };

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg position-fixed top-0 start-0 end-0 p-12 py-lg-16 font-zh-tw transition-all ${
          isScrolled ? 'navbar-scrolled' : ''
        }`}
        style={{ zIndex: 500 }}
        data-bs-theme="dark"
      >
        <div className="container d-flex gap-md-48 justify-content-between px-0 ">
          <NavLink className="navbar-brand" to="/">
            <Logo className={`nav-logo ${navLogoColor}`} />
          </NavLink>

          <ButtonPrimary
            className="w-auto py-10 px-24 d-lg-none"
            onClick={isAuth ? undefined : openRegist}
          >
            {isAuth ? '使用者資料' : '免費註冊'}
          </ButtonPrimary>

          {/* 大螢幕搜尋框 */}
          <form
            className="d-none position-relative d-lg-flex w-100"
            onSubmit={handleSearch} // form submit 導向
          >
            <input
              type="text"
              className={`form-control ${navSearchColor} font-weight-light border-0 round-8 py-12 ps-24 pe-16 shadow-none`}
              placeholder="輸入台/美股代號，查看公司價值"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button
              type="submit"
              className="position-absolute end-0 top-50 translate-middle-y me-12 text-white bg-transparent border-0"
            >
              <Search size={24} className={navLinkColor} />
            </button>
          </form>

          <ul className="navbar-nav w-100 d-none d-lg-flex gap-md-8">
            <li className="nav-item d-flex flex-column justify-content-center align-items-center">
              <NavLink className={`nav-link py-10 px-16 ${navLinkColor}`} to="/mystocklist">
                我的選股清單
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={`nav-link py-10 px-16 ${navLinkColor}`} to="/topics">
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
                  onClick={openLogin}
                >
                  登入
                </button>
              )}
            </li>
            <ButtonPrimary
              className="w-auto py-10 px-32"
              onClick={isAuth ? undefined : openRegist}
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

        {/* 小螢幕搜尋框 */}
        <form className="position-relative mb-40 px-12" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-control bg-gray-400 text-gray-800 font-weight-light placeholder-gray-800 border-0 round-8 py-12 ps-24 pe-16 shadow-none"
            placeholder="輸入台/美股代號，查看公司價值"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button
            type="submit"
            className="position-absolute end-0 top-50 translate-middle-y me-12 text-gray-800 bg-transparent border-0"
          >
            <Search size={24} />
          </button>
        </form>

        {/* 小螢幕選單 */}
        <ul className="navbar-nav font-zh-tw text-center gap-24 h6 px-12">
          <li className="nav-item py-10 px-16">
            <NavLink
              to="/mystocklist"
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

        <div className="mt-auto d-flex gap-12 flex-column font-zh-tw px-12">
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
              onClick={() => {
                closeOffcanvas();
                openLogin();
              }}
            >
              登入
            </ButtonOutline>
          )}
          <ButtonPrimary
            className="py-10 px-32 mb-24"
            onClick={() => {
              closeOffcanvas();
              openRegist();
            }}
          >
            免費註冊
          </ButtonPrimary>
        </div>
      </div>
    </>
  );
}
