import { useMemo, useState } from "react";

export function useTableSearch<T extends Record<string, unknown>>(
  data: T[],
  searchKeys: (keyof T)[]
) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q))
    );
  }, [data, query, searchKeys]);

  return { filtered, query, setQuery };
}
