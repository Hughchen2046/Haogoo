import Header from '../Header';
import StockCard from '../StockCard';
import EtfsList from '../EtfsList';
import IndustryList from '../IndustryList';
import SocialFeed from '../SocialFeed';

export default function Home() {
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
