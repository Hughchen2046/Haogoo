import Guideline from '../Tools/Guideline';
import ForStockUse from '../Tools/ForStockUse';

export default function Test() {
  return (
    <>
      <div className="bg-dark text-white py-96">
        <h2 className="mb-32">測試頁面</h2>
      </div>

      <ForStockUse />
      <Guideline />
    </>
  );
}
