import { useEffect, useState } from 'react'
import axios from 'axios'
import Guideline from './components/Guideline'
import Login from './components/Login'
import { Camera } from 'lucide-react';

const {VITE_stocksUrl} = import.meta.env

function App() {
  const [showGuideline, setShowGuideline] = useState(false)
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end align-items-center mb-4 border-bottom pb-4">
        <button 
          className="btn btn-outline-primary"
          onClick={() => setShowGuideline(!showGuideline)}
        >
          {showGuideline ? '顯示首頁' : '顯示設計Guideline'}
        </button>
      </div>

      {showGuideline ? (
        <Guideline />
      ) : (
        <div className="row">
          <Login/>

        </div>
      )}
    </div>
  )
}

export default App
