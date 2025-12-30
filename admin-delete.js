const axios = require('axios');

// === 設定區 ===
const API_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'admin@admin.com';  // 管理員帳號
const ADMIN_PASSWORD = '12345678';      // 管理員密碼

// 取得指令後的參數 (例如: node admin-delete.js 18)
const targetId = process.argv[2];

if (!targetId) {
    console.log('⚠️  請提供要刪除的 User ID');
    console.log('👉 用法: node admin-delete.js <ID>');
    console.log('例如: node admin-delete.js 18');
    process.exit(1);
}

async function deleteUser() {
    try {
        console.log(`🔵 正在以管理員身分 (${ADMIN_EMAIL}) 登入...`);

        // 1. 登入取得 Token
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });

        const token = loginRes.data.accessToken;
        console.log('✅ 登入成功！取得管理員權限 Token');

        // 2. 執行刪除
        console.log(`🔴 正在刪除使用者 ID: ${targetId} ...`);

        // 注意：這裡直接發送 DELETE 請求，我們的 server.cjs 會優先攔截驗證 admin 權限
        const deleteRes = await axios.delete(`${API_URL}/users/${targetId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('🎉 操作成功！伺服器回應：', deleteRes.data);

    } catch (err) {
        if (err.response) {
            console.error(`❌ 失敗 (Status ${err.response.status}):`, err.response.data);
            if (err.response.status === 403) {
                console.error('💡 原因：權限不足。請確認該帳號是否真的是 admin 角色。');
            }
            if (err.response.status === 404) {
                console.error('💡 原因：或是找不到該使用者 ID (已經被刪除了?)');
            }
        } else {
            console.error('❌ 發生錯誤:', err.message);
        }
    }
}

deleteUser();
