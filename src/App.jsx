import { useState } from 'react';
import Home from './components/Routes/Home';
import Test from './components/Routes/Test';
import Navbar from './components/Routes/Navbar';
import Footer from './components/Routes/Footer';
import Login from './components/Routes/Login';
import Regist from './components/Routes/Regist';
import { Routes, Route } from 'react-router-dom';
import Nopages from './components/Routes/Nopages';

const { VITE_stocksUrl } = import.meta.env;

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<Nopages />} />
      </Routes>
      <Footer />
      <Login />
      <Regist />
    </>
  );
}

export default App;
