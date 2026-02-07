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
import TopicFeedPage from './components/Routes/TopicFeedPage';
import TopicETF from './components/Routes/TopicETF.jsx';
import TopicAll from './components/Routes/TopicAll.jsx';
import TopicBeginner from './components/Routes/TopicBeginner.jsx';
import TopicInternation from './components/Routes/TopicInternation.jsx';
import TopicTaiwanStock from './components/Routes/TopicTaiwanStock.jsx';
import TopHot from './components/Routes/TopHot.jsx';
import MyStockFeed from './components/Routes/MyStockFeed.jsx';
import MarketInfo from './components/Routes/MarketInfo.jsx';
import MyWishlist from './components/Routes/MyWishlist.jsx';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'topics',
        element: <TopicFeedPage />,
        children: [
          { index: true, element: <TopicAll /> },
          { path: 'etf', element: <TopicETF /> },
          { path: 'beginners', element: <TopicBeginner /> },
          { path: 'global-finance', element: <TopicInternation /> },
          { path: 'tw-market', element: <TopicTaiwanStock /> },
          { path: 'hot', element: <TopHot /> },
          { path: ':topicSlug', element: <TopicAll /> },
        ],
      },
      {
        path: 'stockInfo',
        element: <StockInfo />,
      },
      {
        path: 'mystocklist',
        element: <MyStockFeed />,
        children: [
          { index: true, element: <MarketInfo /> },
          { path: 'marketinfo', element: <MarketInfo /> },
          { path: 'mywishlist', element: <MyWishlist /> },
        ],
      },
      {
        path: 'test',
        element: <Test />,
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
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
