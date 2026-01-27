import { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageCircleMore } from 'lucide-react';

export default function TopicTaiwanStock() {
  const topicUrl = import.meta.env.VITE_TopicUrl;
  const [taiwanStockData, setTaiwanStockData] = useState([]);
  useEffect(() => {
    console.log('當前 Topic URL:', topicUrl);
    const fetchTopicData = async () => {
      try {
        const res = await axios.get(
          `${topicUrl}?_expand=user&category=台股盤勢&_sort=id&_order=desc&_page=1&_limit=5`
        );
        console.log('取得資料成功:', res.data);
        setTaiwanStockData(res.data.data);
      } catch (err) {
        console.error('API 錯誤:', err);
      }
    };
    fetchTopicData();
  }, []);

  return (
    <div>
      <div className="mb-24">
        {taiwanStockData.map((taiwanStockData) => (
          <div
            className="d-flex flex-column gap-24 flex-lg-row py-lg-40 topic-border-img"
            key={taiwanStockData.id}
          >
            <div className="overflow-hidden topic-img-frame">
              <img src={taiwanStockData.imgUrl} alt={taiwanStockData.title} />
            </div>
            <div className="w-100">
              <a href={taiwanStockData.url} className="h3 mb-8 text-decoration-none">
                {taiwanStockData.title}
              </a>
              <div className="d-flex gap-8 py-8 mb-8">
                {taiwanStockData.hashtags.map((e) => (
                  <span className="bg-primary-200 font-weight-bold py-4 px-8 round-4" key={e}>
                    {e}
                  </span>
                ))}
              </div>
              <div className="d-lg-flex justify-content-between">
                <div className="d-flex align-items-center gap-8 py-4 mb-8 mb-lg-0 text-gray-800">
                  <span>{taiwanStockData.createdAt.split('T')[0]}</span>
                  <span className="border-start border-gray-800" style={{ height: '16px' }}></span>
                  <span>來源： {taiwanStockData.user.name}</span>
                </div>
                <a href="#" className="d-flex gap-8 py-8 link-dark text-decoration-none me-8">
                  <MessageCircleMore />
                  <span className="text-end">{taiwanStockData.likeCount}</span>
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
