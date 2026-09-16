import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DataPaginationProps = Readonly<{
  handlePagination: (page: number) => void;
  data: { count: number };
}>;

const DataPagination = ({ handlePagination, data }: DataPaginationProps) => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const totalPages = Math.ceil(data.count / 10);

  const paginationRange = getPaginationRange(pageIndex, totalPages);
  const router = useRouter();

  const handleClick = (e: number) => {
    handlePagination(e - 1);
    setPageIndex(e);
    router.push(`?page=${e}&size=10`);
  };

  const handleNextPrev = (e: string) => {
    if (e === "next") {
      const res = pageIndex + 1;
      handlePagination(pageIndex);
      setPageIndex(res);
    } else {
      const res = pageIndex - 1;

      handlePagination(res - 1);
      setPageIndex(res);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`${
              pageIndex <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            } `}
            onClick={() => handleNextPrev("previous")}
          />
        </PaginationItem>

        {paginationRange.map((page, idx) => {
          if (page === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={pageIndex === page}
                onClick={() => handleClick(page as number)}
                className={`${
                  pageIndex === page ? "bg-secondary text-white dark:text-white pointer-events-none" : ""
                } cursor-pointer`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            className={`${
              pageIndex === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            } `}
            onClick={() => handleNextPrev("next")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DataPagination;

const getPaginationRange = (currentPage: number, totalPages: number) => {
  const delta = 1; // Nombre de pages à afficher de chaque côté de la page actuelle
  const range: (number | "ellipsis")[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // Toujours afficher la première page
      i === totalPages || // Toujours afficher la dernière page
      (i >= currentPage - delta && i <= currentPage + delta) // Pages autour de la page active
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== "ellipsis") {
      range.push("ellipsis");
    }
  }

  return range;
};
