import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap';
import './scss/all.scss';

createRoot(document.getElementById('root')).render(<App />);
