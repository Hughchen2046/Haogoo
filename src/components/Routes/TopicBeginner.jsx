import { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageCircleMore } from 'lucide-react';

export default function TopicBeginner() {
  const topicUrl = import.meta.env.VITE_TopicUrl;
  const [beginData, setBeginData] = useState([]);
  useEffect(() => {
    console.log('當前 Topic URL:', topicUrl);
    const fetchTopicData = async () => {
      try {
        const res = await axios.get(`${topicUrl}?_expand=user&category=新手村秘笈`);
        console.log('取得資料成功:', res.data);
        setBeginData(res.data);
      } catch (err) {
        console.error('API 錯誤:', err);
      }
    };
    fetchTopicData();
  }, []);

  return (
    <div>
      <div className="mb-24">
        {beginData.map((beginData) => (
          <div
            className="d-flex flex-column gap-24 flex-lg-row py-lg-40 topic-border-img"
            key={beginData.id}
          >
            <div className="overflow-hidden topic-img-frame">
              <img src={beginData.imgUrl} alt={beginData.title} />
            </div>
            <div className="w-100">
              <a href={beginData.url} className="h3 mb-8 text-decoration-none">
                {beginData.title}
              </a>
              <div className="d-flex gap-8 py-8 mb-8">
                {beginData.hashtags.map((e) => (
                  <span className="bg-primary-200 font-weight-bold py-4 px-8 round-4" key={e}>
                    {e}
                  </span>
                ))}
              </div>
              <div className="d-lg-flex justify-content-between">
                <div className="d-flex align-items-center gap-8 py-4 mb-8 mb-lg-0 text-gray-800">
                  <span>{beginData.createdAt.split('T')[0]}</span>
                  <span className="border-start border-gray-800" style={{ height: '16px' }}></span>
                  <span>來源： {beginData.user.name}</span>
                </div>
                <a href="#" className="d-flex gap-8 py-8 link-dark text-decoration-none me-8">
                  <MessageCircleMore />
                  <span className="text-end">{beginData.commentCount}</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">查看更多</div>
    </div>
  );
}
