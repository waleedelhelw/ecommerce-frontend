import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiPhone, FiPlus, FiShoppingBag, FiChevronLeft } from 'react-icons/fi';
import { getMyOrders } from '../../api/seller/sellerOrderService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { orderStatusMap, getStatusInfo } from '../../utils/orderStatusMap';
import CreateGuestOrderModal from '../../components/seller/CreateGuestOrderModal';

const statusGradients = {
  Pending: 'from-amber-400 to-orange-500',
  PendingPayment: 'from-amber-400 to-yellow-500',
  WaitingConfirmation: 'from-blue-400 to-indigo-500',
  PaymentConfirmed: 'from-emerald-400 to-green-500',
  Processing: 'from-sky-400 to-blue-500',
  ReadyToShip: 'from-violet-400 to-purple-500',
  Shipped: 'from-cyan-400 to-teal-500',
  Delivered: 'from-emerald-500 to-green-600',
  Completed: 'from-emerald-500 to-teal-500',
  Cancelled: 'from-red-400 to-rose-500',
  DeliveryFailed: 'from-rose-400 to-red-500',
  ReturnedToSeller: 'from-orange-400 to-amber-500',
};

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(false);

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
    { value: 'PendingPayment', label: 'بانتظار الدفع' },
    { value: 'WaitingConfirmation', label: 'مراجعة الدفع' },
    { value: 'PaymentConfirmed', label: 'الدفع مؤكد' },
    { value: 'Processing', label: 'قيد التجهيز' },
    { value: 'ReadyToShip', label: 'جاهز للشحن' },
    { value: 'Shipped', label: 'تم الشحن' },
    { value: 'Delivered', label: 'تم التسليم' },
    { value: 'Completed', label: 'مكتمل' },
    { value: 'Cancelled', label: 'ملغي' },
  ];

  const renderCustomerPhone = (phone) => {
    if (!phone) {
      return <span className="text-gray-400 text-xs">غير متوفر</span>;
    }
    return (
      <button
        type="button"
        dir="ltr"
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = `tel:${phone}`;
        }}
        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm"
      >
        <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
          <FiPhone size={12} />
        </div>
        {phone}
      </button>
    );
  };

  const StatusBadge = ({ status }) => {
    const info = getStatusInfo(orderStatusMap, status);
    const gradient = statusGradients[status] || 'from-gray-400 to-gray-500';
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r ${gradient} shadow-sm`}>
        <span>{info.icon}</span>
        <span>{info.label}</span>
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">الطلبات</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">طلباتي</h1>
          <p className="text-sm text-gray-500 mt-1">إدارة الطلبات الواردة لمتجرك</p>
        </div>
        <button
          onClick={() => setShowGuestModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all text-sm font-medium shadow-sm"
        >
          <FiPlus size={16} />
          إنشاء طلب خارجي
        </button>
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-3 mb-6 shadow-sm">
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
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-transparent'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchOrders} />
      ) : orders.length === 0 && statusFilter === '' ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiShoppingBag size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium">لا توجد طلبات</p>
          <p className="text-gray-300 text-sm mt-1">عندما يطلب أحد العملاء منتجاً، سيظهر هنا</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400">لا توجد طلبات بهذه الحالة</p>
        </div>
      ) : (
        <>
          {/* Mobile: Card layout */}
          <div className="md:hidden space-y-3">
            {orders.map((order) => {
              const info = getStatusInfo(orderStatusMap, order.status);
              return (
                <Link
                  key={order.id}
                  to={`/seller/orders/${order.id}`}
                  className="block bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-sm font-bold text-gray-900">#{order.id}</span>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {order.customerName || 'غير معروف'}
                      </p>
                      {order.customerEmail && (
                        <p className="text-xs text-gray-400 truncate">{order.customerEmail}</p>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">{formatPrice(order.totalPrice)}</p>
                      <p className="text-[11px] text-emerald-600 font-medium">
                        نصيبك: {formatPrice(order.sellerAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    {renderCustomerPhone(order.customerPhoneNumber)}
                    <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                      التفاصيل
                      <FiChevronLeft size={14} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Desktop: Table layout */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">رقم الطلب</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">العميل</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">رقم التواصل</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">الإجمالي</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">نصيبك</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">الحالة</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">التاريخ</th>
                    <th className="text-center px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">عرض</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-gray-900">#{order.id}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{order.customerName || 'غير معروف'}</p>
                          {order.customerEmail && (
                            <p className="text-xs text-gray-400 mt-0.5">{order.customerEmail}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {renderCustomerPhone(order.customerPhoneNumber)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-gray-900">{formatPrice(order.totalPrice)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-emerald-600">{formatPrice(order.sellerAmount)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Link
                          to={`/seller/orders/${order.id}`}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                          title="عرض تفاصيل الطلب"
                        >
                          <FiEye size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
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

          {/* Mobile: Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 md:hidden">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
      {showGuestModal && (
        <CreateGuestOrderModal
          onClose={() => setShowGuestModal(false)}
          onSuccess={() => {
            setShowGuestModal(false);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
};

export default SellerOrdersPage;