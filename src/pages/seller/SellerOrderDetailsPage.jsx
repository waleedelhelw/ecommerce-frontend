import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiPhone,
  FiCopy,
  FiPackage,
  FiTruck,
  FiUser,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiAlertTriangle,
  FiRotateCcw,
} from 'react-icons/fi';
import {
  getOrderById,
  startProcessing,
  readyToShip,
  shipOrder,
  markDeliveryFailed,
  markReturnedToSeller,
} from '../../api/seller/sellerOrderService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import OrderTimeline from '../../components/order/OrderTimeline';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { orderStatusMap, getStatusInfo, paymentStatusMap } from '../../utils/orderStatusMap';
import { PAYMENT_LABELS } from '../../utils/constants';
import toast from 'react-hot-toast';

const SellerOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showShipForm, setShowShipForm] = useState(false);
  const [shipData, setShipData] = useState({
    shippingCompany: '',
    trackingNumber: '',
    trackingUrl: '',
  });
  const [shipErrors, setShipErrors] = useState({});

  const [showDeliveryFailedForm, setShowDeliveryFailedForm] = useState(false);
  const [deliveryFailedReason, setDeliveryFailedReason] = useState('');

  const [showReturnedForm, setShowReturnedForm] = useState(false);
  const [returnedReason, setReturnedReason] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل تفاصيل الطلب');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPhone = async () => {
    if (!order?.customerPhoneNumber) return;
    try {
      await navigator.clipboard.writeText(order.customerPhoneNumber);
      toast.success('تم نسخ رقم العميل');
    } catch {
      toast.error('فشل نسخ الرقم');
    }
  };

  const handleStartProcessing = async () => {
    try {
      setActionLoading(true);
      await startProcessing(id);
      toast.success('تم بدء تجهيز الطلب ✅');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل بدء التجهيز');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReadyToShip = async () => {
    try {
      setActionLoading(true);
      await readyToShip(id);
      toast.success('الطلب جاهز للشحن 📦');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تحديث الحالة');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShipOrder = async () => {
    const errors = {};
    if (!shipData.shippingCompany.trim()) errors.shippingCompany = 'اسم شركة الشحن مطلوب';
    if (!shipData.trackingNumber.trim()) errors.trackingNumber = 'رقم التتبع مطلوب';
    setShipErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setActionLoading(true);
      await shipOrder(id, {
        shippingCompany: shipData.shippingCompany.trim(),
        trackingNumber: shipData.trackingNumber.trim(),
        trackingUrl: shipData.trackingUrl.trim() || null,
      });
      toast.success('تم شحن الطلب بنجاح 🚚');
      setShowShipForm(false);
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل شحن الطلب');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeliveryFailed = async () => {
    if (!deliveryFailedReason.trim()) {
      toast.error('يرجى كتابة سبب فشل التسليم');
      return;
    }

    try {
      setActionLoading(true);
      await markDeliveryFailed(id, {
        reason: deliveryFailedReason.trim(),
      });
      toast.success('تم تسجيل فشل التسليم ⚠️');
      setShowDeliveryFailedForm(false);
      setDeliveryFailedReason('');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تسجيل حالة التسليم');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnedToSeller = async () => {
    if (!returnedReason.trim()) {
      toast.error('يرجى كتابة سبب رجوع الشحنة');
      return;
    }

    try {
      setActionLoading(true);
      await markReturnedToSeller(id, {
        reason: returnedReason.trim(),
      });
      toast.success('تم تأكيد رجوع الشحنة للبائع ↩️');
      setShowReturnedForm(false);
      setReturnedReason('');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تسجيل رجوع الشحنة');
    } finally {
      setActionLoading(false);
    }
  };

  const getPaymentMethodLabel = (method) => {
    if (!method) return 'غير محدد';
    return PAYMENT_LABELS?.[method] || method;
  };

  const renderCustomerPhone = () => {
    if (!order?.customerPhoneNumber) {
      return <span className="text-gray-400 text-sm">غير متوفر</span>;
    }
    return (
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={`tel:${order.customerPhoneNumber}`}
          dir="ltr"
          className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800 hover:underline text-sm"
        >
          <FiPhone size={14} />
          {order.customerPhoneNumber}
        </a>
        <button
          type="button"
          onClick={handleCopyPhone}
          className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
        >
          <FiCopy size={12} />
          نسخ
        </button>
      </div>
    );
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

  const status = getStatusInfo(orderStatusMap, order.status);
  const paymentStatus = order.payment ? getStatusInfo(paymentStatusMap, order.payment.status) : null;
  const grandTotal =
    order.grandTotal ||
    (order.totalPrice || 0) +
      (order.shippingCost || 0) +
      (order.codFee || 0) +
      (order.installmentFee || 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/seller/orders')}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <FiArrowRight size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">طلب #{order.id}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${status.color}`}>
          {status.icon} {status.label}
        </span>
      </div>

      {order.status === 'PaymentConfirmed' && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
            <div>
              <p className="font-bold text-green-800">الدفع مؤكد — ابدأ تجهيز الطلب!</p>
              <p className="text-sm text-green-600">العميل دفع وتم تأكيد الدفع من الإدارة</p>
            </div>
          </div>
          <button
            onClick={handleStartProcessing}
            disabled={actionLoading}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 text-sm font-semibold transition-colors shadow-sm"
          >
            {actionLoading ? '...' : '🔄 بدء التجهيز'}
          </button>
        </div>
      )}

      {order.status === 'Processing' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <span className="text-xl">🔄</span>
            </div>
            <div>
              <p className="font-bold text-blue-800">جاري التجهيز</p>
              <p className="text-sm text-blue-600">لما تخلص تجهيز الطلب، اضغط جاهز للشحن</p>
            </div>
          </div>
          <button
            onClick={handleReadyToShip}
            disabled={actionLoading}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 text-sm font-semibold transition-colors shadow-sm"
          >
            {actionLoading ? '...' : '📦 جاهز للشحن'}
          </button>
        </div>
      )}

      {order.status === 'ReadyToShip' && !showShipForm && (
        <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 border border-purple-200 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
              <FiPackage size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="font-bold text-purple-800">الطلب جاهز للشحن</p>
              <p className="text-sm text-purple-600">أدخل بيانات الشحن ورقم التتبع</p>
            </div>
          </div>
          <button
            onClick={() => setShowShipForm(true)}
            className="bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 text-sm font-semibold transition-colors shadow-sm"
          >
            🚚 شحن الطلب
          </button>
        </div>
      )}

      {order.status === 'Shipped' && !showDeliveryFailedForm && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
              <FiAlertTriangle size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="font-bold text-orange-800">في حالة تعذر التسليم</p>
              <p className="text-sm text-orange-600">إذا لم يستلم العميل الشحنة، سجّل فشل التسليم مع السبب</p>
            </div>
          </div>
          <button
            onClick={() => setShowDeliveryFailedForm(true)}
            className="bg-orange-600 text-white px-5 py-2.5 rounded-xl hover:bg-orange-700 text-sm font-semibold transition-colors shadow-sm"
          >
            ⚠️ فشل التسليم
          </button>
        </div>
      )}

      {order.status === 'DeliveryFailed' && !showReturnedForm && (
        <div className="bg-gray-50 border border-gray-300 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gray-200 flex items-center justify-center">
              <FiRotateCcw size={20} className="text-gray-700" />
            </div>
            <div>
              <p className="font-bold text-gray-800">الشحنة فشل تسليمها</p>
              <p className="text-sm text-gray-600">بعد استلامها راجعة للمخزن، أكّد رجوعها للبائع</p>
            </div>
          </div>
          <button
            onClick={() => setShowReturnedForm(true)}
            className="bg-gray-700 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 text-sm font-semibold transition-colors shadow-sm"
          >
            ↩️ تأكيد رجوع الشحنة للبائع
          </button>
        </div>
      )}

      {order.status === 'DeliveryFailed' && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="font-bold text-orange-800">⚠️ فشل تسليم الطلب</p>
          <p className="text-sm text-orange-600 mt-1">
            هذا الطلب لم يتم تسليمه للعميل، ولن يُعتبر طلبًا مكتملًا حتى الآن.
          </p>
        </div>
      )}

      {order.status === 'ReturnedToSeller' && (
        <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 mb-6">
          <p className="font-bold text-gray-800">↩️ تم إرجاع الشحنة إلى البائع</p>
          <p className="text-sm text-gray-600 mt-1">
            الشحنة رجعت فعليًا إلى البائع، وهذه الحالة ليست طلب إرجاع من العميل بل حالة لوجستية للطلب.
          </p>
        </div>
      )}

      {showDeliveryFailedForm && (
        <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">تسجيل فشل التسليم</h3>
          <textarea
            value={deliveryFailedReason}
            onChange={(e) => setDeliveryFailedReason(e.target.value)}
            placeholder="اكتب سبب فشل التسليم... مثال: العميل رفض الاستلام"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          />
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDeliveryFailed}
              disabled={actionLoading}
              className="flex-1 bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 disabled:opacity-50 font-semibold text-sm transition-colors"
            >
              {actionLoading ? 'جاري الحفظ...' : '⚠️ تأكيد فشل التسليم'}
            </button>
            <button
              onClick={() => {
                setShowDeliveryFailedForm(false);
                setDeliveryFailedReason('');
              }}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-semibold text-sm transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {showReturnedForm && (
        <div className="bg-white rounded-2xl border-2 border-gray-300 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">تأكيد رجوع الشحنة للبائع</h3>
          <textarea
            value={returnedReason}
            onChange={(e) => setReturnedReason(e.target.value)}
            placeholder="اكتب سبب/ملاحظة رجوع الشحنة... مثال: الشحنة رجعت من شركة الشحن وتم استلامها بالمخزن"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
          />
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleReturnedToSeller}
              disabled={actionLoading}
              className="flex-1 bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 font-semibold text-sm transition-colors"
            >
              {actionLoading ? 'جاري الحفظ...' : '↩️ تأكيد رجوع الشحنة'}
            </button>
            <button
              onClick={() => {
                setShowReturnedForm(false);
                setReturnedReason('');
              }}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-semibold text-sm transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {showShipForm && (
        <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <FiTruck size={18} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">بيانات الشحن</h3>
              <p className="text-xs text-gray-400">أدخل تفاصيل شحن الطلب</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-2 mb-2">
              <FiPhone size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <p className="font-bold text-blue-800 text-sm">رقم تواصل العميل للمندوب</p>
            </div>
            <div className="mr-6">
              {renderCustomerPhone()}
              <p className="text-xs text-blue-500 mt-1.5">
                ابعت الرقم ده للمندوب أو شركة الشحن عشان يتواصل مع العميل
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-2">
              <span className="text-lg shrink-0">💡</span>
              <div>
                <p className="font-bold text-amber-800 text-sm mb-1">بتشحن مع مندوب محلي مش شركة شحن؟</p>
                <ul className="text-xs text-amber-700 space-y-1 list-none">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>
                      في خانة <strong>"شركة الشحن"</strong> اكتب اسم المندوب أو رقم العربية / الآلة
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>
                      في خانة <strong>"رقم التتبع"</strong> اكتب رقم موبايل المندوب
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                شركة الشحن / اسم المندوب
                <span className="text-red-500 mr-1">*</span>
              </label>
              <input
                type="text"
                value={shipData.shippingCompany}
                onChange={(e) => {
                  setShipData({ ...shipData, shippingCompany: e.target.value });
                  if (shipErrors.shippingCompany) {
                    setShipErrors((p) => ({ ...p, shippingCompany: '' }));
                  }
                }}
                placeholder="مثال: أرامكس، DHL، محمد المندوب..."
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all ${
                  shipErrors.shippingCompany
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              />
              {shipErrors.shippingCompany && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span>⚠</span> {shipErrors.shippingCompany}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                رقم التتبع / رقم المندوب
                <span className="text-red-500 mr-1">*</span>
              </label>
              <input
                type="text"
                value={shipData.trackingNumber}
                onChange={(e) => {
                  setShipData({ ...shipData, trackingNumber: e.target.value });
                  if (shipErrors.trackingNumber) {
                    setShipErrors((p) => ({ ...p, trackingNumber: '' }));
                  }
                }}
                placeholder="مثال: 1234567890 أو 01012345678"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all ${
                  shipErrors.trackingNumber
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              />
              {shipErrors.trackingNumber && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span>⚠</span> {shipErrors.trackingNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                رابط التتبع
                <span className="text-gray-400 font-normal text-xs mr-1">(اختياري)</span>
              </label>
              <input
                type="url"
                value={shipData.trackingUrl}
                onChange={(e) => setShipData({ ...shipData, trackingUrl: e.target.value })}
                placeholder="https://tracking.example.com/..."
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 hover:border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleShipOrder}
                disabled={actionLoading}
                className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {actionLoading ? 'جاري الشحن...' : <><FiTruck size={16} /> تأكيد الشحن</>}
              </button>
              <button
                onClick={() => {
                  setShowShipForm(false);
                  setShipErrors({});
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-semibold text-sm transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {order.timeline?.length > 0 && (
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiClock size={18} className="text-purple-500" />
            مسار الطلب
          </h2>
          <OrderTimeline
            currentStatus={order.status}
            timeline={order.timeline}
            paymentMethod={order.paymentMethod || order.payment?.paymentMethod}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiPackage size={18} className="text-purple-500" />
              عناصر الطلب
            </h2>
            <div className="space-y-3">
              {(order.items || order.orderItems || []).map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-center gap-4 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <img
                    src={item.productImageUrl || item.imageUrl || '/placeholder-product.png'}
                    alt={item.productName || item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.png';
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{item.productName || item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatPrice(item.unitPrice || item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-gray-800 text-sm">
                    {formatPrice((item.unitPrice || item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiMapPin size={18} className="text-purple-500" />
              عنوان الشحن
            </h2>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-800">{order.shippingAddress}</p>
                <p>{buildAddressLine() || '—'}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
                  <FiPhone size={13} />
                  رقم تواصل العميل مع المندوب
                </p>
                {renderCustomerPhone()}
              </div>
              {order.orderNotes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">📝 ملاحظات: </span>
                    {order.orderNotes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {order.trackingNumber && (
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiTruck size={18} className="text-purple-500" />
                بيانات الشحن
              </h2>
              <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
                {order.shippingCompany && (
                  <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-gray-500">شركة الشحن / المندوب</span>
                    <span className="font-semibold text-gray-800">{order.shippingCompany}</span>
                  </div>
                )}
                <div className="flex justify-between items-center px-4 py-3 text-sm">
                  <span className="text-gray-500">رقم التتبع / المندوب</span>
                  <span className="font-mono font-bold text-purple-600">{order.trackingNumber}</span>
                </div>
                {order.shippedAt && (
                  <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-gray-500">تاريخ الشحن</span>
                    <span className="font-medium text-gray-800">{formatDate(order.shippedAt)}</span>
                  </div>
                )}
                {order.trackingUrl && (
                  <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-gray-500">رابط التتبع</span>
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      فتح الرابط ↗
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiDollarSign size={18} className="text-purple-500" />
              الملخص المالي
            </h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>إجمالي المنتجات</span>
                <span className="font-medium text-gray-800">{formatPrice(order.totalPrice)}</span>
              </div>
              {order.shippingCost > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  <span className="font-medium text-gray-800">{formatPrice(order.shippingCost)}</span>
                </div>
              )}
              {order.codFee > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>رسوم الدفع عند الاستلام</span>
                  <span className="font-medium text-orange-500">{formatPrice(order.codFee)}</span>
                </div>
              )}
              {order.installmentFee > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>رسوم التقسيط</span>
                  <span className="font-medium text-orange-500">{formatPrice(order.installmentFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>عمولة الموقع</span>
                <span className="font-medium text-red-500">- {formatPrice(order.commissionAmount)}</span>
              </div>

              <div className="border-t border-dashed pt-2.5 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">إجمالي الطلب</span>
                  <span className="font-bold text-blue-600">{formatPrice(grandTotal)}</span>
                </div>
                <div className="flex justify-between bg-green-50 rounded-xl px-3 py-2.5">
                  <span className="font-bold text-green-700">نصيبك 💰</span>
                  <span className="font-extrabold text-green-600 text-base">
                    {formatPrice(order.sellerAmount)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-2.5 space-y-2">
                <div className="flex justify-between text-gray-500">
                  <span>طريقة الدفع</span>
                  <span className="font-medium text-gray-700">
                    {getPaymentMethodLabel(order.paymentMethod || order.payment?.paymentMethod)}
                  </span>
                </div>
                {paymentStatus && (
                  <div className="flex justify-between items-center text-gray-500">
                    <span>حالة الدفع</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${paymentStatus.color}`}>
                      {paymentStatus.icon} {paymentStatus.label}
                    </span>
                  </div>
                )}
              </div>

              {order.paymentMethod === 'CashOnDelivery' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3">
                  <p className="text-xs text-amber-700">
                    💡 طلبات الدفع عند الاستلام قد تظهر ضمن المبيعات والأرباح والتقارير، لكن لا تدخل ضمن الرصيد المتاح للسحب أو السحب.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiUser size={18} className="text-purple-500" />
              العميل
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-gray-400">👤</span>
                <span className="font-medium">
                  {order.userName || order.customerName || 'غير معروف'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-gray-400">📧</span>
                <span>{order.userEmail || order.customerEmail || 'غير متوفر'}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                  <FiPhone size={12} /> رقم الموبايل
                </p>
                {renderCustomerPhone()}
              </div>
            </div>
          </div>

          {['Delivered', 'Completed'].includes(order.status) && (
            <div
              className={`rounded-2xl border p-5 ${
                order.status === 'Completed'
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                  : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
              }`}
            >
              {order.status === 'Completed' ? (
                <div className="text-center">
                  <div className="text-4xl mb-2">💰</div>
                  <p className="font-bold text-green-800">تم إضافة أرباحك!</p>
                  <p className="text-2xl font-extrabold text-green-600 mt-1">
                    {formatPrice(order.sellerAmount)}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-blue-800 flex items-center gap-1.5">
                    <FiClock size={15} /> في فترة الانتظار
                  </p>
                  <p className="text-sm text-blue-600 mt-1.5">
                    سيتم إضافة أرباحك <span className="font-bold">{formatPrice(order.sellerAmount)}</span> بعد 3 أيام من التسليم
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetailsPage;