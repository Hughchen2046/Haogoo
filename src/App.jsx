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
      <Navbar />
      <Index />
      <StockCard />
      <EtfsList />
      <IndustryList />
      <SocialFeed />
      <Footer />
    </>
  );
}

export default App;
