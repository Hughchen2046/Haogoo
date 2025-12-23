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
      const lastPrice = filterData.map((e)=>{
        e.prices = e.prices.slice(-1)
        return e
      })
      setStockData(lastPrice)
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
                <th>股票代碼</th>
                <th>股票名稱</th>
                <th>股票種類</th>
                <th>產業類別</th>
                <th>開盤價</th>
                <th>收盤價</th>
                <th>最高價</th>
                <th>最低價</th>
                <th>成交量</th>
                <th>資料日期</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((data)=>{
                return(
                  <tr key={data.id}>
                    <td>{data.id}</td>
                    <td>{data.name}</td>
                    <td>{data.SECURITY_TW}</td>
                    <td>{data.industryTW}</td>
                    <td>{data.prices[0].open.toFixed(2)}</td>
                    <td>{data.prices[0].close.toFixed(2)}</td>
                    <td>{data.prices[0].high.toFixed(2)}</td>
                    <td>{data.prices[0].low.toFixed(2)}</td>
                    <td>{data.prices[0].volume}</td>
                    <td>{new Date(data.prices[0].date).toLocaleString().split(',')[0]}</td>
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
