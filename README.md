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

## JSON Server
目前先將測試練習用的json檔放在db.json中,可以使用 npm run server 啟動
啟動後開啟連結http://localhost:3000內有資料,可以供大家進行練習
相關指令請到這裡閱讀https://github.com/typicode/json-server/tree/v0?tab=readme-ov-file

依據股票代碼,建立相關聯price http://localhost:3000/symbols/?id=2330&_embed=prices
依據股票代碼,依日期降冪 http://localhost:3000/prices?symbolId=2330&_expand=symbol&_sort=date&_order=desc

server.cjs => 所有使用者權限以及佈署json-server的程式碼
db.json => 統合版用來測試的整體檔案存放
dbjson_schema.md => 檔案裡面是db.json內針對資料的說明

## SCSS
Bootstrap客製化項目請到src/scss/_variables.scss進行修改
其餘相關css可放在src/scss/內,並利用all.scss進行匯入

## Design Guideline
設計稿共用元件網頁內容為src/components/Guideline.jsx,客製化請到src/scss/_custom_utils.scss進行修改

## 測試用程式
test.js => 測試機- 自動註冊帳號,新增收藏清單,驗證讀取,存取別人資料
test_fin01.js => 測試機- 讀取產業,計算每一檔的60日平均收盤價,再計算平均

## 作業練習規範
請大家先以 dev版本進行複製,自行命名分支名稱,可以用dev_你的名字(版本版次)或是dev_你的主題...等等方式.
請先使用npm run dev進行測試,若有需要再deploy上去gh-pages測試~~~

