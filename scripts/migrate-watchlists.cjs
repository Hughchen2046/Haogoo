/**
 * Migration: watchlists → new schema
 * Old: { id, userId, name, isDefault, items:[{symbol,name}], ... }
 * New: { id, userId, stocks:[], groups:[], stockOrder:[], defaultGroupId }
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '../db.json');
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

function uid() {
    return crypto.randomBytes(4).toString('hex');
}

// 按 userId 分組舊資料
const oldByUser = {};
for (const wl of db.watchlists) {
    if (!oldByUser[wl.userId]) oldByUser[wl.userId] = [];
    oldByUser[wl.userId].push(wl);
}

const newWatchlists = [];
let newId = 1;

for (const [userIdStr, lists] of Object.entries(oldByUser)) {
    const userId = parseInt(userIdStr);
    const allSymbols = [];
    const groups = [];

    for (const wl of lists) {
        const symbols = (wl.items || []).map((i) => i.symbol);
        const groupId = uid();

        // 收集所有 symbol（去重）
        for (const s of symbols) {
            if (!allSymbols.includes(s)) allSymbols.push(s);
        }

        groups.push({
            id: groupId,
            name: wl.name || '未命名群組',
            stockIds: symbols,
            order: groups.length,
        });
    }

    const defaultGroupId = groups[0]?.id || null;

    newWatchlists.push({
        id: newId++,
        userId,
        stocks: allSymbols,
        groups,
        stockOrder: [...allSymbols],
        defaultGroupId,
    });
}

// 加入兩筆示範資料（userId 4 = admin，如果還沒有）
const hasAdmin = newWatchlists.find((w) => w.userId === 4);
if (!hasAdmin) {
    const g1 = uid();
    const g2 = uid();
    newWatchlists.push({
        id: newId++,
        userId: 4,
        stocks: ['2330', '0050', '006208', '2454'],
        groups: [
            { id: g1, name: '長期持有', stockIds: ['2330', '0050'], order: 0 },
            { id: g2, name: 'ETF', stockIds: ['0050', '006208'], order: 1 },
        ],
        stockOrder: ['2330', '0050', '006208', '2454'],
        defaultGroupId: g1,
    });
}

db.watchlists = newWatchlists;
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
console.log('✅ Migration complete. New watchlists count:', newWatchlists.length);
console.log(JSON.stringify(newWatchlists, null, 2));
