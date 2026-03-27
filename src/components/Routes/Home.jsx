import { useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import Header from './Header';
import StockCard from '../StockCard';
import EtfsList from '../EtfsList';
import IndustryList from '../IndustryList';
import SocialFeed from '../SocialFeed';

export default function Home() {
  const globalLoading = useSelector((state) => state.loading.loadingState['home.global'] || 0);
  const isGlobalLoading = globalLoading > 0;

  return (
    <>
      <Header />
      <StockCard />
      <EtfsList />
      <IndustryList />
      <SocialFeed />
      {isGlobalLoading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0a0a14',
            zIndex: 5000,
          }}
        >
          <BeatLoader color="var(--bs-primary, #0d6efd)" size={20} />
        </div>
      )}
    </>
  );
}
