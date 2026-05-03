import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiRefreshCw } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import ReturnCard from '../../components/return/ReturnCard';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import returnService from '../../api/returnService';

const ReturnsListPage = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  const statusOptions = [
    { value: '', label: 'الكل' },
    { value: 'Pending', label: 'فى انتظار البائع' },
    { value: 'Approved', label: 'تمت الموافقة' },
    { value: 'Shipped', label: 'تم الشحن' },
    { value: 'Received', label: 'تم الاستلام' },
    { value: 'Refunded', label: 'تم الإرجاع' },
    { value: 'Rejected', label: 'مرفوض' },
    { value: 'Cancelled', label: 'ملغى' },
  ];

  const fetchReturns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await returnService.getMyReturns({
        pageNumber: currentPage,
        pageSize: 10,
      });

      let items = data.items || data || [];

      // Filter by status (client-side للبساطة)
      if (statusFilter) {
        items = items.filter((r) => r.status === statusFilter);
      }

      setReturns(items);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError('فشل فى تحميل طلبات الإرجاع');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [currentPage, statusFilter]);

  return (
    <>
      <SEO
        title="طلبات الإرجاع"
        description="تابع جميع طلبات الإرجاع الخاصة بك ومراجعة حالتها"
        noindex
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'الرئيسية', link: '/' },
            { label: 'طلباتى', link: '/orders' },
            { label: 'طلبات الإرجاع' },
          ]}
        />

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FiRefreshCw /> طلبات الإرجاع
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              تابع طلبات الإرجاع الخاصة بك
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">تصفية:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field py-1.5 px-3 text-sm"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="text-sm text-blue-900">
              <p className="font-bold mb-1">معلومة مهمة:</p>
              <p>
                يمكنك طلب إرجاع أى منتج خلال <strong>14 يوم</strong> من تاريخ
                استلامه. الفلوس بترجع بنفس طريقة الدفع الأصلية.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchReturns} />
        ) : returns.length === 0 ? (
          <EmptyState
            icon="🔄"
            title="لا توجد طلبات إرجاع"
            message={
              statusFilter
                ? 'لا توجد نتائج بهذه الحالة'
                : 'لم تقم بإنشاء أى طلبات إرجاع بعد'
            }
            action={
              <Link to="/orders" className="btn-primary">
                عرض طلباتى
              </Link>
            }
          />
        ) : (
          <>
            <div className="space-y-4">
              {returns.map((returnRequest) => (
                <ReturnCard
                  key={returnRequest.id}
                  returnRequest={returnRequest}
                  basePath="/returns"
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ReturnsListPage;