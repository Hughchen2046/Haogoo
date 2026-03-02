import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Heart } from 'lucide-react';

const StockTable = ({ data, category, filterKey, initialNumberCount = 5 }) => {
  //   const { industryTab } = props;
  //   console.log('industryTab2', industryTab);
  const [getMore, setGetMore] = useState(false);
  const [likedItems, setLikedItems] = useState(new Set());

  const navigate = useNavigate();

  const displayData = getMore
    ? data.slice(0, initialNumberCount + 10)
    : data.slice(0, initialNumberCount);
  //filterKey改變時,重置getMore
  useEffect(() => {
    setGetMore(false);
  }, [filterKey]);

  // 切換個別股票的收藏狀態
  const toggleLike = (stockId) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stockId)) {
        newSet.delete(stockId);
      } else {
        newSet.add(stockId);
      }
      return newSet;
    });
  };

  return (
    <div className="text-center">
      <div
        className="round-8 shadow-sm mb-24 text-start"
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid white',
        }}
      >
        <div className="table-responsive">
          <table className="table table-hover align-middle table-bordered round-8 border-gray-400 bg-white">
            <thead>
              <tr className="h6 fw-bold ">
                <th scope="col" style={{ width: '150px', minWidth: '150px' }}>
                  名稱
                </th>
                <th scope="col" style={{ width: '120px', minWidth: '120px' }}>
                  價格
                </th>
                <th scope="col" style={{ width: '120px', minWidth: '120px' }}>
                  開盤價
                </th>
                <th scope="col" style={{ width: '120px', minWidth: '120px' }}>
                  最低
                </th>
                <th scope="col" style={{ width: '120px', minWidth: '120px' }}>
                  最高
                </th>
                <th scope="col" style={{ width: '120px', minWidth: '120px' }}>
                  漲跌福(%)
                </th>
                <th scope="col" style={{ width: '120px', minWidth: '120px' }}>
                  成交量
                </th>
                <th scope="col" style={{ width: '120px', minWidth: '120px' }}>
                  收藏
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((item) => (
                <tr
                  key={item.id}
                  className="h6"
                  onClick={() => navigate(`/stockInfo/${item.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <th scope="row">
                    {item.name} {item.id}
                  </th>
                  <td
                    className={
                      item.prices[item.prices.length - 1].dailyChangePct <= -9.9
                        ? 'bg-success text-white' // 跌停
                        : item.prices[item.prices.length - 1].dailyChangePct >= 9.9
                          ? 'bg-danger text-white' // 漲停或接近漲停
                          : item.prices[item.prices.length - 1].dailyChangePct > 0
                            ? 'text-danger' // 上漲
                            : item.prices[item.prices.length - 1].dailyChangePct < 0
                              ? 'text-success' // 下跌
                              : '' // 平盤
                    }
                  >
                    {item.prices[item.prices.length - 1].close.toFixed(2)}
                    <span className="p-4">
                      {item.prices[item.prices.length - 1].close -
                        item.prices[item.prices.length - 2].close >
                      0 ? (
                        <TrendingUp color="#f2735b" size={16} />
                      ) : (
                        <TrendingDown color="#56b77e" size={16} />
                      )}
                    </span>
                  </td>
                  <td>{item.prices[item.prices.length - 1].open.toFixed(2)}</td>
                  <td className="text-success">
                    {item.prices[item.prices.length - 1].low.toFixed(2)}
                  </td>
                  <td className="text-danger">
                    {item.prices[item.prices.length - 1].high.toFixed(2)}
                  </td>
                  <td
                    className={
                      item.prices[item.prices.length - 1].dailyChangePct <= -9.9
                        ? 'bg-success text-white' // 跌停
                        : item.prices[item.prices.length - 1].dailyChangePct >= 9.9
                          ? 'bg-danger text-white' // 漲停或接近漲停
                          : item.prices[item.prices.length - 1].dailyChangePct > 0
                            ? 'text-danger' // 上漲
                            : item.prices[item.prices.length - 1].dailyChangePct < 0
                              ? 'text-success' // 下跌
                              : '' // 平盤
                    }
                  >
                    {item.prices[item.prices.length - 1].dailyChangePct > 0 ? '+' : ''}
                    {item.prices[item.prices.length - 1].dailyChangePct}%
                  </td>
                  <td>{item.prices[item.prices.length - 1].volume}</td>
                  {/* 收藏按鈕 */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="border-0 btn btn-like">
                      <Heart
                        strokeWidth={likedItems.has(item.id) ? 0 : 2}
                        fill={likedItems.has(item.id) ? 'var(--bs-primary)' : 'none'}
                        onClick={() => toggleLike(item.id)}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        type="button"
        disabled={getMore}
        className={getMore ? 'btn bg-gray-600 border-gray-600' : 'btn btn-outline-primary'}
        onClick={() => setGetMore(true)}
      >
        查看更多
      </button>
    </div>
  );
};

export default StockTable;
