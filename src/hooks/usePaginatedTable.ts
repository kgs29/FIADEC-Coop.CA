"use client";
import { useCallback, useEffect, useState } from "react";

export function usePaginatedTable(externalSearch?: string) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Revenir à la page 1 quand la recherche change
  useEffect(() => {
    setPage(1);
  }, [externalSearch]);

  const getPaginationRange = useCallback(
    (totalPages: number): (number | "ellipsis")[] => {
      const delta = 2;
      const range: (number | "ellipsis")[] = [];
      for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 ||
          i === totalPages ||
          (i >= page - delta && i <= page + delta)
        ) {
          range.push(i);
        } else if (range.at(-1) !== "ellipsis") {
          range.push("ellipsis");
        }
      }
      return range;
    },
    [page]
  );

  return { page, setPage, pageSize, setPageSize, getPaginationRange };
}
