import { useState, useEffect } from 'react';
import { FiDollarSign } from 'react-icons/fi';
import {
  getFinanceSummary,
  getTransactions,
  getYearlyReport,
} from '../../api/seller/sellerFinanceService';
import ErrorMessage from '../../components/common/ErrorMessage';
import FinanceSummaryCards from '../../components/seller/finance/FinanceSummaryCards';
import FinanceStatsCards from '../../components/seller/finance/FinanceStatsCards';
import TransactionFilters from '../../components/seller/finance/TransactionFilters';
import TransactionsTable from '../../components/seller/finance/TransactionsTable';
import TransactionDetailsModal from '../../components/seller/finance/TransactionDetailsModal';
import EarningsChart from '../../components/seller/finance/EarningsChart';
import EarningsBreakdownChart from '../../components/seller/finance/EarningsBreakdownChart';
import FinancePagination from '../../components/seller/finance/FinancePagination';
import {
  SummaryCardsSkeleton,
  StatsCardsSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from '../../components/seller/finance/FinanceSkeletons';

const initialFilters = {
  type: '',
  status: '',
  fromDate: '',
  toDate: '',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  pageNumber: 1,
  pageSize: 10,
};

const SellerFinancePage = () => {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
  });
  const [yearlyReport, setYearlyReport] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const [loading, setLoading] = useState(true);
  const [loadingTx, setLoadingTx] = useState(false);
  const [error, setError] = useState(null);

  const [selectedTx, setSelectedTx] = useState(null);

  const currentYear = new Date().getFullYear();

  // ============ تحميل الـ Summary + Yearly Report ============
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [summaryData, reportData] = await Promise.all([
          getFinanceSummary(),
          getYearlyReport(currentYear),
        ]);
        setSummary(summaryData);
        setYearlyReport(reportData || null);
      } catch (err) {
        setError(err.response?.data?.message || 'حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // ============ تحميل الحركات عند تغيير الفلاتر ============
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoadingTx(true);

        // إزالة القيم الفاضية قبل البعت
        const cleanedFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '' && v !== null)
        );

        const data = await getTransactions(cleanedFilters);
        const items = data?.items || data?.data || data || [];
        setTransactions(items);
        setPagination({
          currentPage: data?.currentPage || data?.pageNumber || 1,
          totalPages: data?.totalPages || 1,
          totalCount: data?.totalCount || items.length,
          pageSize: data?.pageSize || filters.pageSize,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'حدث خطأ في تحميل المعاملات');
      } finally {
        setLoadingTx(false);
      }
    };

    loadTransactions();
  }, [filters]);

  // ============ Handlers ============
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      pageNumber: 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, pageNumber: page }));
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handlePageSizeChange = (size) => {
    setFilters((prev) => ({ ...prev, pageSize: size, pageNumber: 1 }));
  };

  const handleSort = (field, order) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field || 'createdAt',
      sortOrder: order || 'desc',
      pageNumber: 1,
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiDollarSign className="text-green-600" />
          المركز المالي
        </h1>
        <p className="text-gray-500 mt-1">
          تابع أرباحك ومعاملاتك المالية بكل سهولة
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* البطاقات الرئيسية */}
      {loading ? (
        <SummaryCardsSkeleton />
      ) : (
        <FinanceSummaryCards summary={summary} />
      )}

      {/* إحصائيات إضافية */}
      {loading ? (
        <StatsCardsSkeleton />
      ) : (
        <FinanceStatsCards summary={summary} />
      )}

      {/* الرسم البياني السنوي */}
      {loading ? (
        <ChartSkeleton />
      ) : (
        <EarningsChart data={yearlyReport} year={currentYear} />
      )}

      {/* تفصيل الأرباح - Pie Chart */}
      <EarningsBreakdownChart />

      {/* الفلاتر */}
      <TransactionFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* عنوان الجدول */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          📋 سجل المعاملات
          {pagination.totalCount > 0 && (
            <span className="text-sm text-gray-500 mr-2 font-normal">
              ({pagination.totalCount} معاملة)
            </span>
          )}
        </h2>

        {/* Sort Indicator */}
        {filters.sortBy && filters.sortBy !== 'createdAt' && (
          <span className="text-xs text-gray-500">
            مرتّب حسب: <span className="font-semibold text-green-600">{getSortLabel(filters.sortBy)}</span>
            {' '}
            ({filters.sortOrder === 'asc' ? '↑ تصاعدي' : '↓ تنازلي'})
          </span>
        )}
      </div>

      {/* جدول الحركات */}
      {loadingTx ? (
        <TableSkeleton rows={5} />
      ) : (
        <>
          <TransactionsTable
            transactions={transactions}
            onViewDetails={setSelectedTx}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSort={handleSort}
          />

          {/* Pagination */}
          {transactions.length > 0 && (
            <FinancePagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}

      {/* مودال التفاصيل */}
      {selectedTx && (
        <TransactionDetailsModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
};

// ============ Helper: تحويل sort field لاسم عربي ============
const getSortLabel = (field) => {
  const map = {
    id: 'الرقم',
    type: 'النوع',
    amount: 'المبلغ',
    status: 'الحالة',
    createdAt: 'التاريخ',
  };
  return map[field] || field;
};

export default SellerFinancePage;