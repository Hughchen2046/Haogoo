# React + Vite

目前已建立的專案先以Vite+React (JS+React-complier) + SCSS + Bootstrap + ECharts + Axios + gh-pages+JSON Server為優先,後續若有需要新增Router再修改.
CSS請在assets/all.scss中進行設定
JSX我先放在public中

## 指令
npm install - 安裝套件(初始導入請先安裝套件)
npm run dev - 開發模式
npm run build - 建置模式
npm run preview - 預覽模式
npm run deploy - 部署GH-PAGES模式
npm run server - JSON Server模式

## JSON Server
目前先將測試練習用的json檔放在db.json中,可以使用 npm run server 啟動
啟動後開啟連結http://localhost:3000/symbols內有資料,可以供大家進行練習
相關指令請到這裡閱讀https://github.com/typicode/json-server/tree/v0?tab=readme-ov-file

## 作業練習規範
請大家先以 dev版本進行複製,自行命名分支名稱,可以用dev_你的名字(版本版次)或是dev_你的主題...等等方式.
請先使用npm run dev進行測試,若有需要再deploy上去gh-pages測試~~~


## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
