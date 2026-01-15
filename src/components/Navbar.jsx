import { useState, useEffect } from 'react';
import ButtonPrimary from './ButtonPrimary';
import Logo from './Logo';
import { Search } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`navbar navbar-expand-md position-fixed top-0 start-0 end-0 p-12 font-zh-tw transition-all ${
          isScrolled ? 'navbar-scrolled' : ''
        }`}
        style={{ zIndex: 999 }}
        data-bs-theme="dark"
      >
        <div className="container d-flex gap-md-48 justify-content-between px-0 ">
          <a className="navbar-brand" href="#">
            <Logo className="nav-logo" />
          </a>
          <ButtonPrimary className="w-auto py-10 px-24 d-md-none">免費註冊</ButtonPrimary>
          <button
            className="navbar-toggler "
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ '--bs-navbar-toggler-focus-width': '0.1rem' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <form className="position-relative w-100" style={{ height: 48 }}>
              <input
                type="search"
                className="form-control h-100 pe-5 bg-transparent text-gray-200 placeholder-gray-200 border-gray-300"
                placeholder="輸入台/美股代號，查看公司價值"
                style={{ fontWeight: 400 }}
              />

              <button
                type="submit"
                className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent p-0 d-flex align-items-center justify-content-center"
                aria-label="search"
              >
                <Search size={24} />
              </button>
            </form>
          </div>

          <ul className="navbar-nav d-none d-md-flex gap-md-8">
            <li className="nav-item">
              <a className="nav-link text-gray-300 py-10 px-16" href="#">
                我的選股清單
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-gray-300 py-10 px-16" href="#">
                熱門話題
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-gray-300 py-10 px-16" href="#">
                登入
              </a>
            </li>
            <ButtonPrimary className="w-auto py-10 px-32 ">免費註冊</ButtonPrimary>
          </ul>
        </div>
      </nav>
    </>
  );
}
