/**
 * 對 userId 1~31 的所有帳號：
 * - 若無 watchlist → 新增（含預設清單 + 2330/0050）
 * - 若有 watchlist 但沒有「預設清單」群組 → 插入到 groups[0]
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '../db.json');
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const ALL_USER_IDS = Array.from({ length: 31 }, (_, i) => i + 1);
const DEFAULT_STOCKS = ['2330', '0050'];

function uid() {
    return crypto.randomBytes(4).toString('hex');
}

function makeDefaultGroup() {
    return { id: uid(), name: '預設清單', stockIds: [...DEFAULT_STOCKS], order: 0 };
}

// 建立 Map  userId → watchlist index
const wlMap = new Map(db.watchlists.map((w, i) => [w.userId, i]));

// 取得目前最大 id
let maxId = Math.max(...db.watchlists.map((w) => w.id), 0);

for (const userId of ALL_USER_IDS) {
    if (!wlMap.has(userId)) {
        // ── 完全沒有 watchlist → 新增 ──
        const g = makeDefaultGroup();
        db.watchlists.push({
            id: ++maxId,
            userId,
            stocks: [...DEFAULT_STOCKS],
            stockOrder: [...DEFAULT_STOCKS],
            defaultGroupId: g.id,
            groups: [g],
        });
        console.log(`➕ userId=${userId} 新增 watchlist`);
    } else {
        // ── 已有 watchlist，確保含「預設清單」群組 ──
        const idx = wlMap.get(userId);
        const wl = db.watchlists[idx];
        const hasDefault = wl.groups.some((g) => g.name === '預設清單');
        if (!hasDefault) {
            const g = makeDefaultGroup();
            // 插到 groups 最前面，原有群組 order +1
            wl.groups = [g, ...wl.groups.map((x) => ({ ...x, order: x.order + 1 }))];
            // 補進 stocks / stockOrder
            for (const s of DEFAULT_STOCKS) {
                if (!wl.stocks.includes(s)) wl.stocks.unshift(s);
                if (!wl.stockOrder.includes(s)) wl.stockOrder.unshift(s);
            }
            wl.defaultGroupId = wl.defaultGroupId ?? g.id;
            console.log(`🔧 userId=${userId} 補入預設清單`);
        } else {
            console.log(`✅ userId=${userId} 已有預設清單，略過`);
        }
    }
}

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
console.log('\n完成！watchlists 總數：', db.watchlists.length);
