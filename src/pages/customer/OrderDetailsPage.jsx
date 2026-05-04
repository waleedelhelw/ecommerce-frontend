import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import OrderTimeline from '../../components/order/OrderTimeline';
import OrderItems from '../../components/order/OrderItems';
import InstallmentTimeline from '../../components/order/InstallmentTimeline';
import PayInstallmentModal from '../../components/order/PayInstallmentModal';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ReturnStatusBadge from '../../components/return/ReturnStatusBadge';
import orderService from '../../api/orderService';
import returnService from '../../api/returnService';
import installmentService from '../../api/installmentService';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';
import { orderStatusMap } from '../../utils/orderStatusMap';
import { PAYMENT_LABELS } from '../../utils/constants';
import { checkOrderReturnable } from '../../utils/returnStatusMap';
import { FiRefreshCw, FiEye } from 'react-icons/fi';
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

  // 🆕 ✅ State للأقساط
  const [installments, setInstallments] = useState([]);
  const [installmentsLoading, setInstallmentsLoading] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);

  // State للـ Return الموجود
  const [activeReturn, setActiveReturn] = useState(null);
  const [checkingReturn, setCheckingReturn] = useState(true);

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

  // 🆕 ✅ جلب الأقساط
  const fetchInstallments = async () => {
    try {
      setInstallmentsLoading(true);
      const data = await installmentService.getOrderInstallments(id);
      setInstallments(data || []);
    } catch (err) {
      console.error('Failed to fetch installments:', err);
      setInstallments([]);
    } finally {
      setInstallmentsLoading(false);
    }
  };

  // نشيك لو فيه return نشط لهذا الأوردر
  const checkActiveReturn = async () => {
    try {
      setCheckingReturn(true);
      const data = await returnService.getActiveReturnForOrder(parseInt(id));
      setActiveReturn(data);
    } catch (err) {
      console.error('Failed to check active return:', err);
    } finally {
      setCheckingReturn(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // لما الأوردر يتحمل
  useEffect(() => {
    if (order?.id) {
      // 🆕 ✅ لو الطلب بالتقسيط → جلب الأقساط
      if (order.isInstallment || order.installmentPlanId) {
        fetchInstallments();
      }

      // نشيك على الـ returns
      if (
        order.status === 'Delivered' ||
        order.status === 'Completed' ||
        order.status === 'Refunded'
      ) {
        checkActiveReturn();
      } else {
        setCheckingReturn(false);
      }
    }
  }, [order]);

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

  // 🆕 ✅ فتح Modal دفع الدفعة
  const handlePayInstallment = (installment) => {
    setSelectedInstallment(installment);
    setShowPayModal(true);
  };

  // 🆕 ✅ بعد نجاح دفع الدفعة
  const handlePaySuccess = () => {
    toast.success('تم رفع إيصال الدفع بنجاح! جاري المراجعة 🧾');
    fetchInstallments();
    fetchOrder();
  };

  // Helper function لعرض طريقة الدفع
  const getPaymentMethodLabel = (method) => {
    if (!method) return 'غير محدد';
    return PAYMENT_LABELS[method] || method;
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrder} />;
  if (!order) return <ErrorMessage message="الطلب غير موجود" />;

  const status = orderStatusMap[order.status] || orderStatusMap.Pending;
  const canCancel = order.status === 'Pending' || order.status === 'Processing';
  const canConfirmDelivery = order.status === 'Shipped';
  const isDelivered = order.status === 'Delivered';
  const isCompleted = order.status === 'Completed';
  const needsPayment = order.status === 'PendingPayment' || order.status === 'PaymentFailed';

  // 🆕 ✅ هل الطلب بالتقسيط؟
  const isInstallmentOrder = order.isInstallment || order.installmentPlanId || installments.length > 0;

  // التحقق من إمكانية الإرجاع
  const returnableInfo = checkOrderReturnable(order);
  const canRequestReturn = returnableInfo.canReturn && !activeReturn;

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
        <div>
          <h1 className="text-2xl font-bold">📋 تفاصيل الطلب #{order.id}</h1>
          {/* 🆕 ✅ Badge التقسيط */}
          {isInstallmentOrder && (
            <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              📋 طلب بالتقسيط
            </span>
          )}
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
          {status.icon} {status.label}
        </span>
      </div>

      {/* ✅ تنبيهات مهمة حسب حالة الطلب */}
      {needsPayment && !isInstallmentOrder && (
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

      {/* 🆕 ✅ تنبيه التقسيط - الدفعة الأولى */}
      {isInstallmentOrder && needsPayment && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-bold text-blue-800">طلب بالتقسيط - ادفع الدفعة الأولى</p>
              <p className="text-sm text-blue-600">
                لازم تدفع الدفعة الأولى عشان الطلب يتأكد ويبدأ التجهيز. شوف جدول الدفعات تحت 👇
              </p>
            </div>
          </div>
        </div>
      )}

      {order.status === 'WaitingConfirmation' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="font-bold text-blue-800">جاري مراجعة الإيصال</p>
            <p className="text-sm text-blue-600">
              تم رفع الإيصال بنجاح وجاري المراجعة من الإدارة
            </p>
          </div>
        </div>
      )}

      {/* Banner: الطلب في الطريق */}
      {canConfirmDelivery && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <p className="font-bold text-green-800">طلبك في الطريق إليك!</p>
              <p className="text-sm text-green-600">
                لو استلمت الطلب، أكد الاستلام عشان البائع ياخد فلوسه
              </p>
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

      {/* Banner بعد تأكيد الاستلام */}
      {isDelivered && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3 flex-wrap">
          <span className="text-3xl">✅</span>
          <div className="flex-1">
            <p className="font-bold text-blue-800">تم تأكيد استلام الطلب</p>
            <p className="text-sm text-blue-600 mt-1">
              شكراً لك! سيتم إكمال الطلب تلقائياً خلال 3 أيام وتحويل المبلغ للبائع.
            </p>
            {/* 🆕 ✅ تنبيه الأقساط المتبقية */}
            {isInstallmentOrder && installments.some(i => i.status === 'Pending' || i.status === 'Overdue') && (
              <p className="text-xs text-orange-600 mt-2 font-bold">
                ⚠️ لسه عندك دفعات متبقية! تأكد من دفعها في مواعيدها.
              </p>
            )}
            <p className="text-xs text-blue-500 mt-2">
              💡 خلال هذه الفترة، يمكنك طلب إرجاع المنتج إذا واجهت أي مشكلة.
            </p>
          </div>
        </div>
      )}

      {/* Banner لما الطلب يكتمل */}
      {isCompleted && (
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-6 flex items-center gap-3 flex-wrap">
          <span className="text-3xl">🎉</span>
          <div className="flex-1">
            <p className="font-bold text-green-800">الطلب مكتمل بنجاح</p>
            <p className="text-sm text-green-600 mt-1">
              تم إكمال الطلب وإضافة المبلغ لرصيد البائع. شكراً لتسوقك معنا!
            </p>
          </div>
        </div>
      )}

      {/* Banner: لو فيه Return نشط */}
      {activeReturn && (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <p className="font-bold text-purple-900 flex items-center gap-2 flex-wrap">
                لديك طلب إرجاع نشط لهذا الأوردر
                <ReturnStatusBadge status={activeReturn.status} size="sm" />
              </p>
              <p className="text-sm text-purple-700">
                رقم طلب الإرجاع:{' '}
                <span className="font-mono font-bold">
                  {activeReturn.returnNumber || `#${activeReturn.id}`}
                </span>
              </p>
            </div>
          </div>
          <Link
            to={`/returns/${activeReturn.id}`}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <FiEye size={16} /> عرض طلب الإرجاع
          </Link>
        </div>
      )}

      {/* Banner: طلب إرجاع جديد */}
      {canRequestReturn && !checkingReturn && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <p className="font-bold text-orange-800">
                هل تريد إرجاع منتج من هذا الطلب؟
              </p>
              <p className="text-sm text-orange-700">
                متبقى <strong>{returnableInfo.daysLeft} يوم</strong> من فترة
                الإرجاع المسموحة (14 يوم)
              </p>
            </div>
          </div>
          <Link
            to={`/returns/new/${order.id}`}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            <FiRefreshCw size={16} /> طلب إرجاع
          </Link>
        </div>
      )}

      {/* تنبيه: لو مفيش active return لكن الفترة خلصت */}
      {!returnableInfo.canReturn &&
        !activeReturn &&
        !checkingReturn &&
        (order.status === 'Delivered' || order.status === 'Completed') && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <p className="font-medium text-gray-800">
                انتهت فترة الإرجاع لهذا الطلب
              </p>
              <p className="text-sm text-gray-600">{returnableInfo.reason}</p>
            </div>
          </div>
        )}

      {/* مسار الطلب */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-bold mb-4">مسار الطلب</h2>
        <OrderTimeline currentStatus={order.status} />
      </div>

      {/* 🆕 ✅ جدول الأقساط */}
      {isInstallmentOrder && (
        <div className="mb-6">
          {installmentsLoading ? (
            <div className="bg-white rounded-xl border p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-3">جاري تحميل الأقساط...</p>
            </div>
          ) : installments.length > 0 ? (
            <InstallmentTimeline
              installments={installments}
              showPayButton={true}
              onPayClick={handlePayInstallment}
            />
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-blue-700 text-sm">📋 طلب بالتقسيط - جاري تجهيز جدول الدفعات</p>
            </div>
          )}
        </div>
      )}

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
              <span className="font-medium">
                {formatDate(order.createdAt || order.orderDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">طريقة الدفع:</span>
              <span className="font-medium">
                {getPaymentMethodLabel(order.paymentMethod)}
              </span>
            </div>

            {/* 🆕 ✅ نوع الدفع */}
            {isInstallmentOrder && (
              <div className="flex justify-between">
                <span className="text-gray-500">نوع الدفع:</span>
                <span className="font-medium text-blue-600">📋 تقسيط</span>
              </div>
            )}

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

            <div className="flex justify-between">
              <span className="text-gray-500">المجموع:</span>
              <span className="font-medium">
                {formatPrice(order.totalPrice || order.totalAmount)}
              </span>
            </div>

            {order.shippingCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">الشحن:</span>
                <span className="font-medium">
                  {formatPrice(order.shippingCost)}
                </span>
              </div>
            )}

            {order.codFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">رسوم الدفع عند الاستلام:</span>
                <span className="font-medium text-orange-600">
                  {formatPrice(order.codFee)}
                </span>
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

            {/* 🆕 ✅ المدفوع والمتبقي */}
            {isInstallmentOrder && installments.length > 0 && (
              <>
                <hr />
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">✅ المدفوع:</span>
                  <span className="font-bold text-green-600">
                    {formatPrice(
                      installments
                        .filter(i => i.status === 'Paid')
                        .reduce((sum, i) => sum + i.amount, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-orange-600">⏳ المتبقي:</span>
                  <span className="font-bold text-orange-600">
                    {formatPrice(
                      installments
                        .filter(i => i.status !== 'Paid' && i.status !== 'Cancelled')
                        .reduce((sum, i) => sum + i.amount, 0)
                    )}
                  </span>
                </div>
              </>
            )}
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
              <h3 className="font-medium text-sm text-gray-500 mb-1">
                📝 ملاحظات:
              </h3>
              <p className="text-sm">{order.orderNotes}</p>
            </div>
          )}

          {order.payment?.receiptImageUrl && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium text-sm text-gray-500 mb-2">
                🧾 إيصال الدفع:
              </h3>
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

      <div className="mb-6">
        <OrderItems items={order.items || order.orderItems || []} />
      </div>

      {/* الأزرار */}
      <div className="flex flex-wrap gap-3">
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

        {needsPayment && !isInstallmentOrder && (
          <Link
            to={`/orders/${order.id}/payment`}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium
                       hover:bg-blue-700 transition-colors"
          >
            💳 إتمام الدفع
          </Link>
        )}

        {canCancel && (
          <button
            onClick={() => setShowCancelDialog(true)}
            className="btn-danger"
          >
            ❌ إلغاء الطلب
          </button>
        )}

        <button onClick={() => navigate('/orders')} className="btn-secondary">
          ← رجوع لطلباتي
        </button>
      </div>

      {/* 🆕 ✅ Modal دفع الدفعة */}
      <PayInstallmentModal
        installment={selectedInstallment}
        isOpen={showPayModal}
        onClose={() => {
          setShowPayModal(false);
          setSelectedInstallment(null);
        }}
        onSuccess={handlePaySuccess}
      />

      {/* Dialog تأكيد الاستلام */}
      <ConfirmDialog
        isOpen={showConfirmDeliveryDialog}
        onClose={() => setShowConfirmDeliveryDialog(false)}
        onConfirm={handleConfirmDelivery}
        title="تأكيد استلام الطلب"
        message="هل استلمت الطلب فعلاً؟ بعد التأكيد سيتم إكمال الطلب تلقائياً خلال 3 أيام."
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