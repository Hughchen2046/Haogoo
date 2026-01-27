import { useState } from 'react';
import { useParams, NavLink, useLocation, Outlet } from 'react-router-dom';
import { Topics } from '../../contexts/Topics';
import { ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';

export default function TopicFeedPage() {
  const { topicSlug } = useParams();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const slug = topicSlug || pathname.split('/').pop();
  const currentTopic = Object.values(Topics).find((topic) => topic.slug === slug) ?? Topics.all;

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
              <li className="">{currentTopic.label}</li>
            </ul>
          </nav>
          <div className="pt-32 pb-64">
            <div className="mb-32 font-zh-tw">
              <h3 className="mb-8">熱門話題</h3>
              <h2 className="display-2 text-primary">Trending Now</h2>
            </div>
            {/*小螢幕用dropdown*/}
            <div className={`dropdown mb-32 font-zh-tw d-lg-none ${isOpen ? 'show' : ''}`}>
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
                className={`dropdown-menu w-100 py-16 px-24 border-0 ${isOpen ? 'show' : ''}`}
                style={{
                  backgroundColor: '#F3F3F3',
                  display: isOpen ? 'block' : 'none',
                }}
              >
                <li className="d-flex justify-content-between align-items-start">
                  <span className="dropdown-item-text pt-0 pb-8">請選擇分類</span>
                  <ChevronUp />
                </li>
                {Object.values(Topics).map((topic) => (
                  <li key={topic.slug}>
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
            <div className="d-none d-lg-block">
              <ul className="nav nav-topic gap-40 px-8">
                {Object.values(Topics).map((topic) => (
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

            <div className="mt-24">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
