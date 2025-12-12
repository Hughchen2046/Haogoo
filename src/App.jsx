import { useEffect, useState, useRef } from 'react'
import { Modal } from 'bootstrap'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import axios from 'axios'
import './App.css'
import './assets/all.scss'
import HaoGooGauge from '../public/Gauge.jsx'


const {VITE_API_URL,VITE_JSON_SERVER} = import.meta.env

function App() {
  const [count, setCount] = useState(0)
  const [stockData, setStockData] = useState(null)
  
  const modalRef = useRef(null)
  const [modalInstance, setModalInstance] = useState(null)

  useEffect(() => {
    // Initialize modal on mount
    if (modalRef.current) {
        const modal = new Modal(modalRef.current)
        setModalInstance(modal)
    }
    // Cleanup on unmount
    return () => {
        if (modalInstance) {
            modalInstance.dispose()
        }
    }
  }, [])

  const openModal = () => {
    modalInstance?.show()
  }

  const closeModal = () => {
    modalInstance?.hide()
  }

  useEffect(()=>{
    (async () => {
      try {
        let res, res1;
        try {
            res = await axios.get(VITE_API_URL)  //連結VITE_API_URL,連結randomuser.me/api
        } catch (err) {
            console.error("Error fetching VITE_API_URL:", err);
        }
        
        try {
            res1 = await axios.get(VITE_JSON_SERVER) //用來測試josn server用的,連結 http://localhost:3000/symbols
        } catch (err) {
            console.error("Error fetching VITE_JSON_SERVER:", err);
        }

        console.log(res);
        console.log(res1);
        
        if (res1 && res1.data) {
            setStockData(res1.data)
        }

        // Wait for modalInstance to be available
        if (modalInstance) {
            openModal()
            setTimeout(() => {
                closeModal()
            }, 2000);
        }
      } catch (error) {
        console.error("General Error:", error)
      }
    })()
  }, [modalInstance]) 
  
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

       {/* Modal */}
       <div className="modal fade" ref={modalRef} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">System Status</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <p>Data loaded successfully!</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>

      <p className="read-the-docs">
        {stockData && stockData[0] ? '測試連結成功!'+stockData[0].symbol+' '+stockData[0].name : 'Loading data...'}
      </p>
    </>
  )
}

export default App
