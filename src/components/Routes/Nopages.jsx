import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Nopages() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate('/');
    }, 2000);
  }, [navigate]);
  return (
    <div className="bg-dark text-white py-96">
      <h1 className="mt-48">不存在此頁面,將轉回首頁...</h1>
    </div>
  );
}
