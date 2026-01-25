import { useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Topics } from '../../contexts/Topics';
import { ChevronUp, ChevronDown, ChevronRight, MessageCircleMore } from 'lucide-react';
import pigbank from '../../assets/pigbank.png';

export default function TopicFeedPage() {
  const { topicSlug } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentTopic =
    Object.values(Topics).find((topic) => topic.slug === (topicSlug ?? '')) ?? Topics.all;

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

            {/*文章區*/}
            <div className="mb-24">
              <div className="d-flex flex-column gap-24 flex-lg-row py-lg-40 topic-border-img">
                <img src={pigbank} alt="pigbank" className="object-fit-cover" />
                <div className="w-100">
                  <h3 className="mb-8">小資族最愛：定期定額排行榜 TOP 10</h3>
                  <div className="d-flex gap-8 py-8 mb-8">
                    <span className="bg-primary-200 font-weight-bold py-4 px-8 round-4">ETF</span>
                    <span className="bg-primary-200 font-weight-bold py-4 px-8 round-4">
                      新手友善
                    </span>
                  </div>
                  <div className="d-lg-flex justify-content-between">
                    <div className="d-flex align-items-center gap-4 py-4 mb-8 mb-lg-0 text-gray-800">
                      <span>2025-01-15</span>
                      <span
                        className="border-start border-gray-800"
                        style={{ height: '16px' }}
                      ></span>
                      <span>來源： StockFeel</span>
                    </div>
                    <a href="#" className="d-flex gap-8 py-8 link-dark text-decoration-none">
                      <MessageCircleMore />
                      <span>2,350</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">查看更多</div>
          </div>

          {/* 這裡放文章列表 */}
        </div>
      </div>
    </>
  );
}
