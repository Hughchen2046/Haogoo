import { useEffect, useState } from 'react';
import Home from './components/Routes/Home';
import { useLocation, useOutlet } from 'react-router-dom';
import Navbar from './components/Routes/Navbar';
import Footer from './components/Routes/Footer';
import SweetAlert from './components/Tools/SweetAlert';

function App() {
  const location = useLocation();
  const outlet = useOutlet();
  const [backgroundOutlet, setBackgroundOutlet] = useState(null);

  const isAuthState = location.pathname === '/login' || location.pathname === '/regist';

  useEffect(() => {
    if (!isAuthState) {
      setBackgroundOutlet(outlet);
      document.body.style.overflow = '';
    }
    // console.log('當前路徑：', location.pathname);
  }, [isAuthState, outlet]);

  // 如果是登入或註冊頁面，則顯示背景內容；否則顯示正常內容
  const pageContent = isAuthState ? (backgroundOutlet ?? <Home />) : outlet;

  return (
    <>
      <Navbar />
      {pageContent}
      <Footer />
      {isAuthState && outlet}
      <SweetAlert />
    </>
  );
}

export default App;
