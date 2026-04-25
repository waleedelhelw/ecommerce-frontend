import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import { getMyOrders } from '../../api/seller/sellerOrderService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { orderStatusMap, getStatusInfo } from '../../utils/orderStatusMap';

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyOrders({
        pageNumber: currentPage,
        pageSize: 10,
        status: statusFilter || undefined,
      });
      setOrders(data?.items || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const statusFilters = [
    { value: '', label: 'الكل' },
    { value: 'Pending', label: 'في الانتظار' },
    { value: 'Processing', label: 'قيد التجهيز' },
    { value: 'Shipped', label: 'تم الشحن' },
    { value: 'Delivered', label: 'تم التسليم' },
    { value: 'Cancelled', label: 'ملغي' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">طلباتي</h1>
        <p className="text-gray-500 mt-1">إدارة الطلبات الواردة لمتجرك</p>
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
                ${statusFilter === filter.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* الجدول */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchOrders} />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-400">لا توجد طلبات</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">رقم الطلب</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">العميل</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">الإجمالي</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">نصيبك</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">الحالة</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">التاريخ</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">عرض</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => {
                  const status = getStatusInfo(orderStatusMap, order.status);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">#{order.id}</td>
                      <td className="px-4 py-3 text-gray-700">{order.userName}</td>
                      <td className="px-4 py-3 text-gray-700">{formatPrice(order.totalPrice)}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">{formatPrice(order.sellerAmount)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          to={`/seller/orders/${order.id}`}
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

export default SellerOrdersPage;