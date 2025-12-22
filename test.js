fetch('http://localhost:3000/symbols?_embed=prices')
    .then(res => res.json())
    .then(data => {
        // 過濾出 prices 陣列長度大於 0 的資料
        const availableStocks = data.filter(item => item.prices && item.prices.length > 0 && item.SECURITY_TW != "ETF");

        // 取得 industryTW 以及 name
        const result = availableStocks.map(item => ({
            id: item.id,
            name: item.name,
            industryTW: item.industryTW
        }));

        console.log(JSON.stringify(result, null, 2));
        console.log(`\n總共找到 ${result.length} 檔有價格資料的股票。`);
    })
    .catch(err => console.error('Error:', err));