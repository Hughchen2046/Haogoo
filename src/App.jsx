import { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import Navbar from './components/Routes/Navbar';
import Footer from './components/Routes/Footer';
import SweetAlert from './components/Tools/SweetAlert';

function App() {
  const location = useLocation();
  const outlet = useOutlet();

  const isAuthState = location.pathname === '/login' || location.pathname === '/regist';

  useEffect(() => {
    if (!isAuthState) {
      document.body.style.overflow = '';
    }
    // //console.log('當前路徑：', location.pathname);
  }, [isAuthState]);

  const pageContent = isAuthState ? <div className="indexBackImg" aria-hidden="true" /> : outlet;

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
