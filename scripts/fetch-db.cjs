const fs = require('fs');
const https = require('https');
const path = require('path');

const DB_URL = 'https://haogoo-data.zeabur.app/db';
const LOCAL_DB = 'db.json';
const BACKUP_PREFIX = 'db-';

/**
 * 下載並儲存檔案
 */
async function downloadDB(targetPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(targetPath);
        https.get(DB_URL, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`下載失敗: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(targetPath, () => { }); // 失敗時刪除殘留檔案
            reject(err);
        });
    });
}

/**
 * 取得下一個備份檔名 (db-001.json, db-002.json...)
 */
function getNextBackupName() {
    const files = fs.readdirSync('.');
    const backupFiles = files.filter(f => f.startsWith(BACKUP_PREFIX) && f.endsWith('.json'));

    let maxNum = 0;
    backupFiles.forEach(f => {
        const match = f.match(/db-(\d+)\.json/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
        }
    });

    const nextNum = (maxNum + 1).toString().padStart(3, '0');
    return `${BACKUP_PREFIX}${nextNum}.json`;
}

async function run() {
    const mode = process.argv[2]; // 'sync' 或 'backup'

    try {
        if (mode === 'sync') {
            console.log('正在從 Zeabur 同步更新 db.json...');
            await downloadDB(LOCAL_DB);
            console.log('✅ 同步成功！本地 db.json 已更新。');
        } else {
            const backupName = getNextBackupName();
            console.log(`正在從 Zeabur 下載備份並建立為 ${backupName}...`);
            await downloadDB(backupName);
            console.log(`✅ 備份成功！已建立檔案: ${backupName}`);
        }
    } catch (error) {
        console.error('❌ 執行失敗:', error.message);
        process.exit(1);
    }
}

run();
