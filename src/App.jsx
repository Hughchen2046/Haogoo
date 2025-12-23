import { useEffect, useState } from 'react'
import axios from 'axios'


const {VITE_stocksUrl} = import.meta.env

function App() {
  const [stockData, setStockData] = useState([])
  

//取出所有有價格的股票資訊
  useEffect(() => {
    axios.get(VITE_stocksUrl)
    .then(response => {
      const filterData = response.data.filter((item)=> item.prices.length > 0)
      const lastData = filterData.map((e)=>{
        e.prices = e.prices.slice(-1)
        return e
      }).sort((a, b)=> {
        return b.industry.localeCompare(a.industry)
      })
      setStockData(lastData)
      // console.log(lastPrice)
    })
    .catch(error => {
      console.log(error)
    })
  }, [])
  
  return (
    <> <div className="container">
      <div className="row mt-3">
        <div className="col-12">
          <table className="table table-hover table-striped mt-4">
            <thead>
              <tr>
                <th className='text-end'>股票代碼</th>
                <th className='text-end'>股票名稱</th>
                <th className='text-end'>股票種類</th>
                <th className='text-end'>產業類別</th>
                <th className='text-end'>開盤價</th>
                <th className='text-end'>收盤價</th>
                <th className='text-end'>最高價</th>
                <th className='text-end'>最低價</th>
                <th className='text-end'>成交量</th>
                <th className='text-end'>漲跌%</th>
                <th className='text-end'>資料日期</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((data)=>{
                const dailyChangeRate = (data.prices[0].close - data.prices[0].open) / data.prices[0].open * 100
                return(
                  <tr key={data.id}>
                    <td className='text-end'>{data.id}</td>
                    <td className='text-end'>{data.name}</td>
                    <td className='text-end'>{data.SECURITY_TW}</td>
                    <td className='text-end'>{data.industryTW}</td>
                    <td className='text-end'>{data.prices[0].open.toFixed(2)}</td>
                    <td className='text-end' style={{color: data.prices[0].close - data.prices[0].open > 0 ? 'red' : 'green'}}>{data.prices[0].close.toFixed(2)}</td>
                    <td className='text-end'>{data.prices[0].high.toFixed(2)}</td>
                    <td className='text-end'>{data.prices[0].low.toFixed(2)}</td>
                    <td className='text-end'>{data.prices[0].volume}</td>
                    <td className='text-end' style={{color: dailyChangeRate > 0 ? 'red' : 'green'}}>{dailyChangeRate.toFixed(2)}%</td>
                    <td className='text-end'>{new Date(data.prices[0].date).toLocaleString().split(',')[0]}</td>
                  </tr>
                )
              })}

            </tbody>


          </table>
        </div>
      </div>


    </div>
    
    </>
  )
}

export default App
