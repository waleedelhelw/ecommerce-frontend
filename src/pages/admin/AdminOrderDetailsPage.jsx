import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { getOrderById } from '../../api/admin/adminOrderService';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

const AdminOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في تحميل بيانات الطلب');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrder} />;
  if (!order) return null;

  return (
    <div>
      {/* العنوان */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/orders')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiArrowRight size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">طلب #{order.id}</h1>
          <p className="text-gray-500 text-sm">{formatDate(order.createdAt || order.orderDate)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* العمود الرئيسي */}
        <div className="lg:col-span-2 space-y-6">
          {/* المنتجات */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📦 المنتجات</h2>
            <div className="space-y-4">
              {(order.orderItems || order.items || []).map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-center gap-4 py-3 border-b last:border-0"
                >
                  {(item.imageUrl || item.productImageUrl) && (
                    <img
                      src={item.imageUrl || item.productImageUrl}
                      alt={item.productName || item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.productName || item.name}</p>
                    <p className="text-sm text-gray-500">
                      الكمية: {item.quantity} × {formatPrice(item.unitPrice || item.price)}
                    </p>
                  </div>
                  <p className="font-bold text-blue-600">
                    {formatPrice((item.unitPrice || item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* عنوان الشحن */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🚚 عنوان الشحن</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">العنوان</p>
                <p className="font-medium">{order.shippingAddress || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">المدينة</p>
                <p className="font-medium">{order.shippingCity || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">الدولة</p>
                <p className="font-medium">{order.shippingCountry || '—'}</p>
              </div>
              {order.orderNotes && (
                <div className="sm:col-span-2">
                  <p className="text-gray-500">ملاحظات</p>
                  <p className="font-medium">{order.orderNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* العمود الجانبي */}
        <div className="space-y-6">
          {/* ملخص الطلب */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">💰 ملخص الطلب</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">الإجمالي</span>
                <span className="font-bold text-lg">
                  {formatPrice(order.totalAmount || order.totalPrice)}
                </span>
              </div>
              {(order.commissionAmount > 0) && (
                <div className="flex justify-between">
                  <span className="text-gray-500">العمولة</span>
                  <span className="font-medium text-red-600">
                    {formatPrice(order.commissionAmount)}
                  </span>
                </div>
              )}
              {(order.sellerAmount > 0) && (
                <div className="flex justify-between">
                  <span className="text-gray-500">نصيب البائع</span>
                  <span className="font-medium text-green-600">
                    {formatPrice(order.sellerAmount)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* بيانات العميل */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">👤 العميل</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">الاسم: </span>
                <span className="font-medium">
                  {order.customerName || order.userName || 'غير معروف'}
                </span>
              </p>
              {(order.customerEmail || order.userEmail) && (
                <p>
                  <span className="text-gray-500">البريد: </span>
                  <span className="font-medium">{order.customerEmail || order.userEmail}</span>
                </p>
              )}
            </div>
          </div>

          {/* بيانات البائع */}
          {(order.sellerName || order.storeName) && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">🏪 البائع</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">المتجر: </span>
                  <span className="font-medium">{order.storeName || '—'}</span>
                </p>
                <p>
                  <span className="text-gray-500">البائع: </span>
                  <span className="font-medium">{order.sellerName || '—'}</span>
                </p>
              </div>
            </div>
          )}

          {/* الدفع */}
          {order.payment && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">💳 الدفع</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">الطريقة: </span>
                  <span className="font-medium">
                    {order.payment.paymentMethod || order.paymentMethod || '—'}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">الحالة: </span>
                  <span className="font-medium">
                    {order.payment.status || order.paymentStatus || '—'}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;