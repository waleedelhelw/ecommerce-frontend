import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { getOrderById, updateOrderStatus } from '../../api/seller/sellerOrderService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { orderStatusMap, getStatusInfo } from '../../utils/orderStatusMap';
import { ORDER_STATUS, PAYMENT_LABELS } from '../../utils/constants';
import toast from 'react-hot-toast';

const SellerOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderById(id);
      setOrder(data);
      setNewStatus(data.status);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل تفاصيل الطلب');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order.status) return;
    try {
      setUpdating(true);
      await updateOrderStatus(id, newStatus);
      toast.success('تم تحديث حالة الطلب بنجاح');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'حدث خطأ في تحديث الحالة');
    } finally {
      setUpdating(false);
    }
  };

  // Helper لعرض طريقة الدفع
  const getPaymentMethodLabel = (method) => {
    if (!method) return 'غير محدد';
    return PAYMENT_LABELS?.[method] || method;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrder} />;
  if (!order) return null;

  const status = getStatusInfo(orderStatusMap, order.status);

  return (
    <div>
      {/* العنوان */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/seller/orders')} className="p-2 hover:bg-gray-100 rounded-lg">
          <FiArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">طلب #{order.id}</h1>
          <p className="text-gray-500 text-sm">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* العمود الرئيسي */}
        <div className="lg:col-span-2 space-y-6">
          {/* عناصر الطلب */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">عناصر الطلب</h2>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.productImageUrl || '/placeholder-product.png'}
                    alt={item.productName}
                    className="w-14 h-14 rounded-lg object-cover"
                    onError={(e) => { e.target.src = '/placeholder-product.png'; }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-800">{formatPrice(item.totalPrice)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* العنوان */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">عنوان الشحن</h2>
            <div className="text-gray-600 space-y-1">
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingCity}
                {order.shippingCity && order.shippingCountry && '، '}
                {order.shippingCountry}
              </p>
              {order.orderNotes && (
                <p className="mt-3 text-sm bg-yellow-50 p-3 rounded-lg">
                  📝 ملاحظات: {order.orderNotes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* العمود الجانبي */}
        <div className="space-y-6">
          {/* ملخص مالي */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">الملخص المالي</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">إجمالي الطلب</span>
                <span className="font-medium">{formatPrice(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">عمولة الموقع</span>
                <span className="text-red-600">- {formatPrice(order.commissionAmount)}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">نصيبك</span>
                <span className="font-bold text-green-600">{formatPrice(order.sellerAmount)}</span>
              </div>
              {order.paymentMethod && (
                <>
                  <hr />
                  <div className="flex justify-between">
                    <span className="text-gray-500">طريقة الدفع</span>
                    <span className="font-medium">{getPaymentMethodLabel(order.paymentMethod)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* بيانات العميل */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">العميل</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p>👤 {order.userName}</p>
              <p>📧 {order.userEmail}</p>
            </div>
          </div>

          {/* تحديث الحالة */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">حالة الطلب</h2>

            <div className="mb-4">
              <span className={`text-sm px-3 py-1.5 rounded-full ${status.color}`}>
                {status.icon} {status.label}
              </span>
            </div>

            {order.status !== ORDER_STATUS.CANCELLED && order.status !== ORDER_STATUS.DELIVERED && (
              <div className="space-y-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Pending">في الانتظار</option>
                  <option value="Processing">قيد التجهيز</option>
                  <option value="Shipped">تم الشحن</option>
                  <option value="Delivered">تم التسليم</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || newStatus === order.status}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                >
                  {updating ? 'جاري التحديث...' : 'تحديث الحالة'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetailsPage;