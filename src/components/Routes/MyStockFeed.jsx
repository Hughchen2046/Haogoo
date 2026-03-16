import { useState } from 'react';
import { useParams, NavLink, useLocation, Outlet } from 'react-router-dom';
import { ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';
import { MyStockList } from '../../contexts/Topics';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { authUser } from '../../app/features/auth/authSlice';
import { useWishlist } from '../../contexts/WishlistContext';

export default function MyStockFeed() {
  const { mystockSlug } = useParams();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(authUser);
  const { getWishlist } = useWishlist();

  // 進入此路由區塊時，確保自選股資料已載入
  useEffect(() => {
    if (user?.id) {
      getWishlist(user.id);
    }
  }, [user?.id, getWishlist]);

  const slug = mystockSlug || pathname.split('/').pop();
  const currentTopic =
    Object.values(MyStockList).find((topic) => topic.slug === slug) ?? MyStockList.all;

  return (
    <>
      <div className=" pt-80">
        <div className="container">
          <nav className="font-zh-tw py-12 caption">
            <ul className="d-flex gap-8 align-items-center list-unstyled m-0">
              <li className="font-weight-light">
                <NavLink className="text-decoration-none text-gray-800" to="/">
                  首頁
                </NavLink>
              </li>
              <li>
                <ChevronRight width={16} height={16} className="text-gray-800" />
              </li>
              <NavLink className="text-decoration-none text-gray-800" to="/mystocklist">
                我的選股清單
              </NavLink>
              <li>
                <ChevronRight width={16} height={16} className="text-gray-800" />
              </li>
              <li className="">{currentTopic.label}</li>
            </ul>
          </nav>
          <div className="pt-32 pb-64">
            <div className="mb-32 font-zh-tw">
              <h3 className="mb-8">我的選股清單</h3>
              <h2 className="display-2 text-primary">My Watchlist</h2>
            </div>
            {/*小螢幕用dropdown*/}
            <div className={`dropdown mb-32 font-zh-tw d-md-none ${isOpen ? 'show' : ''}`}>
              <button
                className="btn border-0 w-100 bg-gray-400 d-flex justify-content-between align-items-center py-16 px-24"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
              >
                <span className="ps-16">{currentTopic.label}</span>
                <ChevronDown />
              </button>
              <ul
                className={`mt-8 dropdown-menu w-100 py-16 px-24 border-0 ${isOpen ? 'show' : ''}`}
                style={{
                  backgroundColor: '#F3F3F3',
                  display: isOpen ? 'block' : 'none',
                }}
              >
                <li className="d-flex justify-content-between align-items-start">
                  <span className="dropdown-item-text pt-0 pb-8">請選擇分類</span>
                  <ChevronUp />
                </li>
                {Object.values(MyStockList).map((topic) => (
                  <li key={topic.slug} className="dropdown-li-hover">
                    <NavLink
                      to={topic.path}
                      className="dropdown-item font-weight-light py-8 mb-8"
                      end
                      onClick={() => setIsOpen(false)}
                    >
                      {topic.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            {/*大螢幕用nav-underline*/}
            <div className="d-none d-md-block">
              <ul className="nav nav-topic gap-24 gap-lg-40 px-8">
                {Object.values(MyStockList).map((topic) => (
                  <li key={topic.slug} className="nav-item">
                    <NavLink to={topic.path} className="nav-link h4 px-0 pt-0 pb-0 border-0" end>
                      {({ isActive }) => (
                        <>
                          <div className="pb-16">{topic.label}</div>
                          {isActive && <div className="nav-topic-underline"></div>}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-32 mt-lg-24 mb-64 mb-lg-96">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
