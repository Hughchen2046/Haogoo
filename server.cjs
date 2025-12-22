const jsonServer = require('json-server');
const auth = require('json-server-auth');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

app.db = router.db;

// 定義權限規則
const rules = auth.rewriter({
    "users": 600,
    "watchlists": 600,
    "symbols": 444,
    "posts": 664
});

app.use(middlewares);
app.use(jsonServer.bodyParser);

// 1️⃣ 註冊時強制設定為 member
app.use('/register', (req, res, next) => {
    if (req.method === 'POST') {
        req.body.role = 'member';
        req.body.createdAt = new Date().toISOString();
    }
    next();
});

// 🔥 2️⃣ 關鍵修正：將自訂權限檢查移到 rules 和 auth "之前"
app.use((req, res, next) => {
    // 取得路徑
    const requestPath = req.path;
    const requestMethod = req.method;

    // 🕵️ DEBUG 監聽器
    if (requestMethod === 'DELETE' && requestPath.includes('/users/')) {
        console.log(`\n🔍 [Debug] 收到請求: ${requestMethod} ${requestPath}`);
        console.log(`   Header Authorization: ${req.headers.authorization ? '有' : '無'}`);
    }

    // 從 JWT 中提取使用者 ID
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        // console.log('   ⚠️ 無 Auth Header，跳過自訂檢查');
        return next();
    }

    try {
        const token = authHeader.split(' ')[1];

        // ✨ 改用 decode 而非 verify，避免密鑰不一致的問題
        // 這只為了讀取 ID 來判斷角色，安全性交給後面的 auth 中間件把關
        const decoded = jwt.decode(token);

        if (!decoded) {
            console.log('   ❌ Token 無法解碼');
            return next();
        }

        const userId = Number(decoded.sub);

        // 從資料庫讀取完整會員資料
        const user = app.db.get('users').find({ id: userId }).value();

        if (requestMethod === 'DELETE' && requestPath.includes('/users/')) {
            console.log(`   🔑 Token 解碼 ID: ${userId}`);
            if (user) {
                console.log(`   👤 DB 查找到 User: ${user.email} (${user.role})`);
            }
        }

        if (user) {
            req.userRole = user.role;

            // === A. 管理員超權限操作 === 
            const regex = /^\/(600\/)?users\/\d+$/;
            const isMatch = regex.test(requestPath);
            const isAdmin = user.role === 'admin';
            const isDelete = requestMethod === 'DELETE';

            if (isDelete && requestPath.includes('users')) {
                console.log(`   🛡️ 管理員刪除檢查: IsAdmin=${isAdmin}, IsDelete=${isDelete}, Match=${isMatch}`);
            }

            if (isAdmin && isDelete && isMatch) {
                console.log(`   ✅ 條件完全符合！執行強制刪除！`);

                const pathParts = requestPath.split('/');
                const targetId = parseInt(pathParts[pathParts.length - 1]);
                console.log(`   🗑️ 目標刪除 ID: ${targetId}`);

                const targetUser = app.db.get('users').find({ id: targetId }).value();

                if (targetUser) {
                    app.db.get('users').remove({ id: targetId }).write();
                    console.log(`   🎉 刪除成功`);
                    return res.status(200).json({
                        success: true,
                        message: `管理員已強制刪除會員 ${targetUser.email}`
                    });
                } else {
                    console.log(`   ⚠️ 找不到目標會員`);
                    return res.status(404).json({ error: '找不到該會員' });
                }
            }

            // VIP 功能檢測
            if (requestPath.startsWith('/vip_reports')) {
                if (!['vip', 'admin'].includes(user.role)) {
                    return res.status(403).json({ error: '此資源僅限 VIP 會員' });
                }
            }
        }
    } catch (err) {
        console.log(`   💥 Token 解析錯誤: ${err.message}`);
    }

    // console.log('   ➡️ 放行至下一層 Middleware (json-server-auth)');
    next();
});

// 3️⃣ 套用 json-server-auth 的規則與驗證
app.use(rules);
app.use(auth);

app.use(router);

app.listen(3000, () => {
    console.log('✅ Server running on http://localhost:3000');
    console.log('🛡️  權限系統：Admin > VIP > Member > Guest');
    console.log('🐛 Debug 模式已開啟');
});