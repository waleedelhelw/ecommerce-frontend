import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

const FinancePagination = ({ pagination, onPageChange, onPageSizeChange }) => {
  const { currentPage, totalPages, totalCount, pageSize } = pagination;

  if (totalPages <= 1 && totalCount <= 10) return null;

  // ============ بناء أرقام الصفحات ============
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  // ============ حساب النطاق الحالي ============
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="bg-white rounded-xl border p-4 mt-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* المعلومات */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            عرض <span className="font-semibold text-gray-700">{startItem}</span> -{' '}
            <span className="font-semibold text-gray-700">{endItem}</span> من{' '}
            <span className="font-semibold text-gray-700">{totalCount}</span>
          </span>

          {/* Page Size Selector */}
          {onPageSizeChange && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-500">عرض</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="px-2 py-1 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          )}
        </div>

        {/* أزرار الصفحات */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {/* السابق */}
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              title="السابق"
            >
              <FiChevronRight size={16} />
            </button>

            {/* أرقام الصفحات */}
            {getPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span key={`dots-${idx}`} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-green-600 text-white'
                      : 'border hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            {/* التالي */}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              title="التالي"
            >
              <FiChevronLeft size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancePagination;