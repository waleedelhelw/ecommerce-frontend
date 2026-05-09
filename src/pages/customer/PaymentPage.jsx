import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorMessage from '../../components/common/ErrorMessage';
import orderService from '../../api/orderService';
import settingsService from '../../api/settingsService';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { PAYMENT_LABELS } from '../../utils/constants';
import { orderStatusMap } from '../../utils/orderStatusMap';
import { uploadImage } from '../../utils/cloudinary';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);

  // ✅ جلب الطلب + معلومات الدفع
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [orderData, settingsData] = await Promise.all([
          orderService.getOrderById(id),
          settingsService.getPaymentInfo().catch(() => null),
        ]);

        setOrder(orderData);
        setPaymentInfo(settingsData);
      } catch (err) {
        setError('فشل في تحميل بيانات الطلب');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // معالجة اختيار الصورة
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار صورة فقط');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة لازم يكون أقل من 5 ميجا');
      return;
    }

    setReceiptFile(file);
    setReceiptPreview(URL.createObjectURL(file));
  };

  // رفع الإيصال
  const handleUploadReceipt = async () => {
    if (!receiptFile) {
      toast.error('اختر صورة الإيصال أولاً');
      return;
    }

    try {
      setUploading(true);

      // رفع الصورة على Cloudinary
      const imageUrl = await uploadImage(receiptFile);

      // إرسال الرابط للباك إند
      await orderService.uploadReceipt(id, { receiptImageUrl: imageUrl });

      toast.success('تم رفع الإيصال بنجاح! ✅ جاري المراجعة...');
      navigate(`/orders/${id}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل رفع الإيصال');
    } finally {
      setUploading(false);
    }
  };

  // إزالة الصورة المختارة
  const handleRemoveFile = () => {
    setReceiptFile(null);
    if (receiptPreview) URL.revokeObjectURL(receiptPreview);
    setReceiptPreview(null);
  };

  // ✅ Helper: جلب بيانات الدفع حسب طريقة الدفع
  const getPaymentDetails = () => {
    if (!order || !paymentInfo) return null;
    const method = order.paymentMethod || order.payment?.paymentMethod;

    if (method === 'BankTransfer') {
      return {
        type: 'bank',
        bankName: paymentInfo.bankName,
        bankAccount: paymentInfo.bankAccount,
        bankHolder: paymentInfo.bankHolder,
      };
    }

    const walletMap = {
      VodafoneCash: paymentInfo.vodafoneCash,
      EtisalatCash: paymentInfo.etisalatCash,
      OrangeCash: paymentInfo.orangeCash,
      InstaPay: paymentInfo.instaPay,
    };

    const walletNumber = walletMap[method];
    if (walletNumber) {
      return { type: 'wallet', walletNumber, methodLabel: PAYMENT_LABELS[method] || method };
    }

    return null;
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!order) return <ErrorMessage message="الطلب غير موجود" />;

  const status = orderStatusMap[order.status] || orderStatusMap.PendingPayment;
  const paymentDetails = getPaymentDetails();
  const grandTotal = (order.totalPrice || 0) + (order.shippingCost || 0) + (order.codFee || 0);
  const canUpload = order.status === 'PendingPayment' || order.status === 'PaymentFailed';
  const alreadyUploaded = order.status === 'WaitingConfirmation';
  const existingReceipt = order.payment?.receiptImageUrl;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'الرئيسية', link: '/' },
          { label: 'طلباتي', link: '/orders' },
          { label: `طلب #${order.id}`, link: `/orders/${order.id}` },
          { label: 'الدفع' },
        ]}
      />

      <h1 className="text-2xl font-bold mb-6">💳 إتمام الدفع - طلب #{order.id}</h1>

      {/* حالة الطلب */}
      <div className={`p-4 rounded-xl mb-6 ${
        order.status === 'PaymentFailed' ? 'bg-red-50 border border-red-200' :
        alreadyUploaded ? 'bg-orange-50 border border-orange-200' :
        'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{status.icon}</span>
          <div>
            <p className="font-bold text-gray-800">{status.label}</p>
            {order.status === 'PaymentFailed' && order.payment?.rejectionReason && (
              <p className="text-sm text-red-600 mt-1">
                ❌ سبب الرفض: {order.payment.rejectionReason}
              </p>
            )}
            {alreadyUploaded && (
              <p className="text-sm text-orange-700 mt-1">
                تم رفع الإيصال وجاري المراجعة من الإدارة ⏳
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* تعليمات الدفع */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold mb-4">📋 تعليمات الدفع</h2>

          {/* معلومات الطلب */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">المبلغ المطلوب</span>
              <span className="font-bold text-xl text-blue-600">{formatPrice(grandTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">طريقة الدفع</span>
              <span className="font-medium">
                {PAYMENT_LABELS[order.paymentMethod || order.payment?.paymentMethod] || 'غير محدد'}
              </span>
            </div>
          </div>

          {/* بيانات التحويل - محفظة */}
          {paymentDetails && paymentDetails.type === 'wallet' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-700 mb-2 font-medium">
                📱 حوّل المبلغ على الرقم التالي:
              </p>
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-800 tracking-wider direction-ltr">
                  {paymentDetails.walletNumber}
                </p>
                <p className="text-sm text-gray-500 mt-1">{paymentDetails.methodLabel}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(paymentDetails.walletNumber);
                  toast.success('تم نسخ الرقم');
                }}
                className="w-full mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                📋 نسخ الرقم
              </button>
            </div>
          )}

          {/* بيانات التحويل - بنكي */}
          {paymentDetails && paymentDetails.type === 'bank' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-700 mb-3 font-medium">
                🏦 حوّل المبلغ على الحساب البنكي التالي:
              </p>
              <div className="bg-white rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">البنك</span>
                  <span className="font-medium">{paymentDetails.bankName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">رقم الحساب</span>
                  <span className="font-bold tracking-wider direction-ltr">
                    {paymentDetails.bankAccount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">اسم صاحب الحساب</span>
                  <span className="font-medium">{paymentDetails.bankHolder}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(paymentDetails.bankAccount);
                  toast.success('تم نسخ رقم الحساب');
                }}
                className="w-full mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                📋 نسخ رقم الحساب
              </button>
            </div>
          )}

          {/* ✅ لو مفيش بيانات دفع */}
          {!paymentDetails && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-700">
                ⚠️ لم يتم تحديد بيانات الدفع بعد. تواصل مع الإدارة.
              </p>
            </div>
          )}

          {/* خطوات الدفع */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">📝 الخطوات:</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <span>حوّل المبلغ ({formatPrice(grandTotal)}) على الرقم/الحساب أعلاه</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <span>خد سكرين شوت أو صورة لإيصال التحويل</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <span>ارفع صورة الإيصال من هنا</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                <span>استنى تأكيد الإدارة (عادةً خلال ساعات قليلة)</span>
              </li>
            </ol>
          </div>
        </div>

        {/* رفع الإيصال */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold mb-4">📸 رفع إيصال الدفع</h2>

          {/* لو رفع إيصال قبل كده وفي انتظار المراجعة */}
          {alreadyUploaded && existingReceipt && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">الإيصال المرفوع:</p>
              <img
                src={existingReceipt}
                alt="إيصال الدفع"
                className="w-full rounded-lg border"
              />
              <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-700">
                  ⏳ جاري مراجعة الإيصال من الإدارة. سيتم إبلاغك بالنتيجة عبر البريد الإلكتروني.
                </p>
              </div>
            </div>
          )}

          {/* منطقة رفع الصورة */}
          {canUpload && (
            <>
              {!receiptPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <div className="text-center">
                    <span className="text-4xl">📤</span>
                    <p className="mt-2 text-sm text-gray-600">اضغط لاختيار صورة الإيصال</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG - حد أقصى 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={receiptPreview}
                    alt="معاينة الإيصال"
                    className="w-full rounded-xl border"
                  />
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-2 left-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* زرار الرفع */}
              <button
                onClick={handleUploadReceipt}
                disabled={!receiptFile || uploading}
                className="btn-primary w-full mt-4 py-3 text-base"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    جاري رفع الإيصال...
                  </span>
                ) : (
                  '✅ تأكيد الدفع ورفع الإيصال'
                )}
              </button>

              {order.status === 'PaymentFailed' && (
                <p className="text-xs text-center text-gray-500 mt-2">
                  يمكنك رفع إيصال جديد بعد ما الإيصال السابق اترفض
                </p>
              )}
            </>
          )}

          {/* لو الدفع متأكد خلاص */}
          {order.status === 'PaymentConfirmed' && (
            <div className="text-center p-6">
              <span className="text-5xl">✅</span>
              <h3 className="text-lg font-bold text-green-700 mt-3">تم تأكيد الدفع بنجاح!</h3>
              <p className="text-sm text-gray-500 mt-2">البائع هيبدأ يجهّز طلبك دلوقتي</p>
              <Link
                to={`/orders/${id}`}
                className="btn-primary mt-4 inline-block"
              >
                📋 تتبع طلبك
              </Link>
            </div>
          )}

          {/* تحذير وقت */}
          {canUpload && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-xs text-red-600">
                ⏰ <strong>تنبيه:</strong> لو مرفعتش إيصال الدفع خلال 24 ساعة من إنشاء الطلب، هيتم إلغاؤه تلقائياً.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;