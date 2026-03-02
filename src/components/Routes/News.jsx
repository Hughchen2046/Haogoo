export default function News() {
  return <>
  <div className="container mt-80 py-16">
    {/* 麵包屑 */}
  <nav style=  {{
      "--bs-breadcrumb-divider":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E\")",
    }}
   aria-label="breadcrumb">
  <ol className="breadcrumb">
    <li className="breadcrumb-item"><a href="#">首頁</a></li>
    <li className="breadcrumb-item" aria-current="page">熱門話題</li>
    <li className="breadcrumb-item active" aria-current="page">全部話題</li>
  </ol>
</nav>
{/* hashtag */}
<div className="my-3">
  <a href="#" className="caption text-primary me-2 round-96 border p-8 text-decoration-none">#台股</a>
  <a href="#" className="caption text-primary round-96 border p-8 text-decoration-none">#大立光</a>
</div>

<h1 className="text-primary fw-bold mb-20">大立光擬買回2670張庫藏股　總金額上限1796億創新高</h1>
<h6 className="text-primary-500">2025/12/19 16:28</h6>

{/* image */}
<div className="mt-20 card rounded-0 border-0 shadow-none">
  <img src="https://imgcdn.cna.com.tw/www/WebPhotos/1024/20251219/1200x900_wmky_400546680822_202506060007000000.jpg" className="card-img-top rounded-0" alt="..."/>
  <div className="card-body rounded-0 px-0">
    <p className="card-text text-gray-800">大立光擬買回2670張庫藏股　總金額上限1796億創新高
2025/12/19 16:28（12/19 16:43 更新）
圖為光學鏡頭廠大立光舉行股東常會，由董事長林恩平（右）主持，左為總經理黃有執。 （中央社檔案照片）</p>
  </div>
</div>
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

    </div> 

  </>;
}
