import { useState } from 'react';

const usePagination = (initialPage = 1, initialPageSize = 12) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setTotalPages,
    setTotalItems,
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage,
  };
};

export default usePagination;