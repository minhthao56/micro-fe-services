import { useMemo, useState } from "react";

export function usePage(total: number, rowsPerPage: number = 10) {
  const [page, setPage] = useState(1);


  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total]);

  const handleNextPage = () => {
    if (page === pages) return;
    setPage(prevPage => Math.min(prevPage + 1, pages));
  };

  return {
    page,
    setPage,
    handleNextPage,
    pages,
    rowsPerPage,
  };
}
