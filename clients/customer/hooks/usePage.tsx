import { useMemo, useState } from "react";
import { usePrevious } from "./usePrevious";

export function usePage(total: number, rowsPerPage: number = 10) {
  const [page, setPage] = useState(1);

  const prevPage = usePrevious(page);

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total]);

  const handleNextPage = () => {
    if (prevPage === page || page === pages) return;
    setPage((prev) => prev + 1);
  };

  return {
    page,
    setPage,
    handleNextPage,
    pages,
    rowsPerPage,
    prevPage,
  };
}
