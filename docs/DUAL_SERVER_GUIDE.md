# 雙 Server 架構說明

## 📋 概述

`server.cjs` 現在同時運行兩個獨立的 Express server：

### Server 1 (Port 3000)

- **資料庫**: `db.json`
- **功能**: 主要的 API server，包含認證、權限管理、TWSE/FinMind 代理等
- **URL**: `http://localhost:3000`

### Server 2 (Port 3001)

- **資料庫**: `db1.json`
- **功能**: 獨立的測試/開發 server，可自由使用
- **URL**: `http://localhost:3001`

---

## 🚀 啟動方式

### 同時啟動兩個 Server

```bash
npm run server
```

**Console 輸出**：

```
Server running on port 3000
權限：Admin > VIP > Member > Guest

🚀 Second Server running on port 3001
   使用資料庫: db1.json
   測試路由: http://localhost:3001/api/test
```

---

## 🎯 Server 2 使用方式

### 1. 測試路由

```javascript
// 測試 Server 2 是否正常運行
axios.get('http://localhost:3001/api/test')
  .then(res => console.log(res.data));

// 回應：
{
  "success": true,
  "code": 200,
  "message": "這是第二個 Server (Port 3001)",
  "data": {
    "server": "Server 2",
    "port": 3001
  }
}
```

### 2. JSON Server RESTful API

Server 2 使用 `db1.json`，支援完整的 RESTful API：

#### GET - 取得所有資料

```javascript
axios.get('http://localhost:3001/testData')
// 回應：
{
  "success": true,
  "code": 200,
  "message": "成功",
  "data": [
    { "id": 1, "name": "測試資料 1", "value": 100 },
    { "id": 2, "name": "測試資料 2", "value": 200 }
  ]
}
```

#### GET - 取得單筆資料

```javascript
axios.get('http://localhost:3001/testData/1')
// 回應：
{
  "success": true,
  "code": 200,
  "message": "成功",
  "data": { "id": 1, "name": "測試資料 1", "value": 100 }
}
```

#### POST - 新增資料

```javascript
axios.post('http://localhost:3001/testData', {
  name: '新資料',
  value: 300,
});
```

#### PUT - 更新資料

```javascript
axios.put('http://localhost:3001/testData/1', {
  id: 1,
  name: '更新後的資料',
  value: 150,
});
```

#### PATCH - 部分更新

```javascript
axios.patch('http://localhost:3001/testData/1', {
  value: 999,
});
```

#### DELETE - 刪除資料

```javascript
axios.delete('http://localhost:3001/testData/1');
```

---

## 📦 db1.json 結構

```json
{
  "testData": [
    {
      "id": 1,
      "name": "測試資料 1",
      "value": 100
    }
  ],
  "stocks": [
    {
      "id": "0056",
      "name": "元大高股息",
      "price": 35.5
    }
  ]
}
```

### 新增自訂資料表

直接在 `db1.json` 中新增：

```json
{
  "testData": [...],
  "stocks": [...],
  "myCustomData": [
    { "id": 1, "field": "value" }
  ]
}
```

然後就可以透過 `http://localhost:3001/myCustomData` 存取。

---

## 🔧 自訂 Server 2

### 新增自訂路由

在 `server.cjs` 的 Server 2 區塊中新增：

```javascript
// 範例：新增股票查詢路由
app1.get('/api/stock/:id', (req, res) => {
  const stockId = req.params.id;
  const stock = app1.db.get('stocks').find({ id: stockId }).value();

  if (stock) {
    res.json({
      success: true,
      code: 200,
      message: '成功',
      data: stock,
    });
  } else {
    res.status(404).json({
      success: false,
      code: 404,
      message: '找不到該股票',
      data: null,
    });
  }
});
```

### 新增中間件

```javascript
// 範例：記錄所有請求
app1.use((req, res, next) => {
  console.log(`[Server 2] ${req.method} ${req.path}`);
  next();
});
```

---

## 🎨 使用場景

### Server 1 (Port 3000)

- ✅ 生產環境的主要 API
- ✅ 需要認證和權限管理的功能
- ✅ TWSE/FinMind 代理
- ✅ 使用者管理、貼文、留言等

### Server 2 (Port 3001)

- ✅ 開發測試用途
- ✅ 原型設計和實驗
- ✅ 不需要認證的簡單 API
- ✅ 臨時資料儲存
- ✅ 批次資料處理（如股利資料）

---

## ⚙️ 前端配置

### 使用環境變數

```javascript
// .env
VITE_API_BASE=http://localhost:3000
VITE_API_BASE_2=http://localhost:3001
```

### 在組件中使用

```javascript
const API_BASE_1 = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_BASE_2 = import.meta.env.VITE_API_BASE_2 || 'http://localhost:3001';

// 使用 Server 1
axios.get(`${API_BASE_1}/posts`);

// 使用 Server 2
axios.get(`${API_BASE_2}/testData`);
```

---

## 🔍 除錯

### 檢查 Server 是否運行

```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# 或直接在瀏覽器訪問
http://localhost:3000
http://localhost:3001/api/test
```

### 查看 Server 2 的資料

```
http://localhost:3001/testData
http://localhost:3001/stocks
```

---

## ⚠️ 注意事項

1. **Port 衝突**: 確保 3000 和 3001 都沒有被其他程式佔用
2. **資料獨立**: `db.json` 和 `db1.json` 是完全獨立的
3. **同步啟動**: 兩個 server 會在同一個 `npm run server` 命令中啟動
4. **停止服務**: `Ctrl + C` 會同時停止兩個 server

---

## 📚 相關資源

- [JSON Server 官方文檔](https://github.com/typicode/json-server)
- [Express 官方文檔](https://expressjs.com/)
