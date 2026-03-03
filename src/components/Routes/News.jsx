import { User, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import { MessageSquareText } from 'lucide-react';

export default function News() {
  return (
    <>
      <div className="container mt-80 py-16">
        {/* 麵包屑 */}
        <nav
          style={{
            '--bs-breadcrumb-divider':
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E\")",
          }}
          aria-label="breadcrumb"
        >
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">首頁</a>
            </li>
            <li className="breadcrumb-item" aria-current="page">
              熱門話題
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              全部話題
            </li>
          </ol>
        </nav>
        {/* hashtag */}
        <div className="my-3">
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
        <hr className="border border-danger border-3 opacity-75" />

        {/* 內文 */}
        <p className="fw-light text-break">
          （中央社記者江明晏台北19日電）光學股大立光今天公告，董事會決議通過實施庫藏股，總金額上限高達新台幣1796億元，至明年2月11日前預定買回數量為2670張，為台股史上最高價庫藏股護盤上限金額，不過實際實施狀況仍待觀察。
        </p>
        <p className="fw-light text-break">
          大立光今天公告，董事會決議通過買回公司股份，買回目的是維護公司信用及股東權益，買回股份總金額上限1796億6524萬6732元，預定買回期間為今天起至明年2月11日，預定買回數量為2670張，買回區間價格1600元至3200元；股價低於區間價格下限，將繼續買回。
        </p>
        <p className="fw-light text-break">
          大立光說明，預定買回股份占公司已發行股份總數比率為2%，3年內並無買回公司股份的情形。
        </p>
        <p className="fw-light text-break">
          大立光首次買回庫藏股為2021年10月底，當時為維護股價，發動台股史上最高價庫藏股護盤，預定買回股份金額上限喊出1312.99億元，規模震驚市場；不過12月24日護盤期間屆滿，大立光公告實際買回672張自家股票，實際護盤投入資金約14.01億元。（編輯：張良知）1141219
        </p>

        {/* 評論區 */}
        <h1 className="text-primary-200 fw-bold mb-20">看看其他人怎麼說...</h1>

        <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
          <div className="d-flex align-items-center gap-4">
            {/* 貼文 (含 Icon) */}
            <div className="d-flex align-items-center text-dark fw-bold cursor-pointer">
              <MessageSquareText size={20} className="me-2" />
              <span>
                貼文 <span className="text-secondary fw-normal">(4)</span>
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

        <div className="card border-bottom round-12 py-3" style={{ maxWidth: '600px' }}>
          <div className="card-body p-0">
            {/* 上半部：大 Flex 容器 */}
            <div className="d-flex p-12">
              {/* 左側頭像：固定寬度 */}
              <div className="flex-shrink-0">
                <div
                  className="rounded-circle border d-flex align-items-center justify-content-center bg-white overflow-hidden" // 1. 加上 overflow-hidden
                  style={{
                    width: '128px', // 2. 核心：強制容器寬度為 128px
                    height: '128px', // 3. 核心：強制容器高度為 128px
                  }}
                >
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg" // 你的照片 URL
                    alt="user1"
                    className="img-fluid rounded-circle"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover', // 4. 關鍵：防止圖片拉伸變形，自動按比例裁切
                    }}
                  />
                </div>
              </div>
              {/* 右側內容：自適應寬度 */}
              <div className="flex-grow-1 ms-3">
                {/* 用戶資訊區 */}
                <div className="mb-2">
                  <h5 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '1px' }}>
                    饕饕
                  </h5>
                  <small className="text-muted" style={{ fontSize: '12px' }}>
                    12月05日 發布
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
    </>
  );
}
