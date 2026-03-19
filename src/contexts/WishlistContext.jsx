import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../app/features/auth/authAPI';
import { useDispatch, useSelector } from 'react-redux';
import { authUser } from '../app/features/auth/authSlice';
import { pushMessage } from '../app/features/message/messageSlice';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector(authUser);
  const dispatch = useDispatch();

  // 1. 取得清單
  const getWishlist = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.get(`/watchlists?userId=${userId}`);
      const data = res.data?.data?.[0];

      if (!data) {
        // 首次登入，建立預設資料
        const defaultGroupId = Math.random().toString(36).slice(2, 10);
        const newDoc = {
          userId,
          stocks: ['2330', '0050'],
          stockOrder: ['2330', '0050'],
          defaultGroupId,
          groups: [
            {
              id: defaultGroupId,
              name: '預設清單',
              stockIds: ['2330', '0050'],
              order: 0,
            },
          ],
        };
        const createRes = await api.post('/watchlists', newDoc);
        setWishlist(createRes.data?.data || createRes.data);
      } else {
        setWishlist(data);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. 切換收藏 (Axios PATCH -> GET)
  const toggleStock = async (symbol, targetGroupId = null) => {
    if (!user) {
      dispatch(pushMessage({ type: 'error', title: '請先登入後再收藏', timer: 3000 }));
      return;
    }
    if (!wishlist) return;

    const symbolStr = String(symbol);
    const stocks = [...wishlist.stocks];
    const stockOrder = [...wishlist.stockOrder];
    const groups = wishlist.groups.map((g) => ({ ...g, stockIds: [...g.stockIds] }));
    const idx = stocks.indexOf(symbolStr);

    if (idx === -1) {
      // 1. 加入總清單
      stocks.push(symbolStr);
      stockOrder.push(symbolStr);

      // 2. 決定加入哪個群組
      let selectedGroupId = targetGroupId;
      if (!selectedGroupId) {
        // 如果沒指定，預設存入第一個（通常是「預設清單」）
        selectedGroupId = wishlist.defaultGroupId || groups[0]?.id;
      }

      const targetGroup = groups.find((g) => g.id === selectedGroupId);
      if (targetGroup && !targetGroup.stockIds.includes(symbolStr)) {
        targetGroup.stockIds.push(symbolStr);
      }
    } else {
      // 取消收藏
      stocks.splice(idx, 1);
      const orderIdx = stockOrder.indexOf(symbolStr);
      if (orderIdx !== -1) stockOrder.splice(orderIdx, 1);
      // 同時從所有群組移除
      groups.forEach((g) => {
        g.stockIds = g.stockIds.filter((id) => String(id) !== symbolStr);
      });
    }

    try {
      await api.patch(`/watchlists/${wishlist.id}`, {
        stocks,
        stockOrder,
        groups,
      });
      // 直接重新獲取最新資料，確保穩定
      await getWishlist(user.id);
    } catch (err) {
      dispatch(pushMessage({ type: 'error', title: '操作失敗', timer: 3000 }));
    }
  };

  // 3. 檢查是否已收藏 (便利方法)
  const isWatched = useCallback(
    (symbol) => {
      if (!wishlist?.stocks) return false;
      return wishlist.stocks.includes(String(symbol));
    },
    [wishlist]
  );

  // 4. 群組與排序操作 (Axios PATCH -> GET)
  const addGroup = async (name) => {
    if (!wishlist) return;
    const newGroup = {
      id: Math.random().toString(36).slice(2, 10),
      name,
      stockIds: [],
      order: wishlist.groups.length,
    };
    const groups = [...wishlist.groups, newGroup];
    await updateWishlistRaw({ groups });
  };

  const renameGroup = async (groupId, name) => {
    if (!wishlist) return;
    const groups = wishlist.groups.map((g) => (g.id === groupId ? { ...g, name } : g));
    await updateWishlistRaw({ groups });
  };

  const deleteGroup = async (groupId) => {
    if (!wishlist) return;
    let groups = wishlist.groups.filter((g) => g.id !== groupId);
    let defaultGroupId = wishlist.defaultGroupId;
    if (defaultGroupId === groupId) {
      defaultGroupId = groups[0]?.id || null;
    }
    await updateWishlistRaw({ groups, defaultGroupId });
  };

  const setDefaultGroup = async (groupId) => {
    await updateWishlistRaw({ defaultGroupId: groupId });
  };

  const addStockToGroup = async (groupId, symbol) => {
    if (!wishlist) return;
    const groups = wishlist.groups.map((g) => {
      if (g.id === groupId && !g.stockIds.includes(String(symbol))) {
        return { ...g, stockIds: [...g.stockIds, String(symbol)] };
      }
      return g;
    });
    await updateWishlistRaw({ groups });
  };

  const removeStockFromGroup = async (groupId, symbol) => {
    if (!wishlist) return;
    const groups = wishlist.groups.map((g) => {
      if (g.id === groupId) {
        return { ...g, stockIds: g.stockIds.filter((id) => String(id) !== String(symbol)) };
      }
      return g;
    });
    await updateWishlistRaw({ groups });
  };

  const reorderStocks = async (newOrder) => {
    await updateWishlistRaw({ stockOrder: newOrder });
  };

  const reorderGroups = async (newGroupIds) => {
    if (!wishlist) return;
    const map = Object.fromEntries(wishlist.groups.map((g) => [g.id, g]));
    const groups = newGroupIds
      .filter((id) => map[id])
      .map((id, idx) => ({ ...map[id], order: idx }));
    await updateWishlistRaw({ groups });
  };

  const updateWishlistRaw = async (updates) => {
    if (!wishlist?.id || !user?.id) return;
    try {
      await api.patch(`/watchlists/${wishlist.id}`, updates);
      await getWishlist(user.id);
    } catch (err) {
      dispatch(pushMessage({ type: 'error', title: '更新失敗', timer: 3000 }));
    }
  };

  const value = {
    wishlist,
    loading,
    groupCount: wishlist?.groups?.length || 0,
    groups: wishlist?.groups || [],
    getWishlist,
    toggleStock,
    isWatched,
    addGroup,
    renameGroup,
    deleteGroup,
    setDefaultGroup,
    addStockToGroup,
    removeStockFromGroup,
    reorderStocks,
    reorderGroups,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
