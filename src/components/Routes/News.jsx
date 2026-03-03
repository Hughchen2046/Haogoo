import * as bootstrap from 'bootstrap';
import CommentCard from './CommentCard';
import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  User,
  ThumbsUp,
  MessageCircle,
  Share2,
  ChevronRight,
  MessageSquareText,
} from 'lucide-react';

const usersRaw = {
  /* 24 位用戶 JSON */
};
const commentsRaw = {
  /* 評論 JSON */
};
export default function News() {
  // 目前main.jsx已經設定導航到news/:postId => 到時候網頁上要輸入 http://localhost:5173/#/news/1 才會看到news的內容.
  // postId的資料會由上層Topics導航中的動態路由參數帶入 state={{ postId: allData.id, catagory: currentTopic.label }}
  const location = useLocation();
  const { postId, catagory } = location.state || {};
  console.log('從路由參數獲取的 postId:', postId);
  console.log('從路由參數獲取的 catagory:', catagory);

  // 1. 確保資料來源存在，使用 Optional Chaining (?.) 避免讀取不到 data 噴錯
  const userLookup =
    usersRaw?.data?.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {}) || {}; // 如果沒有資料，就給一個空物件

  // 2. 渲染評論列表時，也要確保 commentsRaw.data 存在
  const commentList = commentsRaw?.data || [];

  useEffect(() => {
    // 取得頁面上所有帶有 data-bs-toggle="popover" 的元素
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');

    // 初始化每一個 Popover
    const popoverList = [...popoverTriggerList].map(
      (popoverTriggerEl) =>
        new bootstrap.Popover(popoverTriggerEl, {
          trigger: 'focus', // 建議設為 focus 或 click，使用者體驗較好
        })
    );

    // 組件卸載時銷毀 Popover，防止記憶體洩漏
    return () => {
      popoverList.forEach((popover) => popover.dispose());
    };
  }, []);

  return (
    <>
      <div className="container mt-80 py-16">
        {/* 麵包屑 */}
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
            <li>
              <NavLink className="text-decoration-none text-gray-800" to="/topics">
                熱門話題
              </NavLink>
            </li>
            <li>
              <ChevronRight width={16} height={16} className="text-gray-800" />
            </li>
            <li className="text-dark">全部話題</li>
          </ul>
        </nav>
        {/* hashtag跟分享連結 */}
        <div className="d-flex justify-content-between my-3">
          <div>
            <a
              href="#"
              className="caption text-primary me-2 round-96 border p-8 text-decoration-none"
            >
              #台股
            </a>
            <a href="#" className="caption text-primary round-96 border p-8 text-decoration-none">
              #大立光
            </a>
          </div>

          <button
            type="button"
            className="btn btn-link p-0 text-danger border-0"
            data-bs-container="body"
            data-bs-toggle="popover"
            data-bs-placement="top"
            data-bs-content="分享文章連結"
          >
            <Share2 size={30} strokeWidth={2} />
          </button>
        </div>

        <h1 className="text-primary-200 fw-bold mb-20">
          大立光擬買回2670張庫藏股　總金額上限1796億創新高
        </h1>
        <h6 className="text-primary-500">2025/12/19 16:28</h6>

        {/* image */}
        <div className="mt-20 card rounded-0 border-0 shadow-none">
          <img
            src="https://imgcdn.cna.com.tw/www/WebPhotos/1024/20251219/1200x900_wmky_400546680822_202506060007000000.jpg"
            className="card-img-top rounded-0"
            alt="..."
          />
          <div className="card-body rounded-0 px-0">
            <p className="card-text text-gray-800">
              大立光擬買回2670張庫藏股　總金額上限1796億創新高 2025/12/19 16:28（12/19 16:43 更新）
              圖為光學鏡頭廠大立光舉行股東常會，由董事長林恩平（右）主持，左為總經理黃有執。
              （中央社檔案照片）
            </p>
          </div>
        </div>
        <hr
          className="border border-primary-200 opacity-75 my-5"
          style={{ borderTop: '3px solid' }}
        />
        {/* 內文 */}
        <p className="fw-light text-break">（中央社記者江明晏台北19日）</p>
        <p className="fw-light text-break">
          電光學股大立光今天公告，董事會決議通過實施庫藏股，總金額上限高達新台幣1796億元，至明年2月11日前預定買回數量為2670張，為台股史上最高價庫藏股護盤上限金額，不過實際實施狀況仍待觀察。
        </p>
        <p className="fw-light text-break">
          大立光今天公告，董事會決議通過買回公司股份，買回目的是維護公司信用及股東權益，買回股份總金額上限1796億6524萬6732元，預定買回期間為今天起至明年2月11日，預定買回數量為2670張，買回區間價格1600元至3200元；股價低於區間價格下限，將繼續買回。
        </p>
        <p className="fw-light text-break">
          大立光說明，預定買回股份占公司已發行股份總數比率為2%，3年內並無買回公司股份的情形。
        </p>
        <p className="fw-light text-break">
          大立光首次買回庫藏股為2021年10月底，當時為維護股價，發動台股史上最高價庫藏股護盤，預定買回股份金額上限喊出1312.99億元，規模震驚市場；不過12月24日護盤期間屆滿，大立光公告實際買回672張自家股票，實際護盤投入資金約14.01億元。
        </p>
        <p className="fw-light text-break">（編輯：張良知）1141219</p>

        <hr
          className="border border-primary-200 opacity-75 my-5"
          style={{ borderTop: '3px solid' }}
        />
        {/* 評論列表渲染 */}
        <h1 className="text-primary-200 fw-bold mb-20">看看其他人怎麼說...</h1>

        <div className="d-flex align-items-center justify-content-between py-2">
          <div className="d-flex align-items-center gap-12">
            <div className="d-flex align-items-center text-dark fw-bold cursor-pointer">
              <MessageSquareText size={20} className="me-2" />
              <span>
                貼文 <span className="fw-bold">(4)</span>
              </span>
            </div>
            <div className="text-secondary fw-bold cursor-pointer hover-dark">熱門</div>

            <div className="text-secondary fw-bold cursor-pointer hover-dark">最新</div>
          </div>

          <div>
            <a href="#" className="text-primary fw-bold text-decoration-underline">
              登入留言
            </a>
          </div>
        </div>
        {/* 用戶評論區 */}
        <div className="d-flex gap-12">
          <div className="d-flex">
            <div className="card border-bottom round-12 py-3" style={{ maxWidth: '600px' }}>
              <div className="card-body p-0">
                <div className="d-flex p-12">
                  <div className="flex-shrink-0">
                    <div
                      className="rounded-circle border d-flex align-items-center justify-content-center bg-white overflow-hidden"
                      style={{
                        width: '128px',
                        height: '128px',
                      }}
                    >
                      <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="user1"
                        className="img-fluid rounded-circle"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover', // 防止圖片拉伸變形，自動按比例裁切
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-grow-1 ms-3">
                    <div className="mb-2">
                      <h5 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '1px' }}>
                        饕饕
                      </h5>
                      <small className="text-muted" style={{ fontSize: '12px' }}>
                        12月19日 發布
                      </small>
                    </div>

                    <div className="post-content mb-3">
                      <p className="mb-0 text-dark h5" style={{ lineHeight: '1.4' }}>
                        一萬真的不多，但用對地方確實有機會翻身，關鍵是不要亂跟風。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 下方icon */}
                <div className="d-flex align-items-center gap-12 mt-4 p-12">
                  <button className="btn btn-link p-0 text-dark border-0">
                    <ThumbsUp size={22} strokeWidth={2} />
                  </button>
                  <button className="btn btn-link p-0 text-dark border-0">
                    <MessageCircle size={22} strokeWidth={2} />
                  </button>
                  <button className="btn btn-link p-0 text-dark border-0">
                    <Share2 size={22} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex">
            <div className="card border-bottom round-12 py-3" style={{ maxWidth: '600px' }}>
              <div className="card-body p-0">
                <div className="d-flex p-12">
                  <div className="flex-shrink-0">
                    <div
                      className="rounded-circle border d-flex align-items-center justify-content-center bg-white overflow-hidden"
                      style={{
                        width: '128px',
                        height: '128px',
                      }}
                    >
                      <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="user1"
                        className="img-fluid rounded-circle"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover', // 防止圖片拉伸變形，自動按比例裁切
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-grow-1 ms-3">
                    <div className="mb-2">
                      <h5 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '1px' }}>
                        混沌
                      </h5>
                      <small className="text-muted" style={{ fontSize: '12px' }}>
                        12月20日 發布
                      </small>
                    </div>

                    <div className="post-content mb-3">
                      <p className="mb-0 text-dark h5" style={{ lineHeight: '1.4' }}>
                        講​得​好​像​很​簡單，​但​大部分​人​一​萬​放哪​都​會心痛，​心理​層面​才​是​難點​
                      </p>
                    </div>
                  </div>
                </div>

                {/* 下方icon */}
                <div className="d-flex align-items-center gap-12 mt-4 p-12">
                  <button className="btn btn-link p-0 text-dark border-0">
                    <ThumbsUp size={22} strokeWidth={2} />
                  </button>
                  <button className="btn btn-link p-0 text-dark border-0">
                    <MessageCircle size={22} strokeWidth={2} />
                  </button>
                  <button className="btn btn-link p-0 text-dark border-0">
                    <Share2 size={22} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex">
            <div className="card border-bottom round-12 py-3" style={{ maxWidth: '600px' }}>
              <div className="card-body p-0">
                <div className="d-flex p-12">
                  <div className="flex-shrink-0">
                    <div
                      className="rounded-circle border d-flex align-items-center justify-content-center bg-white overflow-hidden"
                      style={{
                        width: '128px',
                        height: '128px',
                      }}
                    >
                      <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="user1"
                        className="img-fluid rounded-circle"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover', // 防止圖片拉伸變形，自動按比例裁切
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-grow-1 ms-3">
                    <div className="mb-2">
                      <h5 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '1px' }}>
                        檮杌
                      </h5>
                      <small className="text-muted" style={{ fontSize: '12px' }}>
                        12月19日 發布
                      </small>
                    </div>

                    <div className="post-content mb-3">
                      <p className="mb-0 text-dark h5" style={{ lineHeight: '1.4' }}>
                        重點​不​是​一​萬，​而​是​持續​投入​的​習慣​吧 ​!
                        ​一​次性​投入​很​難​看到​變化​ ...
                      </p>
                    </div>
                  </div>
                </div>

                {/* 下方icon */}
                <div className="d-flex align-items-center gap-12 mt-4 p-12">
                  <button className="btn btn-link p-0 text-dark border-0">
                    <ThumbsUp size={22} strokeWidth={2} />
                  </button>
                  <button className="btn btn-link p-0 text-dark border-0">
                    <MessageCircle size={22} strokeWidth={2} />
                  </button>
                  <button className="btn btn-link p-0 text-dark border-0">
                    <Share2 size={22} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
