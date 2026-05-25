import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import OrderTimeline from '../../components/order/OrderTimeline';
import OrderItems from '../../components/order/OrderItems';
import PaymentsList from '../../components/order/PaymentsList';
import InstallmentTimeline from '../../components/order/InstallmentTimeline';
import PayInstallmentModal from '../../components/order/PayInstallmentModal';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ReturnStatusBadge from '../../components/return/ReturnStatusBadge';
import orderService from '../../api/orderService';
import returnService from '../../api/returnService';
import installmentService from '../../api/installmentService';
import settingsService from '../../api/settingsService';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';
import { orderStatusMap } from '../../utils/orderStatusMap';
import { PAYMENT_LABELS, PAYMENT_TARGET_LABELS, SITE_URL } from '../../utils/constants';
import { checkOrderReturnable } from '../../utils/returnStatusMap';
import { FiRefreshCw, FiEye, FiTruck, FiPhone, FiCopy, FiSend } from 'react-icons/fi';
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

  const [installments, setInstallments] = useState([]);
  const [installmentsLoading, setInstallmentsLoading] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);

  const [activeReturn, setActiveReturn] = useState(null);
  const [checkingReturn, setCheckingReturn] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const [orderData, settingsData] = await Promise.all([
        orderService.getOrder(id),
        settingsService.getPaymentInfo().catch(() => null),
      ]);
      setOrder(orderData);
      setPaymentInfo(settingsData);
    } catch (err) {
      setError('فشل في تحميل تفاصيل الطلب');
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (order?.id) {
      if (order.isInstallment || order.installmentPlanId) {
        fetchInstallments();
      }
      if (['Delivered', 'Completed', 'Refunded'].includes(order.status)) {
        checkActiveReturn();
      } else {
        setCheckingReturn(false);
      }
    }
  }, [order?.id]);

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

  const handlePayInstallment = (installment) => {
    setSelectedInstallment(installment);
    setShowPayModal(true);
  };

  const handlePaySuccess = () => {
    toast.success('تم رفع إيصال الدفع بنجاح! جاري المراجعة 🧾');
    fetchInstallments();
    fetchOrder();
  };

  // 🆕 رفع إيصال دفع (من PaymentsList)
  const handleUploadReceipt = async (paymentId, data) => {
    await orderService.uploadPaymentReceipt(id, paymentId, data);
    toast.success('تم رفع الإيصال بنجاح! ✅ جاري المراجعة...');
    fetchOrder();
  };

  const handleCopyTracking = async () => {
    if (!order?.trackingNumber) return;
    try {
      await navigator.clipboard.writeText(order.trackingNumber);
      toast.success('تم نسخ الرقم');
    } catch {
      toast.error('فشل نسخ الرقم');
    }
  };

  const getPaymentMethodLabel = (method) => {
    if (!method) return 'غير محدد';
    return PAYMENT_LABELS[method] || method;
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrder} />;
  if (!order) return <ErrorMessage message="الطلب غير موجود" />;

  const status = orderStatusMap[order.status] || orderStatusMap.Pending;
  const payments = order.payments || [];
  const nonCodPayments = payments.filter((p) => p.paymentMethod !== 'CashOnDelivery');
  const pendingPayments = nonCodPayments.filter((p) => p.status === 'Pending');
  const failedPayments = nonCodPayments.filter((p) => p.status === 'Failed');

  const canCancel = ['PendingPayment', 'WaitingConfirmation', 'PaymentConfirmed', 'PaymentFailed', 'Processing'].includes(order.status);
  const canConfirmDelivery = order.status === 'Shipped';
  const isDelivered = order.status === 'Delivered';
  const isCompleted = order.status === 'Completed';
  const isDeliveryFailed = order.status === 'DeliveryFailed';
  const isReturnedToSeller = order.status === 'ReturnedToSeller';
  const needsPayment = pendingPayments.length > 0 || failedPayments.length > 0;
  const isInstallmentOrder = order.isInstallment || order.installmentPlanId || installments.length > 0;
  const returnableInfo = checkOrderReturnable(order);
  const canRequestReturn = returnableInfo.canReturn && !activeReturn;

  const trackingLooksLikePhone =
    order.trackingNumber && /^(\+?\d[\d\s\-]{7,15})$/.test(order.trackingNumber.trim());

  const buildAddressLine = () => {
    const parts = [];
    if (order.governorate) parts.push(order.governorate);
    if (order.city) parts.push(order.city);
    if (order.shippingCountry) parts.push(order.shippingCountry);
    return parts.join('، ');
  };

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
          {isInstallmentOrder && (
            <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              📋 طلب بالتقسيط
            </span>
          )}
          {order.startedWithPartialPayment && (
            <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
              💳 بدأ بدفعة أولى
            </span>
          )}
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
          {status.icon} {status.label}
        </span>
      </div>

      {needsPayment && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💳</span>
            <div>
              <p className="font-bold text-orange-800">في انتظار الدفع</p>
              <p className="text-sm text-orange-600">
                {failedPayments.length > 0
                  ? 'الإيصال السابق اترفض — يمكنك رفع إيصال جديد'
                  : `متبقي ${pendingPayments.length} دفعة في انتظار الدفع`}
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

      {nonCodPayments.some((p) => p.status === 'WaitingConfirmation') && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="font-bold text-blue-800">جاري مراجعة الإيصال</p>
            <p className="text-sm text-blue-600">تم رفع الإيصال بنجاح وجاري المراجعة من الإدارة</p>
          </div>
        </div>
      )}

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

      {isDeliveryFailed && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-3xl">⚠️</span>
          <div>
            <p className="font-bold text-orange-800">تعذر تسليم الشحنة</p>
            <p className="text-sm text-orange-600 mt-1">
              لم نتمكن من تسليم الطلب. قد تتم إعادة المحاولة أو متابعة الشحنة مع شركة الشحن.
            </p>
          </div>
        </div>
      )}

      {isReturnedToSeller && (
        <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-3xl">↩️</span>
          <div>
            <p className="font-bold text-gray-800">تم إرجاع الشحنة إلى البائع</p>
            <p className="text-sm text-gray-600 mt-1">
              الشحنة رجعت فعليًا إلى البائع بعد فشل التسليم.
            </p>
          </div>
        </div>
      )}

      {isDelivered && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3 flex-wrap">
          <span className="text-3xl">✅</span>
          <div className="flex-1">
            <p className="font-bold text-blue-800">تم تأكيد استلام الطلب</p>
            <p className="text-sm text-blue-600 mt-1">
              شكراً لك! سيتم إكمال الطلب تلقائياً خلال 3 أيام وتحويل المبلغ للبائع.
            </p>
            {isInstallmentOrder && installments.some((i) => ['Pending', 'Overdue'].includes(i.status)) && (
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

      {canRequestReturn && !checkingReturn && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <p className="font-bold text-orange-800">هل تريد إرجاع منتج من هذا الطلب؟</p>
              <p className="text-sm text-orange-700">
                متبقى <strong>{returnableInfo.daysLeft} يوم</strong> من فترة الإرجاع (3 يوم)
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

      {!returnableInfo.canReturn &&
        !activeReturn &&
        !checkingReturn &&
        ['Delivered', 'Completed'].includes(order.status) && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <p className="font-medium text-gray-800">انتهت فترة الإرجاع لهذا الطلب</p>
              <p className="text-sm text-gray-600">{returnableInfo.reason}</p>
            </div>
          </div>
        )}

      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">📍 مسار الطلب</h2>
        <OrderTimeline
          currentStatus={order.status}
          timeline={order.timeline}
          paymentMethod={order.paymentMethod}
        />
      </div>

      {isInstallmentOrder && (
        <div className="mb-6">
          {installmentsLoading ? (
            <div className="bg-white rounded-2xl border p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-gray-500 mt-3">جاري تحميل الأقساط...</p>
            </div>
          ) : installments.length > 0 ? (
            <InstallmentTimeline
              installments={installments}
              showPayButton={true}
              onPayClick={handlePayInstallment}
            />
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
              <p className="text-blue-700 text-sm">📋 طلب بالتقسيط - جاري تجهيز جدول الدفعات</p>
            </div>
          )}
        </div>
      )}

      {order.trackingNumber && (
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
              <FiTruck size={18} className="text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">بيانات الشحن</h2>
              <p className="text-xs text-gray-400">تفاصيل شحن طلبك</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-2">
              <span className="text-lg shrink-0">💡</span>
              <div>
                <p className="font-bold text-amber-800 text-sm mb-1">ملاحظة عن الشحن</p>
                <ul className="text-xs text-amber-700 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                    <span>
                      لو مكتوب في <strong>"جهة الشحن"</strong> اسم شخص أو رقم عربية، يبقى طلبك بيتوصل مع <strong>مندوب توصيل محلي</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                    <span>
                      لو مكتوب في <strong>"رقم التتبع"</strong> رقم موبايل، ده <strong>رقم المندوب</strong> — تقدر تتواصل معاه مباشرة لمعرفة موعد التسليم
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
            {order.shippingCompany && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500">جهة الشحن / المندوب</span>
                <span className="text-sm font-semibold text-gray-800">{order.shippingCompany}</span>
              </div>
            )}

            <div className="flex items-center justify-between px-4 py-3 gap-3">
              <span className="text-sm text-gray-500 shrink-0">
                {trackingLooksLikePhone ? 'رقم المندوب' : 'رقم التتبع'}
              </span>
              <div className="flex items-center gap-2">
                {trackingLooksLikePhone ? (
                  <>
                    <a
                      href={`tel:${order.trackingNumber}`}
                      dir="ltr"
                      className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                      <FiPhone size={13} />
                      {order.trackingNumber}
                    </a>
                    <button
                      onClick={handleCopyTracking}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-600 transition-colors"
                    >
                      <FiCopy size={11} /> نسخ
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-mono font-bold text-purple-600">
                      {order.trackingNumber}
                    </span>
                    <button
                      onClick={handleCopyTracking}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-600 transition-colors"
                    >
                      <FiCopy size={11} /> نسخ
                    </button>
                  </>
                )}
              </div>
            </div>

            {order.shippedAt && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500">تاريخ الشحن</span>
                <span className="text-sm font-medium text-gray-800">{formatDate(order.shippedAt)}</span>
              </div>
            )}

            {order.trackingUrl && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500">رابط التتبع</span>
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  فتح الرابط ↗
                </a>
              </div>
            )}
          </div>

          {trackingLooksLikePhone && (
            <a
              href={`tel:${order.trackingNumber}`}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 hover:border-blue-300 transition-all"
            >
              <FiPhone size={16} />
              اتصل بالمندوب
            </a>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">📋 معلومات الطلب</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>رقم الطلب</span>
              <span className="font-medium text-gray-800">#{order.id}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>تاريخ الطلب</span>
              <span className="font-medium text-gray-800">
                {formatDate(order.createdAt || order.orderDate)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>طريقة الدفع</span>
              <span className="font-medium text-gray-800">
                {getPaymentMethodLabel(order.paymentMethod)}
              </span>
            </div>

            {isInstallmentOrder && (
              <div className="flex justify-between text-gray-600">
                <span>نوع الدفع</span>
                <span className="font-medium text-blue-600">📋 تقسيط</span>
              </div>
            )}

            {(order.storeName || order.sellerName) && (
              <div className="flex justify-between text-gray-600">
                <span>المتجر</span>
                <Link to={`/sellers/${order.sellerId}`} className="font-medium text-blue-600 hover:underline">
                  🏪 {order.storeName || order.sellerName}
                </Link>
              </div>
            )}

            <hr className="border-dashed" />

            <div className="flex justify-between text-gray-600">
              <span>المجموع</span>
              <span className="font-medium text-gray-800">
                {formatPrice(order.totalPrice || order.totalAmount)}
              </span>
            </div>

            {order.shippingCost > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>الشحن</span>
                <span className="font-medium text-gray-800">
                  {formatPrice(order.shippingCost)}
                </span>
              </div>
            )}

            {order.codFee > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>رسوم الدفع عند الاستلام</span>
                <span className="font-medium text-orange-500">{formatPrice(order.codFee)}</span>
              </div>
            )}

            {order.commissionAmount > 0 && (
              <div className="flex justify-between text-xs text-gray-400">
                <span>عمولة المنصة</span>
                <span>{formatPrice(order.commissionAmount)}</span>
              </div>
            )}

            <hr />

            <div className="flex justify-between font-bold text-base">
              <span className="text-gray-700">الإجمالي</span>
              <span className="text-blue-600">
                {formatPrice(
                  (order.totalPrice || order.totalAmount || 0) +
                    (order.shippingCost || 0) +
                    (order.codFee || 0)
                )}
              </span>
            </div>

            {/* 🆕 المدفوع والمتبقي */}
            {order.totalPaidAmount > 0 && (
              <>
                <hr className="border-dashed" />
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">✅ المدفوع</span>
                  <span className="font-bold text-green-600">
                    {formatPrice(order.totalPaidAmount)}
                  </span>
                </div>
                {order.remainingAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-500">⏳ المتبقي</span>
                    <span className="font-bold text-orange-500">
                      {formatPrice(order.remainingAmount)}
                    </span>
                  </div>
                )}
              </>
            )}

            {/* 🆕 جهة الدفع */}
            {order.paymentTarget && (
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>جهة الدفع</span>
                <span>
                  {PAYMENT_TARGET_LABELS[order.paymentTarget]?.icon}{' '}
                  {PAYMENT_TARGET_LABELS[order.paymentTarget]?.label || order.paymentTarget}
                </span>
              </div>
            )}

            {isInstallmentOrder && installments.length > 0 && (
              <>
                <hr className="border-dashed" />
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">✅ المدفوع</span>
                  <span className="font-bold text-green-600">
                    {formatPrice(
                      installments
                        .filter((i) => i.status === 'Paid')
                        .reduce((sum, i) => sum + i.amount, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-orange-500">⏳ المتبقي</span>
                  <span className="font-bold text-orange-500">
                    {formatPrice(
                      installments
                        .filter((i) => !['Paid', 'Cancelled'].includes(i.status))
                        .reduce((sum, i) => sum + i.amount, 0)
                    )}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">📍 عنوان الشحن</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-medium text-gray-800">{order.shippingAddress || 'غير محدد'}</p>
            <p>{buildAddressLine() || '—'}</p>
          </div>

          {order.orderNotes && (
            <div className="mt-4 pt-4 border-t border-dashed">
              <h3 className="font-semibold text-sm text-gray-500 mb-1">📝 ملاحظات</h3>
              <p className="text-sm text-gray-700">{order.orderNotes}</p>
            </div>
          )}

        </div>
      </div>

      {/* 🆕 المدفوعات */}
      {payments.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-gray-800 mb-4">💳 المدفوعات</h2>
          <PaymentsList
            payments={payments}
            paymentInfo={paymentInfo}
            showUpload={true}
            onUploadReceipt={handleUploadReceipt}
          />
        </div>
      )}

      <div className="mb-6">
        <OrderItems items={order.items || order.orderItems || []} />
      </div>

      <div className="flex flex-wrap gap-3">
        {canConfirmDelivery && (
          <button
            onClick={() => setShowConfirmDeliveryDialog(true)}
            disabled={confirmLoading}
            className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {confirmLoading ? 'جاري التأكيد...' : '✅ تأكيد الاستلام'}
          </button>
        )}

        {needsPayment && !isInstallmentOrder && (
          <Link
            to={`/orders/${order.id}/payment`}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            💳 إتمام الدفع
          </Link>
        )}

        {(order.whatsAppShareUrl || order.trackingToken) && (
          <a
            href={order.whatsAppShareUrl || `https://wa.me/${(order.customerPhoneNumber || '').replace(/[^0-9]/g, '').replace(/^0/, '20') || ''}?text=${encodeURIComponent(order.trackingUrl?.startsWith('http') ? order.trackingUrl : `${SITE_URL}/track/${order.trackingToken}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            <FiSend size={16} />
            مشاركة عبر واتساب
          </a>
        )}

        {canCancel && (
          <button onClick={() => setShowCancelDialog(true)} className="btn-danger">
            ❌ إلغاء الطلب
          </button>
        )}

        <button onClick={() => navigate('/orders')} className="btn-secondary">
          ← رجوع لطلباتي
        </button>
      </div>

      <PayInstallmentModal
        installment={selectedInstallment}
        isOpen={showPayModal}
        onClose={() => {
          setShowPayModal(false);
          setSelectedInstallment(null);
        }}
        onSuccess={handlePaySuccess}
      />

      <ConfirmDialog
        isOpen={showConfirmDeliveryDialog}
        onClose={() => setShowConfirmDeliveryDialog(false)}
        onConfirm={handleConfirmDelivery}
        title="تأكيد استلام الطلب"
        message="هل استلمت الطلب فعلاً؟ بعد التأكيد سيتم إكمال الطلب تلقائياً خلال 3 أيام."
        confirmText={confirmLoading ? 'جاري التأكيد...' : '✅ أيوه، استلمت الطلب'}
      />

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