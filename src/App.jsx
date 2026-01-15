import { useState } from 'react';
import Guideline from './components/Guideline';
import Login from './components/Login';
import StockCard from './components/StockCard';
import EtfsList from './components/EtfsList';
import IndustryList from './components/IndustryList';
import SocialFeed from './components/SocialFeed';
import Footer from './components/Footer';
import Header from './components/Header';
import { Index } from './components/Header';
import Navbar from './components/Navbar';

const { VITE_stocksUrl } = import.meta.env;

function App() {
  const [showGuideline, setShowGuideline] = useState(false);

  return (
    <>
      <button className="btn btn-outline-primary" onClick={() => setShowGuideline(!showGuideline)}>
        {showGuideline ? '顯示首頁' : '顯示設計Guideline'}
      </button>

      {showGuideline ? (
        <Guideline />
      ) : (
        <div className="overflow-hidden">
          <h4 className="my-16">Navbar</h4>
          <Navbar />
          <h4 className="my-16">登入頁面</h4>
          <Login />
          <h4 className="my-16">Section 1: Index</h4>
          <Index />
          <h4 className="my-16">Section 2: Stock card</h4>
          <StockCard />
          <h4 className="my-16">Section 3: ETFs List</h4>
          <EtfsList />
          <h4 className="my-16">Section 4: Industry List</h4>
          <IndustryList />
          <h4 className="my-16">Section 5: Social Feed</h4>
          <SocialFeed />
          <h4 className="my-16">Footer</h4>
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
