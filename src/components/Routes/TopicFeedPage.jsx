import { useParams } from 'react-router-dom';
import { Topics } from '../../contexts/Topics';
import { NavLink } from 'react-router-dom';

export default function TopicFeedPage() {
  const { topicSlug } = useParams();

  const currentTopic =
    Object.values(Topics).find((topic) => topic.slug === (topicSlug ?? '')) ?? Topics.all;

  return (
    <>
      <div className=" py-80">
        <div className="container">
          <div className="p-12">首頁  >  {currentTopic.label}</div>
          <div className="pt-32 pb-64">
            <div className="mb-32">
              <h3 className="mb-8">熱門話題</h3>
              <h2 className="display-2">Trending Now</h2>
            </div>
            <div className="dropdown mb-32">
  <button className="btn border-0 w-100 bg-gray-400 d-flex justify-content-between align-items-center dropdown-toggle dropdown-toggle-split py-16 px-24" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-offset="0,20">
    <span className=''>{currentTopic.label}</span>
  </button>
  <ul className="dropdown-menu w-100">
    <li><span className="dropdown-item-text" >請選擇分類</span></li>
    {Object.values(Topics).map((topic) => (
      <li key={topic.slug}>
        <NavLink to={topic.path} className="dropdown-item" end>
          {topic.label}
        </NavLink>
      </li>
    ))}
  </ul>
</div>
            <ul className="nav nav-tabs">
              {Object.values(Topics).map((topic) => (
                <li key={topic.slug} className="nav-item">
                  <NavLink to={topic.path} className="nav-link" end>
                    {topic.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* 這裡放文章列表 */}
        </div>
      </div>
    </>
  );
}
