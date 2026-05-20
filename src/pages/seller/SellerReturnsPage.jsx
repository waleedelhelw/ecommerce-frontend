import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiRefreshCw } from 'react-icons/fi';
import sellerReturnService from '../../api/seller/sellerReturnService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import ReturnStatusBadge from '../../components/return/ReturnStatusBadge';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { getReturnReasonInfo } from '../../utils/returnStatusMap';

const SellerReturnsPage = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchReturns();
  }, [currentPage, statusFilter]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sellerReturnService.getSellerReturns({
        pageNumber: currentPage,
        pageSize: 10,
        status: statusFilter || undefined,
      });
      setReturns(data?.items || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ فى تحميل طلبات الإرجاع');
    } finally {
      setLoading(false);
    }
  };

  const statusFilters = [
    { value: '', label: 'الكل' },
    { value: 'Pending', label: '⏳ فى الانتظار' },
    { value: 'Approved', label: '✅ تمت الموافقة' },
    { value: 'Shipped', label: '📦 شحن العميل' },
    { value: 'Received', label: '📥 تم الاستلام' },
    { value: 'Refunded', label: '💰 تم الإرجاع' },
    { value: 'Rejected', label: '❌ مرفوض' },
    { value: 'Escalated', label: '⚠️ مصعّد' },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">الإرجاع</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">طلبات الإرجاع</h1>
        <p className="text-sm text-gray-500 mt-1">إدارة طلبات الإرجاع الواردة من العملاء</p>
      </div>

      {/* فلاتر الحالة */}
      <div className="bg-white rounded-2xl border border-gray-100 p-3 mb-4 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {statusFilters.map((filter) => {
            const active = statusFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => {
                  setStatusFilter(filter.value);
                  setCurrentPage(1);
                }}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  active
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-transparent'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pending Alert */}
      {returns.filter((r) => r.status === 'Pending').length > 0 &&
        statusFilter === '' && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-4 mb-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white font-bold">!</span>
            </div>
            <div>
              <p className="font-bold text-amber-900">
                لديك {returns.filter((r) => r.status === 'Pending').length} طلب
                إرجاع فى انتظار الرد
              </p>
              <p className="text-sm text-amber-700">
                يرجى مراجعتها فى أقرب وقت ممكن
              </p>
            </div>
          </div>
        )}

      {/* الجدول */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchReturns} />
      ) : returns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiRefreshCw size={32} className="text-orange-300" />
          </div>
          <p className="text-gray-400 font-medium">لا توجد طلبات إرجاع</p>
          <p className="text-gray-300 text-sm mt-1">سيتم إشعارك عند وجود طلبات إرجاع جديدة</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">رقم الإرجاع</th>
                  <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">رقم الطلب</th>
                  <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">العميل</th>
                  <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">السبب</th>
                  <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">المبلغ</th>
                  <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">الحالة</th>
                  <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">التاريخ</th>
                  <th className="text-center px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">عرض</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {returns.map((returnRequest) => {
                  const reasonInfo = getReturnReasonInfo(returnRequest.reason);
                  return (
                    <tr key={returnRequest.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-gray-900">{returnRequest.returnNumber || `#${returnRequest.id}`}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          to={`/seller/orders/${returnRequest.orderId}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          #{returnRequest.orderId}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-700">{returnRequest.customerName}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                          <span>{reasonInfo.icon}</span>
                          <span>{reasonInfo.label}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-emerald-600">{formatPrice(returnRequest.totalRefundAmount)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <ReturnStatusBadge status={returnRequest.status} size="sm" />
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-gray-400">{formatDate(returnRequest.createdAt)}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Link
                          to={`/seller/returns/${returnRequest.id}`}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                          title="عرض التفاصيل"
                        >
                          <FiEye size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-5 border-t border-gray-50">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerReturnsPage;