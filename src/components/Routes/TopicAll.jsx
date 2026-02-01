import { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageCircleMore } from 'lucide-react';

export default function TopicAll() {
  const topicUrl = import.meta.env.VITE_TopicUrl;
  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // console.log('當前 Topic URL:', topicUrl);
    const fetchTopicData = async () => {
      try {
        const res = await axios.get(`${topicUrl}?_expand=user&_page=${page}&_limit=5`);
        console.log(`第 ${page} 頁資料取得成功:`, res.data);
        setAllData((prev) => (page === 1 ? res.data.data : [...prev, ...res.data.data]));
      } catch (err) {
        console.error('API 錯誤:', err);
      }
    };
    fetchTopicData();
  }, [page]);

  const topicLoadingMore = (e) => {
    e.preventDefault();
    setPage((prev) => prev + 1);
    console.log('page', page);
  };

  return (
    <div>
      <div className="mb-24">
        {allData.map((allData) => (
          <div
            className="d-flex flex-column gap-24 flex-lg-row py-lg-40 topic-border-img"
            key={allData.id}
          >
            <div className="overflow-hidden topic-img-frame">
              <img src={allData.imgUrl} alt={allData.title} />
            </div>
            <div className="w-100">
              <a href={allData.url} className="h3 mb-8 text-decoration-none">
                {allData.title}
              </a>
              <div className="d-flex gap-8 py-8 mb-8">
                {allData.hashtags.map((e) => (
                  <span className="bg-primary-200 font-weight-bold py-4 px-8 round-4" key={e}>
                    {e}
                  </span>
                ))}
              </div>
              <div className="d-lg-flex justify-content-between">
                <div className="d-flex align-items-center gap-8 py-4 mb-8 mb-lg-0 text-gray-800">
                  <span>{allData.createdAt.split('T')[0]}</span>
                  <span className="border-start border-gray-800" style={{ height: '16px' }}></span>
                  <span>來源： {allData.user.name}</span>
                </div>
                <a href="#" className="d-flex gap-8 py-8 link-dark text-decoration-none me-8">
                  <MessageCircleMore />
                  <span className="text-end">{allData.likeCount}</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <a
          href="#"
          className="text-decoration-none font-zh-tw link-primary"
          onClick={topicLoadingMore}
        >
          查看更多
        </a>
      </div>
    </div>
  );
}
