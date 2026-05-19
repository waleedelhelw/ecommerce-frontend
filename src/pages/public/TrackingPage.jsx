import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPackage, FiUser, FiDollarSign, FiCopy, FiCheck } from 'react-icons/fi';
import { getPublicTracking } from '../../api/trackingService';
import TrackingTimeline from '../../components/order/TrackingTimeline';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const STATUS_BADGES = {
  PendingPayment:   { color: 'bg-yellow-100 text-yellow-800', label: 'في انتظار الدفع' },
  Processing:       { color: 'bg-blue-100 text-blue-800', label: 'قيد التجهيز' },
  ReadyToShip:      { color: 'bg-indigo-100 text-indigo-800', label: 'جاهز للشحن' },
  Shipped:          { color: 'bg-purple-100 text-purple-800', label: 'تم الشحن' },
  Delivered:        { color: 'bg-green-100 text-green-800', label: 'تم التوصيل' },
  Completed:        { color: 'bg-green-100 text-green-800', label: 'مكتمل' },
  Cancelled:        { color: 'bg-red-100 text-red-800', label: 'ملغي' },
  DeliveryFailed:   { color: 'bg-orange-100 text-orange-800', label: 'فشل التوصيل' },
  ReturnedToSeller: { color: 'bg-gray-100 text-gray-800', label: 'رجع للبائع' },
};

const TrackingPage = () => {
  const { trackingToken } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getPublicTracking(trackingToken);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          if (err.response?.status === 404) {
            setError('الطلب غير موجود');
          } else {
            setError('حدث خطأ في تحميل بيانات الطلب');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [trackingToken]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('تم نسخ الرابط');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('فشل النسخ');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">جارٍ تحميل بيانات الطلب...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">الطلب غير موجود</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/" className="text-purple-600 hover:underline font-medium">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const badge = STATUS_BADGES[data.status] || { color: 'bg-gray-100 text-gray-800', label: data.status };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiPackage className="text-purple-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">تتبع الطلب</h1>
        <p className="text-gray-500 mt-1">رقم الطلب: #{data.orderId}</p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">حالة الطلب</p>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <button
            onClick={copyLink}
            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800"
          >
            {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
            {copied ? 'تم' : 'نسخ الرابط'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <FiUser size={14} /> العميل
            </div>
            <p className="font-medium text-gray-800">{data.customerName}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <FiDollarSign size={14} /> الإجمالي
            </div>
            <p className="font-medium text-gray-800">{formatPrice(data.totalPrice)}</p>
          </div>
        </div>

        {data.items && data.items.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3">المنتجات</h3>
            <div className="space-y-2">
              {data.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{item.productName}</p>
                    <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-sm text-gray-800">{formatPrice(item.unitPrice)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-6">تقدم الطلب</h2>
        <TrackingTimeline
          currentStatus={data.status}
          timeline={data.timeline || []}
        />
      </div>

      <div className="text-center mt-8">
        <Link to="/" className="text-purple-600 hover:underline text-sm">
          ↵ تسوّق
        </Link>
      </div>
    </div>
  );
};

export default TrackingPage;
