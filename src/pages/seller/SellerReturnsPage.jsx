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
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiRefreshCw /> طلبات الإرجاع
        </h1>
        <p className="text-gray-500 mt-1">إدارة طلبات الإرجاع الواردة من العملاء</p>
      </div>

      {/* فلاتر الحالة */}
      <div className="bg-white rounded-xl border p-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setStatusFilter(filter.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${
                  statusFilter === filter.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pending Alert */}
      {returns.filter((r) => r.status === 'Pending').length > 0 &&
        statusFilter === '' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-yellow-900">
                لديك {returns.filter((r) => r.status === 'Pending').length} طلب
                إرجاع فى انتظار الرد
              </p>
              <p className="text-sm text-yellow-700">
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
        <div className="bg-white rounded-xl border p-12 text-center">
          <span className="text-5xl mb-3 block">📭</span>
          <p className="text-gray-400">لا توجد طلبات إرجاع</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    رقم الإرجاع
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    رقم الطلب
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    العميل
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    السبب
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    المبلغ
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    الحالة
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    التاريخ
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
                    عرض
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {returns.map((returnRequest) => {
                  const reasonInfo = getReturnReasonInfo(returnRequest.reason);
                  return (
                    <tr key={returnRequest.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-medium">
                        {returnRequest.returnNumber || `#${returnRequest.id}`}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <Link
                          to={`/seller/orders/${returnRequest.orderId}`}
                          className="text-blue-600 hover:underline"
                        >
                          #{returnRequest.orderId}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {returnRequest.userName}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <span className="flex items-center gap-1">
                          <span>{reasonInfo.icon}</span>
                          <span className="text-xs">{reasonInfo.label}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-emerald-600 font-medium">
                        {formatPrice(returnRequest.totalRefundAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <ReturnStatusBadge
                          status={returnRequest.status}
                          size="sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {formatDate(returnRequest.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          to={`/seller/returns/${returnRequest.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg inline-block"
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
            <div className="p-4 border-t">
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