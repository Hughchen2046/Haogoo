import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Routes/Navbar';
import Footer from './components/Routes/Footer';
import Login from './components/Routes/Login';
import Regist from './components/Routes/Regist';
import ForgetPW from './components/Routes/ForgetPW';

const { VITE_stocksUrl } = import.meta.env;

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <Login />
      <Regist />
      <ForgetPW />
    </>
  );
}

export default App;
