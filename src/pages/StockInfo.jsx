import { useState , useEffect } from "react"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function StockInfo() {
 return ( 
  <>
  <body class="pt-5">
  <div className="container mt-5 mt-md-6 pt-5 mb-5">
  <div className="card bg-light shadow-sm rounded-4 stockInfoCard">
    <div className="card-body">
      <h3 className="card-title mb-1 ">元大高股息</h3>
      <h6 className="card-subtitle d-flex text-muted mb-3">0056</h6>

      <h2 className="fw-light">36.59</h2>
      <p>2026/01/01 14:30 更新 | 總量22.124張</p>
    </div>
  </div>
</div>
<div class="dropdown d-grid">
  <button class="btn btn-secondary btn-lg dropdown-toggle w-100 w-md-auto" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    股價走勢
  </button>
  <ul class="dropdown-menu w-100">
    <li><a class="dropdown-item" href="#">股利政策</a></li>
    <li><a class="dropdown-item" href="#">股價K線</a></li>
  </ul>
</div>



</body>

</>
 )
}
