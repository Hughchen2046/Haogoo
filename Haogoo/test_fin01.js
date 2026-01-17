//測試機, 讀取產業,計算每一檔的60日平均收盤價,再計算平均
import axios from 'axios';
const industryTW = '金融保險';
const API_URL = `http://localhost:3000/symbols?q=${industryTW}&_embed=prices`;

async function averageIndustry() {
    console.log(`開始計算...\n`);
    try {
        const getData = await axios.get(API_URL);
        // console.log(getData.data)
        const newArr = getData.data.filter((data) => data.prices.length > 0)

        const stockData = newArr.map((stock) => {
            const last60 = stock.prices.slice(-60);
            if (last60.length < 2) return null;

            // 計算平均價
            const sum = last60.reduce((acc, cur) => acc + cur.close, 0);
            const avg = sum / last60.length;

            // 計算報酬率 (最新一筆 vs 60 筆中的第一筆)
            const firstPrice = last60[0].close;
            const lastPrice = last60[last60.length - 1].close;
            const returnRate = ((lastPrice - firstPrice) / firstPrice) * 100;

            console.log(`${stock.id} ${stock.name}: 60日平均 = ${avg.toFixed(2)}, 60日報酬率 = ${returnRate.toFixed(2)}%`);

            return { avg, returnRate };
        }).filter(item => item !== null);

        if (stockData.length > 0) {
            const avgReturn = stockData.reduce((acc, cur) => acc + cur.returnRate, 0) / stockData.length;

            console.log(`\n--------------------------------------`);
            console.log(`${industryTW} 該產業平均60日報酬率: ${avgReturn.toFixed(2)}%`);
            console.log(`總共計算 ${stockData.length} 檔股票`);
            console.log(`--------------------------------------`);
        }
    }
    catch (err) {
        console.log(err)
    }
}
averageIndustry()
