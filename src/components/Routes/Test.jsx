import Guideline from '../Tools/Guideline';
import StockInfo from '../../pages/StockInfo';

export default function Test() {
  return (
    <>
      <div className="bg-dark text-white py-96">
        <h2 className="mb-32">測試頁面</h2>
      </div>

      <StockInfo />
      <Guideline />
    </>
  );
}
