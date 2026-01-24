import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap';
import './scss/all.scss';
import Home from './components/Routes/Home';
import Test from './components/Routes/Test';
import Nopages from './components/Routes/Nopages';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import StockInfo from './pages/StockInfo.jsx';
import { Topics } from './contexts/Topics';
import TopicFeedPage from './components/Routes/TopicFeedPage';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      { path: 'topics', element: <TopicFeedPage /> },
      { path: 'topics/:topicSlug', element: <TopicFeedPage /> },
      {
        path: 'stockInfo',
        element: <StockInfo />,
      },
      {
        path: '*',
        element: <Nopages />,
      },
    ],
  },
];
const router = createHashRouter(routes);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
