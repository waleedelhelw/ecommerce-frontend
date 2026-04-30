import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
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

  // ✅ بيانات الشحن
  const [showShipForm, setShowShipForm] = useState(false);
  const [shipData, setShipData] = useState({
    shippingCompany: '',
    trackingNumber: '',
    trackingUrl: '',
  });
  const [shipErrors, setShipErrors] = useState({});

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

  // ✅ بدء التجهيز
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

  // ✅ جاهز للشحن
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

  // ✅ شحن الطلب
  const handleShipOrder = async () => {
    const errors = {};
    if (!shipData.shippingCompany.trim()) errors.shippingCompany = 'اسم شركة الشحن مطلوب';
    if (!shipData.trackingNumber.trim()) errors.trackingNumber = 'رقم التتبع مطلوب';
    setShipErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setActionLoading(true);
      await shipOrder(id, shipData);
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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrder} />;
  if (!order) return null;

  const status = getStatusInfo(orderStatusMap, order.status);
  const paymentStatus = order.payment
    ? getStatusInfo(paymentStatusMap, order.payment.status)
    : null;
  const grandTotal = (order.totalPrice || 0) + (order.shippingCost || 0) + (order.codFee || 0);

  return (
    <div>
      {/* العنوان */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/seller/orders')} className="p-2 hover:bg-gray-100 rounded-lg">
          <FiArrowRight size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">طلب #{order.id}</h1>
          <p className="text-gray-500 text-sm">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
          {status.icon} {status.label}
        </span>
      </div>

      {/* ✅ أزرار الإجراءات حسب الحالة */}
      {order.status === 'PaymentConfirmed' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-bold text-green-800">الدفع مؤكد - ابدأ تجهيز الطلب!</p>
                <p className="text-sm text-green-700">العميل دفع وتم تأكيد الدفع من الإدارة</p>
              </div>
            </div>
            <button
              onClick={handleStartProcessing}
              disabled={actionLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
            >
              {actionLoading ? '...' : '🔄 بدء التجهيز'}
            </button>
          </div>
        </div>
      )}

      {order.status === 'Processing' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <p className="font-bold text-blue-800">جاري التجهيز</p>
                <p className="text-sm text-blue-700">لما تخلص تجهيز الطلب، اضغط جاهز للشحن</p>
              </div>
            </div>
            <button
              onClick={handleReadyToShip}
              disabled={actionLoading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
            >
              {actionLoading ? '...' : '📦 جاهز للشحن'}
            </button>
          </div>
        </div>
      )}

      {order.status === 'ReadyToShip' && !showShipForm && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-bold text-indigo-800">الطلب جاهز للشحن</p>
                <p className="text-sm text-indigo-700">أدخل بيانات الشحن ورقم التتبع</p>
              </div>
            </div>
            <button
              onClick={() => setShowShipForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium"
            >
              🚚 شحن الطلب
            </button>
          </div>
        </div>
      )}

      {/* ✅ فورم بيانات الشحن */}
      {showShipForm && (
        <div className="bg-white rounded-xl border-2 border-purple-300 p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">🚚 بيانات الشحن</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شركة الشحن *
              </label>
              <input
                type="text"
                value={shipData.shippingCompany}
                onChange={(e) => setShipData({ ...shipData, shippingCompany: e.target.value })}
                placeholder="مثال: أرامكس، DHL، البريد المصري..."
                className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 ${
                  shipErrors.shippingCompany ? 'border-red-500' : ''
                }`}
              />
              {shipErrors.shippingCompany && (
                <p className="mt-1 text-xs text-red-500">{shipErrors.shippingCompany}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم التتبع *
              </label>
              <input
                type="text"
                value={shipData.trackingNumber}
                onChange={(e) => setShipData({ ...shipData, trackingNumber: e.target.value })}
                placeholder="رقم تتبع الشحنة"
                className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 ${
                  shipErrors.trackingNumber ? 'border-red-500' : ''
                }`}
              />
              {shipErrors.trackingNumber && (
                <p className="mt-1 text-xs text-red-500">{shipErrors.trackingNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رابط التتبع (اختياري)
              </label>
              <input
                type="url"
                value={shipData.trackingUrl}
                onChange={(e) => setShipData({ ...shipData, trackingUrl: e.target.value })}
                placeholder="https://tracking.example.com/..."
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleShipOrder}
                disabled={actionLoading}
                className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
              >
                {actionLoading ? 'جاري الشحن...' : '🚚 تأكيد الشحن'}
              </button>
              <button
                onClick={() => {
                  setShowShipForm(false);
                  setShipErrors({});
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Timeline */}
      {order.timeline && order.timeline.length > 0 && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">📍 مسار الطلب</h2>
          <OrderTimeline
            currentStatus={order.status}
            timeline={order.timeline}
            paymentMethod={order.paymentMethod || order.payment?.paymentMethod}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* العمود الرئيسي */}
        <div className="lg:col-span-2 space-y-6">
          {/* عناصر الطلب */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">عناصر الطلب</h2>
            <div className="space-y-3">
              {(order.items || order.orderItems || []).map((item, index) => (
                <div key={item.id || index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.productImageUrl || item.imageUrl || '/placeholder-product.png'}
                    alt={item.productName || item.name}
                    className="w-14 h-14 rounded-lg object-cover"
                    onError={(e) => { e.target.src = '/placeholder-product.png'; }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.productName || item.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.unitPrice || item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-800">
                    {formatPrice((item.unitPrice || item.price) * item.quantity)}
                  </p>
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

          {/* ✅ بيانات الشحن (لو اتشحن) */}
          {order.trackingNumber && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">📍 بيانات الشحن</h2>
              <div className="space-y-3 text-sm">
                {order.shippingCompany && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">شركة الشحن</span>
                    <span className="font-medium">{order.shippingCompany}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">رقم التتبع</span>
                  <span className="font-mono font-bold text-purple-600">{order.trackingNumber}</span>
                </div>
                {order.shippedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">تاريخ الشحن</span>
                    <span className="font-medium">{formatDate(order.shippedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* العمود الجانبي */}
        <div className="space-y-6">
          {/* ✅ ملخص مالي - محدّث */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">الملخص المالي</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">إجمالي المنتجات</span>
                <span className="font-medium">{formatPrice(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">عمولة الموقع</span>
                <span className="text-red-600">- {formatPrice(order.commissionAmount)}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">نصيبك</span>
                <span className="font-bold text-green-600 text-lg">{formatPrice(order.sellerAmount)}</span>
              </div>

              <hr />
              <div className="flex justify-between">
                <span className="text-gray-500">طريقة الدفع</span>
                <span className="font-medium">
                  {getPaymentMethodLabel(order.paymentMethod || order.payment?.paymentMethod)}
                </span>
              </div>
              {paymentStatus && (
                <div className="flex justify-between">
                  <span className="text-gray-500">حالة الدفع</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${paymentStatus.color}`}>
                    {paymentStatus.icon} {paymentStatus.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* بيانات العميل */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">العميل</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p>👤 {order.userName || order.customerName}</p>
              <p>📧 {order.userEmail || order.customerEmail}</p>
            </div>
          </div>

          {/* ✅ ملاحظة الأرباح */}
          {['Delivered', 'Completed'].includes(order.status) && (
            <div className={`rounded-xl border p-4 ${
              order.status === 'Completed'
                ? 'bg-green-50 border-green-200'
                : 'bg-blue-50 border-blue-200'
            }`}>
              {order.status === 'Completed' ? (
                <div className="text-center">
                  <span className="text-3xl">💰</span>
                  <p className="font-bold text-green-800 mt-2">تم إضافة أرباحك!</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{formatPrice(order.sellerAmount)}</p>
                </div>
              ) : (
                <div>
                  <p className="font-medium text-blue-800">⏳ في فترة الانتظار</p>
                  <p className="text-sm text-blue-700 mt-1">
                    سيتم إضافة أرباحك ({formatPrice(order.sellerAmount)}) بعد 3 أيام من التسليم
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