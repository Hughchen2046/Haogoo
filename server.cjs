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
    "posts": 664,       // 登入可寫，所有人可讀
    "comments": 664,    // 登入可寫，所有人可讀
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

            //  Admin  
            const regex = /^\/(600\/)?users\/\d+$/;
            const isMatch = regex.test(requestPath);
            const isAdmin = user.role === 'admin';
            const isDelete = requestMethod === 'DELETE';

            if (isDelete && requestPath.includes('users')) {
                console.log(`Admin刪除檢查: IsAdmin=${isAdmin}, IsDelete=${isDelete}, Match=${isMatch}`);
            }

            if (isAdmin && isDelete && isMatch) {
                console.log(`通過條件,將執行刪除！`);

                const pathParts = requestPath.split('/');
                const targetId = parseInt(pathParts[pathParts.length - 1]);
                console.log(`刪除 ID: ${targetId}`);

                const targetUser = app.db.get('users').find({ id: targetId }).value();

                if (targetUser) {
                    app.db.get('users').remove({ id: targetId }).write();
                    console.log(`刪除成功`);
                    return res.status(200).json({
                        success: true,
                        message: `已刪除會員ID${targetUser.id}, ${targetUser.email}`
                    });
                } else {
                    console.log(`找不到目標`);
                    return res.status(404).json({ error: '找不到該會員' });
                }
            }

            // VIP 功能檢測
            if (requestPath.startsWith('/vip_reports')) {
                if (!['vip', 'admin'].includes(user.role)) {
                    return res.status(403).json({ error: '此功能僅限 VIP 會員' });
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
app.use(auth);

app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('權限：Admin > VIP > Member > Guest');
});