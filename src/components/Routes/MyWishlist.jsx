import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { authUser } from '../../app/features/auth/authSelectors';
import { useWishlist } from '../../contexts/useWishlist';

// dnd-kit
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { BeatLoader } from 'react-spinners';
import { Heart, Plus, Pencil, Trash2, Check, X, BookmarkCheck, GripVertical } from 'lucide-react';

const EMPTY_GROUPS = [];

// 可拖曳股票行

function SortableStockRow({ symbol, groups, activeGroupId, onRemoveFromGroup, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: symbol,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'default',
  };

  const isInGroup =
    activeGroupId &&
    groups.some((g) => g.id === activeGroupId && g.stockIds.includes(String(symbol)));

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="d-flex align-items-center justify-content-between py-12 px-16 border-bottom bg-white"
    >
      {/* 拖曳把手 */}
      <div className="d-flex align-items-center gap-12">
        <span
          {...attributes}
          {...listeners}
          className="text-muted"
          style={{ cursor: 'grab', touchAction: 'none' }}
          title="拖曳排序"
        >
          <GripVertical size={16} />
        </span>

        <span className="fw-bold">{symbol}</span>

        {/* 群組 badges */}
        {groups
          .filter((g) => g.stockIds.includes(String(symbol)))
          .map((g) => (
            <span key={g.id} className="badge bg-primary-subtle text-primary rounded-pill">
              {g.name}
            </span>
          ))}
      </div>

      <div className="d-flex gap-8">
        {/* 加入 / 移出目前群組 */}
        {activeGroupId && (
          <button
            className={`btn btn-sm ${isInGroup ? 'btn-outline-danger' : 'btn-outline-primary'}`}
            title={isInGroup ? '移出群組' : '加入群組'}
            onClick={() => onRemoveFromGroup(activeGroupId, symbol, isInGroup)}
          >
            {isInGroup ? <X size={14} /> : <Plus size={14} />}
          </button>
        )}
        {/* 取消收藏 */}
        <button
          className="btn btn-sm btn-outline-primary"
          title="取消收藏"
          onClick={() => onToggle(symbol)}
        >
          <Heart size={14} fill="#2fa58d" color="#2fa58d" />
        </button>
      </div>
    </div>
  );
}

// 可拖曳群組 Tab
function SortableGroupTab({
  group,
  isActive,
  isDefault,
  onSelect,
  onRename,
  onDelete,
  onSetDefault,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: group.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(group.name);

  function confirmEdit() {
    if (value.trim()) onRename(group.id, value.trim());
    setEditing(false);
  }

  return (
    <div ref={setNodeRef} style={style} className="d-flex align-items-center gap-4">
      {/* 拖曳把手 */}
      <span
        {...attributes}
        {...listeners}
        className="text-muted"
        style={{ cursor: 'grab', touchAction: 'none' }}
        title="拖曳排列群組"
      >
        <GripVertical size={14} />
      </span>

      {editing ? (
        <>
          <input
            className="form-control form-control-sm"
            style={{ width: 120 }}
            name="group_name_edit"
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && confirmEdit()}
            autoFocus
          />
          <button className="btn btn-sm btn-success" onClick={confirmEdit}>
            <Check size={12} />
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => setEditing(false)}>
            <X size={12} />
          </button>
        </>
      ) : (
        <>
          <button
            className={`btn btn-sm rounded-pill ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => onSelect(group.id)}
          >
            {group.name}
            {isDefault && <span className="ms-1 text-warning">★</span>}
          </button>
          <button
            className="btn btn-sm btn-link p-0 text-muted"
            title="改名"
            onClick={() => {
              setValue(group.name);
              setEditing(true);
            }}
          >
            <Pencil size={12} />
          </button>
          {!isDefault && (
            <button
              className="btn btn-sm btn-link p-0 text-muted"
              title="設為預設群組"
              onClick={() => onSetDefault(group.id)}
            >
              <BookmarkCheck size={12} />
            </button>
          )}
          <button
            className="btn btn-sm btn-link p-0 text-danger"
            title="刪除群組"
            onClick={() => {
              if (confirm(`確定刪除「${group.name}」群組？`)) onDelete(group.id);
            }}
          >
            <Trash2 size={12} />
          </button>
        </>
      )}
    </div>
  );
}

// 主元件
export default function MyWishlist() {
  const user = useSelector(authUser);
  const {
    wishlist,
    loading,
    error,
    getWishlist,
    toggleStock,
    addGroup,
    renameGroup,
    deleteGroup,
    setDefaultGroup,
    addStockToGroup,
    removeStockFromGroup,
    reorderStocks,
    reorderGroups,
  } = useWishlist();

  const [activeGroupId, setActiveGroupId] = useState(undefined);
  const [addSymbol, setAddSymbol] = useState('');
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // 整理過的資料
  const wishlistGroups = wishlist?.groups ?? EMPTY_GROUPS;
  const groups = useMemo(() => {
    return [...wishlistGroups].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [wishlistGroups]);

  const defaultGroup = useMemo(() => {
    if (!wishlist) return null;
    return wishlist.groups.find((g) => g.id === wishlist.defaultGroupId) || wishlist.groups[0];
  }, [wishlist]);

  const allStocks = useMemo(() => {
    if (!wishlist) return [];
    const set = new Set(wishlist.stocks);
    return wishlist.stockOrder.filter((s) => set.has(s));
  }, [wishlist]);

  const resolvedActiveGroupId =
    activeGroupId === undefined ? (defaultGroup?.id ?? null) : activeGroupId;

  // dnd-kit sensor：需拖曳 8px 才觸發，避免誤觸點擊
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  //  未登入
  if (!user) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-80 gap-16">
        <Heart size={48} className="text-primary" />
        <p className="h5 font-zh-tw text-muted">請先登入才能使用自選股功能</p>
      </div>
    );
  }

  // 載入中
  if (loading || !wishlist) {
    if (!loading && error) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center py-80 gap-16">
          <p className="h6 text-danger m-0">{error}</p>
          <button className="btn btn-outline-primary btn-sm" onClick={() => getWishlist(user.id)}>
            重新載入
          </button>
        </div>
      );
    }

    return (
      <div className="d-flex justify-content-center py-80">
        <BeatLoader color="var(--bs-primary)" />
      </div>
    );
  }

  // ── 顯示的股票 ──
  const displayStocks = resolvedActiveGroupId
    ? allStocks.filter((s) =>
        groups.find((g) => g.id === resolvedActiveGroupId)?.stockIds.includes(String(s))
      )
    : allStocks;

  // ── 股票拖曳結束 ──
  function handleStockDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = allStocks.indexOf(active.id);
    const newIdx = allStocks.indexOf(over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const newOrder = arrayMove(allStocks, oldIdx, newIdx);
    reorderStocks(newOrder);
  }

  // ── 群組拖曳結束 ──
  function handleGroupDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const groupIds = groups.map((g) => g.id);
    const oldIdx = groupIds.indexOf(active.id);
    const newIdx = groupIds.indexOf(over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const newGroupIds = arrayMove(groupIds, oldIdx, newIdx);
    reorderGroups(newGroupIds);
  }

  function handleAddStock(e) {
    e.preventDefault();
    const sym = addSymbol.trim().toUpperCase();
    if (!sym) return;
    toggleStock(sym);
    setAddSymbol('');
  }

  function handleAddGroup() {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setNewGroupName('');
      setShowNewGroupInput(false);
    }
  }

  function handleRemoveFromGroup(groupId, symbol, isInGroup) {
    isInGroup ? removeStockFromGroup(groupId, symbol) : addStockToGroup(groupId, symbol);
  }

  return (
    <div className="py-24 py-lg-40">
      <h2 className="fs-bold mb-24 font-zh-tw h1-lg">我的好股</h2>

      {/* ── 群組 Tabs（可拖曳）── */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleGroupDragEnd}
      >
        <SortableContext items={groups.map((g) => g.id)} strategy={horizontalListSortingStrategy}>
          <div className="d-flex flex-wrap align-items-center gap-8 mb-16">
            {/* 全部 tab（不可拖曳） */}
            <button
              className={`btn btn-sm rounded-pill ${!resolvedActiveGroupId ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveGroupId(null)}
            >
              全部
            </button>

            {groups.map((g) => (
              <SortableGroupTab
                key={g.id}
                group={g}
                isActive={resolvedActiveGroupId === g.id}
                isDefault={g.id === defaultGroup?.id}
                onSelect={setActiveGroupId}
                onRename={renameGroup}
                onDelete={(id) => {
                  deleteGroup(id);
                  if (resolvedActiveGroupId === id) setActiveGroupId(null);
                }}
                onSetDefault={setDefaultGroup}
              />
            ))}

            {/* 新增群組 */}
            {showNewGroupInput ? (
              <div className="d-flex align-items-center gap-4">
                <input
                  className="form-control form-control-sm"
                  style={{ width: 120 }}
                  name="new_group_name"
                  autoComplete="off"
                  placeholder="群組名稱"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
                  autoFocus
                />
                <button className="btn btn-sm btn-success" onClick={handleAddGroup}>
                  <Check size={12} />
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setShowNewGroupInput(false)}
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                className="btn btn-sm btn-outline-primary rounded-pill"
                onClick={() => setShowNewGroupInput(true)}
              >
                <Plus size={14} /> 新增群組
              </button>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* ── 快速加入收藏 ── */}
      <form className="d-flex gap-8 mb-16" onSubmit={handleAddStock}>
        <input
          className="form-control form-control-sm"
          style={{ maxWidth: 160 }}
          name="stock_symbol"
          autoComplete="off"
          placeholder="輸入代碼，如 2330"
          value={addSymbol}
          onChange={(e) => setAddSymbol(e.target.value)}
        />
        <button type="submit" className="btn btn-sm btn-primary">
          <Plus size={14} /> 加入收藏
        </button>
      </form>

      {/* ── 股票清單（可拖曳）── */}
      {allStocks.length === 0 ? (
        <div className="text-center text-muted py-48 font-zh-tw">
          <Heart size={36} className="mb-16 text-primary" />
          <p>還沒有收藏任何股票</p>
        </div>
      ) : displayStocks.length === 0 && resolvedActiveGroupId ? (
        <div className="text-center text-muted py-48 font-zh-tw">
          <p>此群組尚無股票</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleStockDragEnd}
        >
          <SortableContext items={displayStocks} strategy={verticalListSortingStrategy}>
            <div className="border rounded-3 overflow-hidden">
              {displayStocks.map((symbol) => (
                <SortableStockRow
                  key={symbol}
                  symbol={symbol}
                  groups={groups}
                  activeGroupId={resolvedActiveGroupId}
                  onRemoveFromGroup={handleRemoveFromGroup}
                  onToggle={toggleStock}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
