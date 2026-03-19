import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function highlightText(text, query) {
  const str = String(text ?? '');
  const q = String(query ?? '').trim();

  if (!q) return str;

  const lowerStr = str.toLowerCase();
  const lowerQ = q.toLowerCase();
  const index = lowerStr.indexOf(lowerQ);

  if (index === -1) return str;

  return (
    <>
      {str.slice(0, index)}
      <span className="text-primary fw-bold">{str.slice(index, index + q.length)}</span>
      {str.slice(index + q.length)}
    </>
  );
}

export default function SearchStock({
  symbols,
  defaultCount = 5,
  maxResults = 12,
  onSelect,
  navSearchColor,
  navSearchScreen,
  navSearchBarScreen,
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef(null);
  const safeSymbols = Array.isArray(symbols) ? symbols : [];
  const iconColorClass = navSearchBarScreen || 'text-gray-900';

  // 預設清單：先簡單取前幾筆
  const defaultItems = useMemo(() => {
    return safeSymbols.slice(0, defaultCount);
  }, [safeSymbols, defaultCount]);

  // 搜尋結果
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const starts = [];
    const includes = [];

    for (const item of safeSymbols) {
      const symbol = String(item.symbol ?? '').toLowerCase();
      const name = String(item.name ?? '').toLowerCase();

      const allText = `${symbol} ${name}`;

      // 優先：代碼開頭 / 名稱開頭
      if (symbol.startsWith(q) || name.startsWith(q)) {
        starts.push(item);
      } else if (allText.includes(q)) {
        includes.push(item);
      }
    }

    const sorter = (a, b) => {
      return (
        String(a.symbol).localeCompare(String(b.symbol)) ||
        String(a.name).localeCompare(String(b.name))
      );
    };

    return [...starts.sort(sorter), ...includes.sort(sorter)].slice(0, maxResults);
  }, [safeSymbols, query, maxResults]);

  const displayList = query.trim() ? filteredItems : defaultItems;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.symbol);
    setOpen(false);
    setActiveIndex(-1);
    onSelect?.(item);
  };

  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, displayList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && displayList[activeIndex]) {
        handleSelect(displayList[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="position-relative" ref={wrapRef}>
      <div className="input-group">
        <input
          type="text"
          className={`form-control ${navSearchColor} ${navSearchScreen}`}
          placeholder="輸入台/美股代號，查看公司價值"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />

        {/* {query && (
          <button
            type="button"
            className="btn btn-outline-info"
            onClick={() => {
              setQuery('');
              setOpen(true);
            }}
          >
            清除
          </button>
        )} */}
        <NavLink
          to={`/stockInfo/${query}`}
          className={`position-absolute end-0 top-50 translate-middle-y bg-transparent border-0 ${navSearchScreen}`}
        >
          <Search size={24} className={iconColorClass} />
        </NavLink>
      </div>

      {open && (
        <ul
          className="dropdown-menu show w-100 mt-2 shadow list-unstyled mb-0 search-dropdown"
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {!query.trim() && <div className="px-3 py-2 text-muted small">清單列表</div>}

          {query.trim() && filteredItems.length === 0 && (
            <div className="px-3 py-2 text-muted">找不到符合「{query}」的商品</div>
          )}

          {displayList.map((item, index) => {
            const active = index === activeIndex;

            return (
              <li key={item.symbol} className="w-100">
                <button
                  type="button"
                  className={`dropdown-item btn search-btn text-start ${active ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(item)}
                >
                  <div className="text-start">
                    <div className="fw-medium">
                      {highlightText(item.symbol, query)}
                      <span className={`ms-2 ${active ? 'text-white-50' : 'text-muted'}`}>
                        {highlightText(item.name, query)}
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
