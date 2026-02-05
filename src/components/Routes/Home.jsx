import { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import Header from './Header';
import StockCard from '../StockCard';
import EtfsList from '../EtfsList';
import IndustryList from '../IndustryList';
import SocialFeed from '../SocialFeed';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#0d6efd');

  useEffect(() => {
    // 模擬初始載入時間，確保頁面資源已載入
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--bs-primary')
      .trim();
    if (color) setPrimaryColor(color);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0a0a14',
          zIndex: 9999,
        }}
      >
        <BeatLoader color={primaryColor} size={20} />
      </div>
    );
  }

  return (
    <>
      <Header />
      <StockCard />
      <EtfsList />
      <IndustryList />
      <SocialFeed />
    </>
  );
}
