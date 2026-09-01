# React + Vite

目前已建立的專案先以Vite+React (JS+React-complier) + SCSS + Bootstrap + ECharts + Axios + gh-pages+JSON Server為優先,後續若有需要新增Router再修改.
JSX我先放在public中

## 指令
npm install - 安裝套件(初始導入請先安裝套件)
npm run dev - 開發模式
npm run build - 建置模式
npm run preview - 預覽模式
npm run deploy - 部署GH-PAGES模式
npm run server - 開啟JSON Server模式
npm run cleat - 清除所有運行中的PID

## JSON Server - 開發用
目前先將測試練習用的json檔放在db.json中,可以使用 npm run server 啟動
啟動後開啟連結http://localhost:3000內有資料,可以供大家進行練習
相關指令請到這裡閱讀https://github.com/typicode/json-server/tree/v0?tab=readme-ov-file

依據股票代碼,建立相關聯price http://localhost:3000/symbols/?id=2330&_embed=prices
依據股票代碼,依日期降冪 http://localhost:3000/prices?symbolId=2330&_expand=symbol&_sort=date&_order=desc

server.cjs => 所有使用者權限以及佈署json-server的程式碼
db.json => 統合版用來測試的整體檔案存放
dbjson_schema.md => 檔案裡面是db.json內針對資料的說明

## JSON Server - 部署用
已經將json server部署到Render上,連結為,後面請參考原本http://localhost:3000/後面的路徑
https://haogoo.onrender.com/

注意:Render免費方案15分鐘無流量會休眠,下一次請求會有冷啟動延遲;且容器檔案系統非持久化,執行期間的寫入(註冊/發文/留言/收藏等)在重新部署後會重置回db.json的git版本。

## SCSS
Bootstrap客製化項目請到src/scss/_variables.scss && _custom_utils.scss進行修改
其餘相關css可放在src/scss/內,並利用all.scss進行匯入

## Design Guideline
設計稿共用元件網頁內容為src/components/Guideline.jsx
可示化-可用npm run dev看guideline的文件內容

## Icon請使用Lucide
https://lucide.dev/guide/packages/lucide-react

## 測試用程式
test.js => 測試機- 自動註冊帳號,新增收藏清單,驗證讀取,存取別人資料
test_fin01.js => 測試機- 讀取產業,計算每一檔的60日平均收盤價,再計算平均
