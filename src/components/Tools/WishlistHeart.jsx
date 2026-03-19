import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';

/**
 * 通用的收藏愛心組件
 * 支援單一群組直接收藏，多群組時顯示選擇選單
 */
const WishlistHeart = ({ symbol, size = 20 }) => {
  const { toggleStock, isWatched, groups, groupCount } = useWishlist();
  const [showMenu, setShowMenu] = useState(false);
  const active = isWatched(symbol);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (active) {
      // 已收藏，直接取消
      toggleStock(symbol);
    } else {
      // 未收藏，判斷群組數
      if (groupCount <= 1) {
        toggleStock(symbol);
      } else {
        // 顯示群組選擇選單
        setShowMenu(true);
      }
    }
  };

  const handleSelectGroup = (groupId) => {
    toggleStock(symbol, groupId);
    setShowMenu(false);
  };

  return (
    <div className="position-relative d-inline-block" style={{ lineHeight: 0 }}>
      <Heart
        size={size}
        color={active ? '#2fa58d' : 'currentColor'}
        fill={active ? '#2fa58d' : 'none'}
        strokeWidth={2}
        className="cursor-pointer"
        onClick={handleToggle}
        style={{ transition: 'all 0.2s', verticalAlign: 'middle' }}
      />

      {showMenu && (
        <>
          {/* 遮罩，點擊取消 */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 9998 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
            }}
          />
          {/* 群組選單 */}
          <div
            className="position-absolute bg-white border rounded shadow-lg py-8 px-0"
            style={{
              zIndex: 9999,
              top: '100%',
              right: 0,
              minWidth: '140px',
              marginTop: '8px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-12 py-4 mb-4 border-bottom fw-bold small text-muted text-nowrap">
              存入群組
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {groups.map((g) => (
                <button
                  key={g.id}
                  className="dropdown-item px-12 py-10 text-start w-100 border-0 bg-transparent small text-nowrap"
                  onClick={() => handleSelectGroup(g.id)}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistHeart;
