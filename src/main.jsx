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
import TopicETF from './components/Routes/TopicETF.jsx';
import TopicAll from './components/Routes/TopicAll.jsx';
import TopicBeginner from './components/Routes/TopicBeginner.jsx';
import TopicInternation from './components/Routes/TopicInternation.jsx';
import TopicTaiwanStock from './components/Routes/TopicTaiwanStock.jsx';
import TopHot from './components/Routes/TopHot.jsx';
import MyStockFeed from './components/Routes/MyStockFeed.jsx';
import MarketInfo from './components/Routes/MarketInfo.jsx';
import MyWishlist from './components/Routes/MyWishlist.jsx';
import News from './components/Routes/News.jsx';
import Login from './components/Routes/Login.jsx';
import Regist from './components/Routes/Regist.jsx';

import { Provider } from 'react-redux';
import { store } from './app/store/store.jsx';
import ProtectRoute from './app/routes/ProtectRoute.jsx';

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
        path: 'login',
        element: <Login />,
      },
      {
        path: 'regist',
        element: <Regist />,
      },
      {
        element: <ProtectRoute />,
        children: [
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
        ],
      },
      {
        element: <ProtectRoute />,
        children: [
          {
            path: 'stockInfo/:id',
            element: <StockInfo />,
          },
        ],
      },
      {
        element: <ProtectRoute />,
        children: [
          {
            path: 'mystocklist',
            element: <MyStockFeed />,
            children: [
              { index: true, element: <MarketInfo /> },
              // { path: 'marketinfo', element: <MarketInfo /> },
              { path: 'mywishlist', element: <MyWishlist /> },
              { path: ':mystockSlug', element: <MarketInfo /> },
            ],
          },
        ],
      },
      {
        path: 'test',
        element: <Test />,
      },
      { element: <ProtectRoute />, children: [{ path: 'news/:postId', element: <News /> }] },
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
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </AuthProvider>
);
