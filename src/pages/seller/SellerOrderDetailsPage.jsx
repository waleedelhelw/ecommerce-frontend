import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiPhone, FiCopy, FiPackage, FiTruck, FiUser, FiMapPin, FiDollarSign, FiClock } from 'react-icons/fi';
import {
  getOrderById,
  startProcessing,
  readyToShip,
  shipOrder,
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

  useEffect(() => { fetchOrder(); }, [id]);

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
    if (!shipData.trackingNumber.trim())  errors.trackingNumber  = 'رقم التتبع مطلوب';
    setShipErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setActionLoading(true);
      await shipOrder(id, {
        shippingCompany: shipData.shippingCompany.trim(),
        trackingNumber:  shipData.trackingNumber.trim(),
        trackingUrl:     shipData.trackingUrl.trim() || null,
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

  const getPaymentMethodLabel = (method) => {
    if (!method) return 'غير محدد';
    return PAYMENT_LABELS?.[method] || method;
  };

  const renderCustomerPhone = () => {
    if (!order?.customerPhoneNumber)
      return <span className="text-gray-400 text-sm">غير متوفر</span>;
    return (
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={`tel:${order.customerPhoneNumber}`}
          dir="ltr"
          className="inline-flex items-center gap-1.5 font-bold text-blue-600
                     hover:text-blue-800 hover:underline text-sm"
        >
          <FiPhone size={14} />
          {order.customerPhoneNumber}
        </a>
        <button
          type="button"
          onClick={handleCopyPhone}
          className="inline-flex items-center gap-1 text-xs px-2 py-1
                     bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600
                     transition-colors"
        >
          <FiCopy size={12} />
          نسخ
        </button>
      </div>
    );
  };

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorMessage message={error} onRetry={fetchOrder} />;
  if (!order)  return null;

  const status        = getStatusInfo(orderStatusMap, order.status);
  const paymentStatus = order.payment ? getStatusInfo(paymentStatusMap, order.payment.status) : null;
  const grandTotal    =
    order.grandTotal ||
    (order.totalPrice || 0) +
    (order.shippingCost || 0) +
    (order.codFee || 0) +
    (order.installmentFee || 0);

  return (
    <div className="max-w-7xl mx-auto">

      {/* ── Header ── */}
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

      {/* ══════════════════════════════════════
          أزرار الإجراءات
      ══════════════════════════════════════ */}

      {/* دفع مؤكد */}
      {order.status === 'PaymentConfirmed' && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50
                        border border-green-200 rounded-2xl p-5 mb-6
                        flex items-center justify-between gap-4 flex-wrap">
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
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl
                       hover:bg-blue-700 disabled:opacity-50 text-sm font-semibold
                       transition-colors shadow-sm"
          >
            {actionLoading ? '...' : '🔄 بدء التجهيز'}
          </button>
        </div>
      )}

      {/* جاري التجهيز */}
      {order.status === 'Processing' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50
                        border border-blue-200 rounded-2xl p-5 mb-6
                        flex items-center justify-between gap-4 flex-wrap">
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
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl
                       hover:bg-indigo-700 disabled:opacity-50 text-sm font-semibold
                       transition-colors shadow-sm"
          >
            {actionLoading ? '...' : '📦 جاهز للشحن'}
          </button>
        </div>
      )}

      {/* جاهز للشحن */}
      {order.status === 'ReadyToShip' && !showShipForm && (
        <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50
                        border border-purple-200 rounded-2xl p-5 mb-6
                        flex items-center justify-between gap-4 flex-wrap">
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
            className="bg-purple-600 text-white px-5 py-2.5 rounded-xl
                       hover:bg-purple-700 text-sm font-semibold
                       transition-colors shadow-sm"
          >
            🚚 شحن الطلب
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════
          فورم بيانات الشحن
      ══════════════════════════════════════ */}
      {showShipForm && (
        <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-sm p-6 mb-6">

          {/* عنوان الفورم */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-100
                            flex items-center justify-center">
              <FiTruck size={18} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">بيانات الشحن</h3>
              <p className="text-xs text-gray-400">أدخل تفاصيل شحن الطلب</p>
            </div>
          </div>

          {/* ── تنبيه رقم العميل ── */}
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

          {/* ── تنبيه الشحن المحلي ── */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-2">
              <span className="text-lg shrink-0">💡</span>
              <div>
                <p className="font-bold text-amber-800 text-sm mb-1">
                  بتشحن مع مندوب محلي مش شركة شحن؟
                </p>
                <ul className="text-xs text-amber-700 space-y-1 list-none">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>
                      في خانة <strong>"شركة الشحن"</strong> اكتب اسم المندوب
                      أو رقم العربية / الآلة اللي بتشحن بيها
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>
                      في خانة <strong>"رقم التتبع"</strong> اكتب رقم موبايل
                      المندوب اللي بتشحن معاه عشان العميل يقدر يتابعه
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── الفيلدز ── */}
          <div className="space-y-4">

            {/* شركة الشحن */}
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
                  if (shipErrors.shippingCompany)
                    setShipErrors((p) => ({ ...p, shippingCompany: '' }));
                }}
                placeholder="مثال: أرامكس، DHL، محمد المندوب، آلة رقم 5..."
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none
                            focus:ring-2 focus:ring-purple-400 focus:border-purple-400
                            transition-all
                            ${shipErrors.shippingCompany
                              ? 'border-red-400 bg-red-50'
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
              />
              {shipErrors.shippingCompany && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span>⚠</span> {shipErrors.shippingCompany}
                </p>
              )}
            </div>

            {/* رقم التتبع */}
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
                  if (shipErrors.trackingNumber)
                    setShipErrors((p) => ({ ...p, trackingNumber: '' }));
                }}
                placeholder="مثال: 1234567890 أو 01012345678 (رقم المندوب)"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none
                            focus:ring-2 focus:ring-purple-400 focus:border-purple-400
                            transition-all
                            ${shipErrors.trackingNumber
                              ? 'border-red-400 bg-red-50'
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
              />
              {shipErrors.trackingNumber && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span>⚠</span> {shipErrors.trackingNumber}
                </p>
              )}
              <p className="mt-1.5 text-xs text-gray-400">
                لو بتشحن مع مندوب محلي، اكتب رقم موبايله عشان العميل يتواصل معاه مباشرة
              </p>
            </div>

            {/* رابط التتبع */}
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
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50
                           hover:border-gray-300 rounded-xl text-sm outline-none
                           focus:ring-2 focus:ring-purple-400 focus:border-purple-400
                           transition-all"
              />
            </div>

            {/* أزرار */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleShipOrder}
                disabled={actionLoading}
                className="flex-1 bg-purple-600 text-white py-3 rounded-xl
                           hover:bg-purple-700 disabled:opacity-50 font-semibold
                           text-sm transition-colors shadow-sm
                           flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    جاري الشحن...
                  </>
                ) : (
                  <><FiTruck size={16} /> تأكيد الشحن</>
                )}
              </button>
              <button
                onClick={() => { setShowShipForm(false); setShipErrors({}); }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl
                           hover:bg-gray-200 font-semibold text-sm transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Timeline ── */}
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

      {/* ── المحتوى الرئيسي ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* العمود الرئيسي */}
        <div className="lg:col-span-2 space-y-6">

          {/* عناصر الطلب */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiPackage size={18} className="text-purple-500" />
              عناصر الطلب
            </h2>
            <div className="space-y-3">
              {(order.items || order.orderItems || []).map((item, index) => (
                <div key={item.id || index}
                  className="flex items-center gap-4 p-3 bg-gray-50
                             hover:bg-gray-100 rounded-xl transition-colors">
                  <img
                    src={item.productImageUrl || item.imageUrl || '/placeholder-product.png'}
                    alt={item.productName || item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                    onError={(e) => { e.target.src = '/placeholder-product.png'; }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">
                      {item.productName || item.name}
                    </p>
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

          {/* عنوان الشحن */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiMapPin size={18} className="text-purple-500" />
              عنوان الشحن
            </h2>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-800">{order.shippingAddress}</p>
                <p>
                  {order.shippingCity}
                  {order.shippingCity && order.shippingCountry && '، '}
                  {order.shippingCountry}
                </p>
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

          {/* بيانات الشحن لو اتشحن */}
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
                  <span className="font-mono font-bold text-purple-600">
                    {order.trackingNumber}
                  </span>
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
                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium">
                      فتح الرابط ↗
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* العمود الجانبي */}
        <div className="space-y-6">

          {/* الملخص المالي */}
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
            </div>
          </div>

          {/* بيانات العميل */}
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

          {/* ملاحظة الأرباح */}
          {['Delivered', 'Completed'].includes(order.status) && (
            <div className={`rounded-2xl border p-5 ${
              order.status === 'Completed'
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
            }`}>
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
                    سيتم إضافة أرباحك{' '}
                    <span className="font-bold">{formatPrice(order.sellerAmount)}</span>{' '}
                    بعد 3 أيام من التسليم
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