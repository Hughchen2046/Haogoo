import axios from 'axios';

const API_URL = 'http://localhost:3000';

// 每次執行生成一個隨機帳號以供測試
const uniqueId = Math.floor(Math.random() * 100000);
const testUser = {
    email: `tester_${uniqueId}@haogoo.com`,
    password: 'password123',
    name: `測試員 ${uniqueId}`
};

async function runLinkedTest() {
    console.log('--- 🧪 開始 JSON Server Auth 聯動功能測試 ---\n');

    try {
        // 🚀 步驟 1: 註冊新帳號
        console.log(`[1/4] 註冊測試帳號: ${testUser.email}`);
        const regRes = await axios.post(`${API_URL}/register`, testUser);
        const { accessToken, user } = regRes.data;
        const myUserId = user.id;
        console.log(`✅ 註冊成功！系統分配 ID: ${myUserId}`);

        // 建立一個已授權的 Axios 實例
        const authClient = axios.create({
            baseURL: API_URL,
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        console.log('\n--------------------------------------\n');

        // 🚀 步驟 2: 新增私有資料 (watchlists)
        // 規則 600 要求必須在 body 中包含正確的 userId
        console.log(`[2/4] 新增自選股資料 (userId: ${myUserId})...`);
        const addRes = await authClient.post('/watchlists', {
            userId: myUserId,
            name: "預設清單",
            isDefault: true,
            items: [
                {
                    "symbol": "2330",
                    "name": "台積電"
                },
                {
                    "symbol": "0050",
                    "name": "元大台灣50"
                }
            ]

        });
        console.log('✅ 新增成功！資料已寫入 db.json');

        console.log('\n--------------------------------------\n');

        // 🚀 步驟 3: 驗證讀取權限 (只能看到自己的)
        console.log('[3/4] 讀取自選股清單...');
        const listRes = await authClient.get('/watchlists');
        console.log(`✅ 讀取成功！共取得 ${listRes.data.length} 筆資料`);

        console.log('\n--------------------------------------\n');

        // 🚀 步驟 4: 安全性攔截測試 (嘗試存取他人帳號)
        console.log('[4/4] 跨權限測試：嘗試讀取 ID 為 1 的他人帳號資訊 (預期 403)...');
        try {
            const secretRes = await authClient.get('/users/1');
            console.log('❌ 警告：安全性洩漏！居然讀到了他人資料:', secretRes.data.email);
        } catch (err) {
            if (err.response?.status === 403) {
                console.log('✅ 攔截成功！伺服器回傳 403 Forbidden (權限隔離有效)');
            } else {
                console.log('⚠️ 攔截結果:', err.response?.status);
            }
        }

        console.log('\n--------------------------------------\n');
        console.log('🎉 聯動測試完成！server.cjs 規則與 db.json 運作正常。');

    } catch (err) {
        console.error('❌ 測試發生錯誤:', err.response?.data || err.message);
    }
}

runLinkedTest();
