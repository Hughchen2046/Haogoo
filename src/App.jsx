import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useRef } from 'react'
import axios from 'axios'
import './App.css'
import './assets/all.scss'
import HaoGooGauge from '../public/Gauge.jsx'

const {VITE_API_URL,VITE_STOCK_TEST_API_01} = import.meta.env

function App() {
  const [count, setCount] = useState(0)
  // const modalRef = useRef(null)
  // const customModal = useRef(null)
  useEffect(()=>{
    (async () => {
      const res = await axios.get(VITE_API_URL)
      console.log(res);
      const res1 = await axios.get(VITE_STOCK_TEST_API_01)
      .then(res1 => console.log(res1))
      .catch(err => console.error("ERR:", err))

      // openModal()
      // setTimeout(() => {
      //   closeModal()
      // }, 2000);
    })()
  })
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="mt-3">專案進度</h1>
      <HaoGooGauge />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
