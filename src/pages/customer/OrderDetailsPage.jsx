import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import OrderTimeline from '../../components/order/OrderTimeline';
import OrderItems from '../../components/order/OrderItems';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import orderService from '../../api/orderService';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';
import { orderStatusMap } from '../../utils/orderStatusMap';
import toast from 'react-hot-toast';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrder(id);
      setOrder(data);
    } catch (err) {
      setError('فشل في تحميل تفاصيل الطلب');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      setCancelLoading(true);
      await orderService.cancelOrder(id);
      toast.success('تم إلغاء الطلب بنجاح');
      setShowCancelDialog(false);
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إلغاء الطلب');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrder} />;
  if (!order) return <ErrorMessage message="الطلب غير موجود" />;

  const status = orderStatusMap[order.status] || orderStatusMap.Pending;
  const canCancel = order.status === 'Pending' || order.status === 'Processing';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'الرئيسية', link: '/' },
          { label: 'طلباتي', link: '/orders' },
          { label: `طلب #${order.id}` },
        ]}
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">📋 تفاصيل الطلب #{order.id}</h1>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
          {status.icon} {status.label}
        </span>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-bold mb-4">مسار الطلب</h2>
        <OrderTimeline currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-4">📋 معلومات الطلب</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">رقم الطلب:</span>
              <span className="font-medium">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">تاريخ الطلب:</span>
              <span className="font-medium">{formatDate(order.createdAt || order.orderDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">طريقة الدفع:</span>
              <span className="font-medium">{order.paymentMethod || 'غير محدد'}</span>
            </div>

            {/* 🆕 معلومات البائع */}
            {(order.storeName || order.sellerName) && (
              <div className="flex justify-between">
                <span className="text-gray-500">المتجر:</span>
                <Link
                  to={`/sellers/${order.sellerId}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  🏪 {order.storeName || order.sellerName}
                </Link>
              </div>
            )}

            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>الإجمالي:</span>
              <span className="text-blue-600">{formatPrice(order.totalAmount || order.totalPrice)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-4">📍 عنوان الشحن</h2>
          <div className="space-y-2 text-sm">
            <p>{order.shippingAddress || 'غير محدد'}</p>
            <p>
              {order.shippingCity || order.city}
              {(order.shippingCity || order.city) && '، '}
              {order.shippingCountry || order.country || ''}
            </p>
          </div>
          {(order.orderNotes || order.notes) && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium text-sm text-gray-500 mb-1">📝 ملاحظات:</h3>
              <p className="text-sm">{order.orderNotes || order.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <OrderItems items={order.orderItems || order.items || []} />
      </div>

      <div className="flex gap-3">
        {canCancel && (
          <button onClick={() => setShowCancelDialog(true)} className="btn-danger">
            ❌ إلغاء الطلب
          </button>
        )}
        <button onClick={() => navigate('/orders')} className="btn-secondary">
          ← رجوع لطلباتي
        </button>
      </div>

      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelOrder}
        title="إلغاء الطلب"
        message="هل أنت متأكد من إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText={cancelLoading ? 'جاري الإلغاء...' : 'نعم، إلغاء الطلب'}
        danger
      />
    </div>
  );
};

export default OrderDetailsPage;