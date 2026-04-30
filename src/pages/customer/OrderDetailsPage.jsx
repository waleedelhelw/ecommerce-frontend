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
import { PAYMENT_LABELS } from '../../utils/constants';
import toast from 'react-hot-toast';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showConfirmDeliveryDialog, setShowConfirmDeliveryDialog] = useState(false);

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

  // ✅ تأكيد استلام الطلب
  const handleConfirmDelivery = async () => {
    try {
      setConfirmLoading(true);
      await orderService.confirmDelivery(id);
      toast.success('تم تأكيد الاستلام بنجاح! شكراً لك 🎉');
      setShowConfirmDeliveryDialog(false);
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل تأكيد الاستلام');
    } finally {
      setConfirmLoading(false);
    }
  };

  // ✅ Helper function لعرض طريقة الدفع
  const getPaymentMethodLabel = (method) => {
    if (!method) return 'غير محدد';
    return PAYMENT_LABELS[method] || method;
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrder} />;
  if (!order) return <ErrorMessage message="الطلب غير موجود" />;

  const status = orderStatusMap[order.status] || orderStatusMap.Pending;
  const canCancel = order.status === 'Pending' || order.status === 'Processing';
const canConfirmDelivery = order.status === 'Shipped' || order.status === 'Delivered';
  const needsPayment = order.status === 'PendingPayment' || order.status === 'PaymentFailed';

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

      {/* ✅ تنبيهات مهمة حسب حالة الطلب */}
      {needsPayment && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💳</span>
            <div>
              <p className="font-bold text-orange-800">الطلب في انتظار الدفع</p>
              <p className="text-sm text-orange-600">
                {order.status === 'PaymentFailed'
                  ? 'الإيصال السابق اترفض — يمكنك رفع إيصال جديد'
                  : 'يرجى إتمام الدفع ورفع إيصال التحويل'}
              </p>
            </div>
          </div>
          <Link
            to={`/orders/${order.id}/payment`}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            💳 إتمام الدفع
          </Link>
        </div>
      )}

      {order.status === 'WaitingConfirmation' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="font-bold text-blue-800">جاري مراجعة الإيصال</p>
            <p className="text-sm text-blue-600">تم رفع الإيصال بنجاح وجاري المراجعة من الإدارة</p>
          </div>
        </div>
      )}

      {canConfirmDelivery && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <p className="font-bold text-green-800">
                {order.status === 'Shipped' ? 'طلبك في الطريق إليك!' : 'تم توصيل طلبك'}
              </p>
              <p className="text-sm text-green-600">لو استلمت الطلب، أكد الاستلام عشان البائع ياخد فلوسه</p>
            </div>
          </div>
          <button
            onClick={() => setShowConfirmDeliveryDialog(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            ✅ تأكيد الاستلام
          </button>
        </div>
      )}

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
            {/* ✅ عرض طريقة الدفع بشكل صحيح */}
            <div className="flex justify-between">
              <span className="text-gray-500">طريقة الدفع:</span>
              <span className="font-medium">
                {getPaymentMethodLabel(order.paymentMethod)}
              </span>
            </div>

            {/* معلومات البائع */}
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

            {/* ✅ تفاصيل المبالغ */}
            <div className="flex justify-between">
              <span className="text-gray-500">المجموع:</span>
              <span className="font-medium">{formatPrice(order.totalPrice || order.totalAmount)}</span>
            </div>

            {order.shippingCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">الشحن:</span>
                <span className="font-medium">{formatPrice(order.shippingCost)}</span>
              </div>
            )}

            {order.codFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">رسوم الدفع عند الاستلام:</span>
                <span className="font-medium text-orange-600">{formatPrice(order.codFee)}</span>
              </div>
            )}

            {order.commissionAmount > 0 && (
              <div className="flex justify-between text-xs text-gray-400">
                <span>عمولة المنصة:</span>
                <span>{formatPrice(order.commissionAmount)}</span>
              </div>
            )}

            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>الإجمالي:</span>
              <span className="text-blue-600">
                {formatPrice(
                  (order.totalPrice || order.totalAmount || 0) +
                  (order.shippingCost || 0) +
                  (order.codFee || 0)
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-4">📍 عنوان الشحن</h2>
          <div className="space-y-2 text-sm">
            <p>{order.shippingAddress || 'غير محدد'}</p>
            <p>
              {order.shippingCity}
              {order.shippingCity && order.shippingCountry && '، '}
              {order.shippingCountry || ''}
            </p>
          </div>
          {order.orderNotes && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium text-sm text-gray-500 mb-1">📝 ملاحظات:</h3>
              <p className="text-sm">{order.orderNotes}</p>
            </div>
          )}

          {/* ✅ عرض إيصال الدفع لو موجود */}
          {order.payment?.receiptImageUrl && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium text-sm text-gray-500 mb-2">🧾 إيصال الدفع:</h3>
              <a
                href={order.payment.receiptImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                📄 عرض الإيصال
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ✅ استخدام order.items بدل order.orderItems */}
      <div className="mb-6">
        <OrderItems items={order.items || order.orderItems || []} />
      </div>

      {/* ✅ الأزرار */}
      <div className="flex flex-wrap gap-3">
        {/* زرار تأكيد الاستلام */}
        {canConfirmDelivery && (
          <button
            onClick={() => setShowConfirmDeliveryDialog(true)}
            disabled={confirmLoading}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium
                       hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {confirmLoading ? 'جاري التأكيد...' : '✅ تأكيد الاستلام'}
          </button>
        )}

        {/* زرار إتمام الدفع */}
        {needsPayment && (
          <Link
            to={`/orders/${order.id}/payment`}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium
                       hover:bg-blue-700 transition-colors"
          >
            💳 إتمام الدفع
          </Link>
        )}

        {/* زرار إلغاء الطلب */}
        {canCancel && (
          <button onClick={() => setShowCancelDialog(true)} className="btn-danger">
            ❌ إلغاء الطلب
          </button>
        )}

        <button onClick={() => navigate('/orders')} className="btn-secondary">
          ← رجوع لطلباتي
        </button>
      </div>

      {/* ✅ Dialog تأكيد الاستلام */}
      <ConfirmDialog
        isOpen={showConfirmDeliveryDialog}
        onClose={() => setShowConfirmDeliveryDialog(false)}
        onConfirm={handleConfirmDelivery}
        title="تأكيد استلام الطلب"
        message="هل استلمت الطلب فعلاً؟ بعد التأكيد هيتم تحويل المبلغ للبائع ومش هتقدر ترجع الطلب."
        confirmText={confirmLoading ? 'جاري التأكيد...' : '✅ أيوه، استلمت الطلب'}
      />

      {/* Dialog إلغاء الطلب */}
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