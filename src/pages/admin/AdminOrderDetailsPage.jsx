import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { getOrderById, updateOrderStatus } from '../../api/admin/adminOrderService';
import adminPaymentService from '../../api/admin/adminPaymentService';
import adminInstallmentService from '../../api/admin/adminInstallmentService';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';
import OrderTimeline from '../../components/order/OrderTimeline';
import InstallmentTimeline from '../../components/order/InstallmentTimeline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { PAYMENT_LABELS, PAYMENT_TARGET_LABELS, PAYMENT_STATUS_LABELS } from '../../utils/constants';
import { paymentStatusMap, getStatusInfo } from '../../utils/orderStatusMap';
import toast from 'react-hot-toast';

const AdminOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [installments, setInstallments] = useState([]);
  const [installmentsLoading, setInstallmentsLoading] = useState(false);
  const [showConfirmInstallmentModal, setShowConfirmInstallmentModal] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [confirmNote, setConfirmNote] = useState('');

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

  const fetchInstallments = async () => {
    try {
      setInstallmentsLoading(true);
      const data = await adminInstallmentService.getOrderInstallments(id);
      setInstallments(data || []);
    } catch (err) {
      console.error('Failed to fetch installments:', err);
      setInstallments([]);
    } finally {
      setInstallmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (order?.id && (order.isInstallment || order.installmentPlanId)) {
      fetchInstallments();
    }
  }, [order]);

  const handleConfirmPayment = async (paymentId) => {
    if (!paymentId) return;
    try {
      setActionLoading(paymentId);
      await adminPaymentService.confirmPayment(paymentId);
      toast.success('تم تأكيد الدفع بنجاح ✅');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تأكيد الدفع');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenRejectModal = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleRejectPayment = async () => {
    if (!rejectReason.trim()) {
      toast.error('يرجى كتابة سبب الرفض');
      return;
    }
    try {
      setActionLoading(selectedPaymentId);
      await adminPaymentService.rejectPayment(selectedPaymentId, rejectReason);
      toast.success('تم رفض الإيصال ❌');
      setShowRejectModal(false);
      setSelectedPaymentId(null);
      setRejectReason('');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل رفض الإيصال');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setActionLoading(true);
      await updateOrderStatus(id, newStatus);
      toast.success('تم تحديث حالة الطلب بنجاح');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تحديث الحالة');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmInstallment = async () => {
    if (!selectedInstallment) return;
    try {
      setActionLoading(true);
      await adminInstallmentService.confirmInstallment(selectedInstallment.id, {
        note: confirmNote.trim() || null,
      });
      toast.success(`تم تأكيد الدفعة ${selectedInstallment.installmentNumber} بنجاح ✅`);
      setShowConfirmInstallmentModal(false);
      setSelectedInstallment(null);
      setConfirmNote('');
      fetchInstallments();
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تأكيد الدفعة');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmInstallmentClick = (installment) => {
    setSelectedInstallment(installment);
    setConfirmNote('');
    setShowConfirmInstallmentModal(true);
  };

  const buildAddressLine = () => {
    const parts = [];
    if (order?.governorate) parts.push(order.governorate);
    if (order?.city) parts.push(order.city);
    if (order?.shippingCountry) parts.push(order.shippingCountry);
    return parts.join('، ');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrder} />;
  if (!order) return null;

  const paymentStatus = order.payment
    ? getStatusInfo(paymentStatusMap, order.payment.status)
    : null;

  const grandTotal = (order.totalPrice || 0) + (order.shippingCost || 0) + (order.codFee || 0);
  const pendingReviewPayments = (order.payments || []).filter(
    (p) => p.status === 'WaitingConfirmation' && p.receiptImageUrl && p.paymentTarget === 'Platform'
  );
  const isInstallmentOrder = order.isInstallment || order.installmentPlanId || installments.length > 0;

  const getAvailableActions = () => {
    const actions = [];

    switch (order.status) {
      case 'PaymentConfirmed':
        actions.push({
          status: 'Processing',
          label: '🔄 بدء التجهيز',
          color: 'bg-blue-600 hover:bg-blue-700',
        });
        actions.push({
          status: 'Cancelled',
          label: '❌ إلغاء الطلب',
          color: 'bg-red-600 hover:bg-red-700',
        });
        break;

      case 'Processing':
        actions.push({
          status: 'Cancelled',
          label: '❌ إلغاء الطلب',
          color: 'bg-red-600 hover:bg-red-700',
        });
        break;

      case 'Shipped':
        actions.push({
          status: 'Delivered',
          label: '✅ تم التسليم',
          color: 'bg-green-600 hover:bg-green-700',
        });
        actions.push({
          status: 'DeliveryFailed',
          label: '⚠️ فشل التسليم',
          color: 'bg-orange-600 hover:bg-orange-700',
        });
        break;

      case 'DeliveryFailed':
        actions.push({
          status: 'ReturnedToSeller',
          label: '↩️ رجعت للبائع',
          color: 'bg-gray-700 hover:bg-gray-800',
        });
        actions.push({
          status: 'Shipped',
          label: '🚚 إعادة الشحن',
          color: 'bg-purple-600 hover:bg-purple-700',
        });
        break;

      case 'Delivered':
        actions.push({
          status: 'Completed',
          label: '🎉 إكمال الطلب',
          color: 'bg-emerald-600 hover:bg-emerald-700',
        });
        actions.push({
          status: 'Refunded',
          label: '🔄 استرجاع',
          color: 'bg-amber-600 hover:bg-amber-700',
        });
        break;

      default:
        break;
    }

    return actions;
  };

  const availableActions = getAvailableActions();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/orders')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiArrowRight size={20} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">طلب #{order.id}</h1>
            {isInstallmentOrder && (
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                📋 تقسيط
              </span>
            )}
            {order.startedWithPartialPayment && (
              <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                💳 بدأ بدفعة أولى
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">{formatDate(order.createdAt || order.orderDate)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {pendingReviewPayments.length > 0 && (
        <div className="space-y-4 mb-6">
          {pendingReviewPayments.map((payment) => (
            <div key={payment.id} className="bg-orange-50 border-2 border-orange-300 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🧾</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-orange-800 text-lg">إيصال دفع يحتاج مراجعة!</h3>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                      {payment.label || 'دفعة'}
                    </span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    العميل رفع إيصال دفع بقيمة{' '}
                    <strong>{formatPrice(payment.amount)}</strong> عبر{' '}
                    <strong>{payment.paymentMethodDisplay || PAYMENT_LABELS[payment.paymentMethod] || payment.paymentMethod}</strong>
                  </p>
                  {payment.targetDisplay && (
                    <p className="text-xs text-orange-600 mt-1">
                      جهة الدفع: {payment.targetDisplay}
                    </p>
                  )}

                  <div
                    className="mt-3 cursor-pointer inline-block"
                    onClick={() => setPreviewImage(payment.receiptImageUrl)}
                  >
                    <img
                      src={payment.receiptImageUrl}
                      alt="إيصال الدفع"
                      className="w-48 h-48 object-cover rounded-xl border-2 border-orange-200 hover:opacity-90 transition-opacity"
                    />
                    <p className="text-xs text-orange-600 mt-1">🔍 اضغط للتكبير</p>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleConfirmPayment(payment.id)}
                      disabled={actionLoading === payment.id}
                      className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
                    >
                      {actionLoading === payment.id ? 'جاري التأكيد...' : '✅ تأكيد الدفع'}
                    </button>
                    <button
                      onClick={() => handleOpenRejectModal(payment.id)}
                      disabled={actionLoading === payment.id}
                      className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium transition-colors"
                    >
                      ❌ رفض الإيصال
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {availableActions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-700 font-medium mb-3">⚡ إجراءات متاحة:</p>
          <div className="flex gap-3 flex-wrap">
            {availableActions.map((action) => (
              <button
                key={action.status}
                onClick={() => handleStatusUpdate(action.status)}
                disabled={actionLoading}
                className={`text-white px-4 py-2 rounded-lg disabled:opacity-50 text-sm font-medium transition-colors ${action.color}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {order.status === 'DeliveryFailed' && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="font-bold text-orange-800">⚠️ الطلب في حالة فشل تسليم</p>
          <p className="text-sm text-orange-600 mt-1">
            لم يتم تسليم الشحنة للعميل. يمكنك إعادة الحالة إلى "تم الشحن" للمحاولة مرة أخرى أو تحويلها إلى "رجعت للبائع".
          </p>
        </div>
      )}

      {order.status === 'ReturnedToSeller' && (
        <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 mb-6">
          <p className="font-bold text-gray-800">↩️ الشحنة رجعت للبائع</p>
          <p className="text-sm text-gray-600 mt-1">
            هذه حالة لوجستية للطلب وليست Return Request من العميل.
          </p>
        </div>
      )}

      {order.timeline && order.timeline.length > 0 && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📍 مسار الطلب</h2>
          <OrderTimeline
            currentStatus={order.status}
            timeline={order.timeline}
            paymentMethod={order.paymentMethod || order.payment?.paymentMethod}
          />
        </div>
      )}

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
              showConfirmButton={true}
              onConfirmClick={handleConfirmInstallmentClick}
            />
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-blue-700 text-sm">📋 طلب بالتقسيط - لا توجد دفعات حالياً</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🚚 عنوان الشحن</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">العنوان</p>
                <p className="font-medium">{order.shippingAddress || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">المحافظة</p>
                <p className="font-medium">{order.governorate || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">المدينة</p>
                <p className="font-medium">{order.city || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">الدولة</p>
                <p className="font-medium">{order.shippingCountry || '—'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500">السطر الكامل</p>
                <p className="font-medium">{buildAddressLine() || '—'}</p>
              </div>
              {order.orderNotes && (
                <div className="sm:col-span-2">
                  <p className="text-gray-500">ملاحظات</p>
                  <p className="font-medium">{order.orderNotes}</p>
                </div>
              )}
            </div>
          </div>

          {order.trackingNumber && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">📍 بيانات الشحن</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {order.shippingCompany && (
                  <div>
                    <p className="text-gray-500">شركة الشحن</p>
                    <p className="font-medium">{order.shippingCompany}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">رقم التتبع</p>
                  <p className="font-mono font-bold text-purple-600">{order.trackingNumber}</p>
                </div>
                {order.shippedAt && (
                  <div>
                    <p className="text-gray-500">تاريخ الشحن</p>
                    <p className="font-medium">{formatDate(order.shippedAt)}</p>
                  </div>
                )}
                {order.deliveredAt && (
                  <div>
                    <p className="text-gray-500">تاريخ التسليم</p>
                    <p className="font-medium">{formatDate(order.deliveredAt)}</p>
                  </div>
                )}
                {order.trackingUrl && (
                  <div className="sm:col-span-2">
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline text-sm"
                    >
                      📍 رابط تتبع الشحنة ←
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">💰 ملخص الطلب</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">سعر المنتجات</span>
                <span className="font-medium">{formatPrice(order.totalPrice)}</span>
              </div>
              {order.shippingCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">الشحن</span>
                  <span className="font-medium">{formatPrice(order.shippingCost)}</span>
                </div>
              )}
              {order.codFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">رسوم COD</span>
                  <span className="font-medium text-orange-600">{formatPrice(order.codFee)}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>الإجمالي</span>
                <span className="text-blue-600">{formatPrice(order.grandTotal || grandTotal)}</span>
              </div>

              {isInstallmentOrder && installments.length > 0 && (
                <>
                  <hr />
                  <div className="flex justify-between">
                    <span className="text-green-600 font-medium">✅ المدفوع</span>
                    <span className="font-bold text-green-600">
                      {formatPrice(
                        installments
                          .filter((i) => i.status === 'Paid')
                          .reduce((sum, i) => sum + i.amount, 0)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-600 font-medium">⏳ المتبقي</span>
                    <span className="font-bold text-orange-600">
                      {formatPrice(
                        installments
                          .filter((i) => i.status !== 'Paid' && i.status !== 'Cancelled')
                          .reduce((sum, i) => sum + i.amount, 0)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600 font-medium">🚨 متأخرة</span>
                    <span className="font-bold text-red-600">
                      {installments.filter((i) => i.status === 'Overdue').length} دفعات
                    </span>
                  </div>
                </>
              )}

              <hr />
              {order.commissionAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">عمولة المنصة</span>
                  <span className="font-medium text-red-600">{formatPrice(order.commissionAmount)}</span>
                </div>
              )}
              {order.sellerAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">نصيب البائع</span>
                  <span className="font-medium text-green-600">{formatPrice(order.sellerAmount)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">👤 العميل</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">الاسم: </span>
                <span className="font-medium">{order.customerName || order.userName || 'غير معروف'}</span>
              </p>
              {(order.customerEmail || order.userEmail) && (
                <p>
                  <span className="text-gray-500">البريد: </span>
                  <span className="font-medium">{order.customerEmail || order.userEmail}</span>
                </p>
              )}
              {order.customerPhoneNumber && (
                <p>
                  <span className="text-gray-500">الهاتف: </span>
                  <span className="font-medium">{order.customerPhoneNumber}</span>
                </p>
              )}
            </div>
          </div>

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

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">💳 الدفع</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">الطريقة</span>
                <span className="font-medium">
                  {PAYMENT_LABELS[order.paymentMethod || order.payment?.paymentMethod] || '—'}
                </span>
              </div>

              {order.paymentTarget && (
                <div className="flex justify-between">
                  <span className="text-gray-500">جهة الدفع</span>
                  <span className="font-medium">
                    {PAYMENT_TARGET_LABELS[order.paymentTarget]?.icon}{' '}
                    {PAYMENT_TARGET_LABELS[order.paymentTarget]?.label || order.paymentTarget}
                  </span>
                </div>
              )}

              {isInstallmentOrder && (
                <div className="flex justify-between">
                  <span className="text-gray-500">نوع الدفع</span>
                  <span className="font-medium text-blue-600">📋 تقسيط</span>
                </div>
              )}

              {order.totalPaidAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">المدفوع</span>
                  <span className="font-medium text-green-600">{formatPrice(order.totalPaidAmount)}</span>
                </div>
              )}

              {order.remainingAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">المتبقي</span>
                  <span className="font-medium text-orange-600">{formatPrice(order.remainingAmount)}</span>
                </div>
              )}

              <hr />

              {/* 🆕 عرض المدفوعات */}
              {(order.payments || []).length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500">المدفوعات:</p>
                  {(order.payments || []).map((p) => {
                    const ps = PAYMENT_STATUS_LABELS[p.status] || {};
                    return (
                      <div key={p.id} className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{p.label || 'دفعة'}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${ps.color || 'bg-gray-100'}`}>
                            {ps.icon} {ps.label || p.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{formatPrice(p.amount)}</span>
                          {p.receiptImageUrl && (
                            <button
                              onClick={() => setPreviewImage(p.receiptImageUrl)}
                              className="text-blue-600 hover:underline"
                            >
                              📄 الإيصال
                            </button>
                          )}
                        </div>
                        {p.rejectionReason && (
                          <p className="text-xs text-red-500 mt-1">❌ {p.rejectionReason}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">❌ رفض الإيصال</h3>
            <p className="text-sm text-gray-600 mb-3">
              يرجى كتابة سبب الرفض (سيتم إرساله للعميل):
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="مثال: الإيصال غير واضح / المبلغ غير صحيح..."
              rows={3}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleRejectPayment}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
              >
                {actionLoading ? 'جاري الرفض...' : '❌ تأكيد الرفض'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmInstallmentModal && selectedInstallment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              ✅ تأكيد الدفعة {selectedInstallment.installmentNumber}
            </h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">المبلغ:</span>
                <span className="font-bold text-blue-700">
                  {formatPrice(selectedInstallment.amount)}
                </span>
              </div>
              {selectedInstallment.paymentProofUrl && (
                <div className="mt-2">
                  <a
                    href={selectedInstallment.paymentProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    📎 عرض إيصال الدفع
                  </a>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ملاحظات (اختياري)
              </label>
              <textarea
                value={confirmNote}
                onChange={(e) => setConfirmNote(e.target.value)}
                placeholder="أي ملاحظات..."
                rows={2}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmInstallment}
                disabled={actionLoading}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                {actionLoading ? 'جاري التأكيد...' : '✅ تأكيد الدفعة'}
              </button>
              <button
                onClick={() => {
                  setShowConfirmInstallmentModal(false);
                  setSelectedInstallment(null);
                  setConfirmNote('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={previewImage}
              alt="إيصال الدفع"
              className="max-w-full max-h-[90vh] rounded-xl object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 left-2 bg-white/80 text-black w-8 h-8 rounded-full flex items-center justify-center hover:bg-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderDetailsPage;