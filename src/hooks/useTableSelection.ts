import { useCallback, useState } from "react";

export function useTableSelection(items: { id: string | number }[] = []) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string | number) => {
    const key = String(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === items.length && items.length > 0) return new Set();
      return new Set(items.map((i) => String(i.id)));
    });
  }, [items]);

  const isSelected = useCallback(
    (id: string | number) => selectedIds.has(String(id)),
    [selectedIds]
  );

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const isAllSelected = items.length > 0 && selectedIds.size === items.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < items.length;
  const selectedCount = selectedIds.size;
  const selectedIdsArray = Array.from(selectedIds);

  return {
    selectedIds: selectedIdsArray,
    selectedCount,
    toggle,
    toggleAll,
    isSelected,
    isAllSelected,
    isIndeterminate,
    clearSelection,
  };
}
