import Guideline from '../Tools/Guideline';

export default function Test() {
  console.log('Test rendering');
  return (
    <>
      <div className="bg-dark text-white py-96">
        <h2 className="mb-32">測試頁面</h2>
      </div>
      <Guideline />
    </>
  );
}
