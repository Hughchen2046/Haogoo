const jsonServer = require('json-server');
const auth = require('json-server-auth');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

app.db = router.db;

// 定義權限規則 [自己][會員][非會員] , 6讀寫 4讀 0無權限
const rules = auth.rewriter({
    "users": 600,       // 只有自己可讀寫
    "watchlists": 600,  // 只有自己可讀寫
    "symbols": 444,     // 所有人可讀
    "prices": 444,      // 所有人可讀
    "posts": 644,       // 登入可寫，所有人可讀
    "comments": 644,    // 登入可寫，所有人可讀
    "likes": 600        // 只有自己可讀寫
});

app.use(middlewares);
app.use(jsonServer.bodyParser);

// 註冊時設定為 member
app.use('/register', (req, res, next) => {
    if (req.method === 'POST') {
        req.body.role = 'member';
        req.body.createdAt = new Date().toISOString();
    }
    next();
});

app.use((req, res, next) => {
    // 取得路徑
    const requestPath = req.path;
    const requestMethod = req.method;

    // DEBUG 監聽
    // if (requestMethod === 'DELETE' && requestPath.includes('/users/')) {
    //     console.log(`\n🔍 [Debug] 收到請求: ${requestMethod} ${requestPath}`);
    //     console.log(`   Header Authorization: ${req.headers.authorization ? '有' : '無'}`);
    // }

    // 從 JWT 中提取authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next();
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.decode(token);

        if (!decoded) {
            console.log('❌ AccessToken 無法解碼');
            return next();
        }

        const userId = Number(decoded.sub);

        const user = app.db.get('users').find({ id: userId }).value();

        if (requestMethod === 'DELETE' && requestPath.includes('/users/')) {
            console.log(`Token 對應 ID: ${userId}`);
            if (user) {
                console.log(`User身份: ${user.email} (${user.role})`);
            }
        }

        if (user) {
            req.userRole = user.role;
            const isAdmin = user.role === 'admin';

            // --- [Admin] GM mode ---
            if (isAdmin) {
                // 解析路徑，過濾掉權限數字 (如 600, 664) 取得真實資源名稱與 ID
                const pathParts = requestPath.split('/').filter(p => p !== '' && !/^\d{3}$/.test(p));
                const resource = pathParts[0]; // users, posts, comments...
                const targetId = parseInt(pathParts[1]);

                // 1. 管理員通用刪除 (刪除任何資源)
                if (requestMethod === 'DELETE' && !isNaN(targetId)) {
                    const collection = app.db.get(resource);
                    const targetData = collection.find({ id: targetId }).value();

                    if (targetData) {
                        collection.remove({ id: targetId }).write();
                        console.log(`\n👑 [Admin] 已強制刪除: ${resource} ID ${targetId}`);
                        return res.status(200).json({
                            success: true,
                            code: 200,
                            message: `[Admin] 已成功刪除 ${resource} ID: ${targetId}`,
                            data: targetData
                        });
                    }
                }

                // 2. 管理員更新使用者資料 (更新密碼、Role、個人檔案)
                if (requestMethod === 'PATCH' && resource === 'users' && !isNaN(targetId)) {
                    const targetUser = app.db.get('users').find({ id: targetId }).value();
                    if (targetUser) {
                        // 執行更新
                        app.db.get('users').find({ id: targetId }).assign(req.body).write();
                        const updatedUser = app.db.get('users').find({ id: targetId }).value();

                        console.log(`\n👑 [Admin] 已強制更新使用者: ${targetUser.email}`);
                        return res.status(200).json({
                            success: true,
                            code: 200,
                            message: `[Admin] 已成功更新使用者: ${targetUser.email}`,
                            data: updatedUser
                        });
                    }
                }
            }
            // --- [Admin End] ---

            // VIP 功能檢測
            if (requestPath.startsWith('/vip_reports')) {
                if (!['vip', 'admin'].includes(user.role)) {
                    return res.status(403).json({
                        success: false,
                        code: 403,
                        message: '此功能僅限 VIP 會員',
                        data: null
                    });
                }
            }
        }
    } catch (err) {
        console.log(`Token 錯誤: ${err.message}`);
    }
    next();
});

// json-server-auth 規則驗證
app.use(rules);
// 解決 json-server-auth 不經過 router.render 的問題 (必須放在 app.use(auth) 之前)
app.use(['/login', '/register'], (req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
            try {
                // 如果 body 是字串，嘗試解析它
                let data = typeof body === 'string' ? JSON.parse(body) : body;

                // 檢查是否已經被封裝過
                if (data && !data.hasOwnProperty('success')) {
                    const formattedBody = {
                        success: true,
                        code: res.statusCode,
                        message: 'OK',
                        data: data
                    };
                    // 重新設定 Content-Length 避免傳輸錯誤
                    res.set('Content-Length', Buffer.byteLength(JSON.stringify(formattedBody)));
                    return originalSend.call(this, JSON.stringify(formattedBody));
                }
            } catch (e) {
                // 解析失敗則維持原樣
            }
        }
        return originalSend.call(this, body);
    };
    next();
});

app.use(auth);

// 針對不同 API 設定不同的回應格式，並統一錯誤處理
router.render = (req, res) => {
    const path = req.path;
    const statusCode = res.statusCode;
    const data = res.locals.data;
    const isError = statusCode >= 400;

    // 定義基礎格式
    let response = {
        success: !isError,
        code: statusCode,
        message: isError ? (data?.error || data?.message || 'Request failed') : 'OK',
        data: data || null
    };

    // --- 針對不同 API 路徑進行自定義 (客製化邏輯區) ---

    // 範例：針對 /users 的 API 回傳額外 meta 資訊
    if (path.startsWith('/users')) {
        response.apiType = 'USER_MANAGEMENT';
    }

    // 範例：針對 /prices 的 API (僅供讀取)
    if (path.startsWith('/prices') && req.method === 'GET') {
        response.timestamp = Date.now();
    }

    // 範例：針對 Auth (登入/註冊) 可能有的特殊結構
    if (path.includes('login') || path.includes('register')) {
        response.authStatus = isError ? 'failed' : 'success';
    }

    // --- 統一錯誤處理補充 ---
    if (isError) {
        // 如果是 404
        if (statusCode === 404 && (!data || Object.keys(data).length === 0)) {
            response.message = '找不到該資源 (Resource Not Found)';
        }
        // 如果是權限錯誤 (401/403)
        if (statusCode === 401) response.message = '尚未登入或 Token 過期';
        if (statusCode === 403) response.message = '權限不足，拒絕存取';

        // 錯誤時 data 通常是錯誤訊息字串或物件，我們統一格式
        response.data = null;
        response.errors = data; // 將原始錯誤資訊放進 errors 欄位
    }

    res.jsonp(response);
};

app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('權限：Admin > VIP > Member > Guest');
});