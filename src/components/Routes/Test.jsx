import PopularNews from '../PopularNews';
import Regist from './Regist';

export default function Test() {
  return (
    <>
      <div className="container py-64">
        <h2 className="mb-32">測試頁面</h2>
        <button
          className="btn btn-primary py-12 px-32"
          data-bs-toggle="modal"
          data-bs-target="#registModal"
        >
          開啟註冊 Modal
        </button>
      </div>
      <Regist />
    </>
  );
}
