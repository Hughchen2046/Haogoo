import { useState } from 'react';
import Home from './components/Routes/Home';
import Test from './components/Routes/Test';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import { Routes, Route } from 'react-router';

const { VITE_stocksUrl } = import.meta.env;

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
      </Routes>
      <Footer />
      <Login />
    </>
  );
}

export default App;
