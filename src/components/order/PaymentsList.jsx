import { useState } from 'react';
import { PAYMENT_LABELS, PAYMENT_STATUS_LABELS, PAYMENT_TARGET_LABELS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { uploadImage } from '../../utils/cloudinary';
import toast from 'react-hot-toast';

const PaymentCard = ({ payment, paymentInfo, onUploadReceipt, showUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [transactionRef, setTransactionRef] = useState('');

  const statusInfo = PAYMENT_STATUS_LABELS[payment.status] || {};
  const targetInfo = PAYMENT_TARGET_LABELS[payment.paymentTarget] || {};
  const isPlatform = payment.paymentTarget === 'Platform';

  // بيانات التحويل (للمنصة)
  const paymentDetails = getPaymentTransferInfo(payment.paymentMethod, paymentInfo);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('يرجى اختيار صورة فقط'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('حجم الصورة لازم يكون أقل من 5 ميجا'); return; }
    setReceiptFile(file);
    setReceiptPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!receiptFile) { toast.error('اختر صورة الإيصال أولاً'); return; }
    try {
      setUploading(true);
      const imageUrl = await uploadImage(receiptFile);
      await onUploadReceipt(payment.id, {
        receiptImageUrl: imageUrl,
        transactionReference: transactionRef.trim() || undefined,
      });
      toast.success('تم رفع الإيصال بنجاح! ✅');
      setReceiptFile(null);
      setReceiptPreview(null);
      setTransactionRef('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل رفع الإيصال');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800">{payment.label || 'دفعة'}</span>
          <span className="text-sm text-gray-400">#{payment.paymentOrder}</span>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusInfo.color || 'bg-gray-100 text-gray-800'}`}>
          {statusInfo.icon} {statusInfo.label || payment.status}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* المبلغ وطريقة الدفع */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500">المبلغ</span>
          <span className="text-xl font-bold text-blue-600">{formatPrice(payment.amount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">طريقة الدفع</span>
          <span className="font-medium">{payment.paymentMethodDisplay || PAYMENT_LABELS[payment.paymentMethod] || payment.paymentMethod}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">جهة الدفع</span>
          <span className="font-medium">{targetInfo.label || payment.paymentTarget}</span>
        </div>

        {/* بيانات حساب التاجر (Self Mode) */}
        {payment.sellerPaymentMethod && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-700 mb-1">📋 حول على حساب التاجر:</p>
            <p className="text-sm font-mono font-bold text-gray-800 text-left" dir="ltr">
              {payment.sellerPaymentMethod.accountIdentifier}
            </p>
            {payment.sellerPaymentMethod.accountHolderName && (
              <p className="text-xs text-blue-600">باسم: {payment.sellerPaymentMethod.accountHolderName}</p>
            )}
            <p className="text-xs text-blue-500">{payment.sellerPaymentMethod.paymentMethodDisplay}</p>
          </div>
        )}

        {/* بيانات المنصة (Platform Mode) */}
        {isPlatform && paymentDetails && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-green-700 mb-1">📱 حول على حساب المنصة:</p>
            {paymentDetails.type === 'wallet' ? (
              <>
                <p className="text-lg font-bold text-gray-800 text-left tracking-wider" dir="ltr">
                  {paymentDetails.walletNumber}
                </p>
                <p className="text-xs text-green-600">{paymentDetails.methodLabel}</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(paymentDetails.walletNumber); toast.success('تم نسخ الرقم'); }}
                  className="text-xs text-green-700 hover:text-green-800 font-medium mt-1"
                >
                  📋 نسخ الرقم
                </button>
              </>
            ) : (
              <div className="space-y-1 text-sm">
                <p>البنك: {paymentDetails.bankName}</p>
                <p className="font-mono font-bold">رقم الحساب: {paymentDetails.bankAccount}</p>
                <p>اسم المستفيد: {paymentDetails.bankHolder}</p>
              </div>
            )}
          </div>
        )}

        {/* التاريخ */}
        {payment.paidAt && (
          <div className="flex justify-between text-xs text-gray-400">
            <span>تاريخ الدفع</span>
            <span>{formatDate(payment.paidAt)}</span>
          </div>
        )}

        {/* الإيصال المرفوع */}
        {payment.receiptImageUrl && (
          <div>
            <p className="text-xs text-gray-500 mb-1">🧾 الإيصال:</p>
            <a
              href={payment.receiptImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              📄 عرض الإيصال ↗
            </a>
          </div>
        )}

        {/* سبب الرفض */}
        {payment.status === 'Failed' && payment.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs text-red-700">❌ سبب الرفض: {payment.rejectionReason}</p>
          </div>
        )}

        {/* تاريخ التأكيد */}
        {payment.confirmedAt && (
          <div className="flex justify-between text-xs text-gray-400">
            <span>تاريخ التأكيد</span>
            <span>{formatDate(payment.confirmedAt)}</span>
          </div>
        )}
        {payment.confirmedByName && (
          <div className="flex justify-between text-xs text-gray-400">
            <span>تم التأكيد بواسطة</span>
            <span>{payment.confirmedByName}</span>
          </div>
        )}

        {/* رقم المرجع */}
        {payment.transactionReference && (
          <div className="flex justify-between text-xs text-gray-400">
            <span>رقم المرجع</span>
            <span className="font-mono">{payment.transactionReference}</span>
          </div>
        )}

        {/* رفع الإيصال */}
        {showUpload && payment.status === 'Pending' && (
          <div className="border-t pt-3 mt-3 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                رقم المرجع (اختياري)
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="مثال: REF123456"
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                dir="ltr"
              />
            </div>

            {!receiptPreview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                <span className="text-2xl">📤</span>
                <p className="text-xs text-gray-500 mt-1">اضغط لاختيار صورة الإيصال</p>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            ) : (
              <div className="relative">
                <img src={receiptPreview} alt="الإيصال" width={400} height={160} className="w-full rounded-lg border max-h-40 object-contain" />
                <button
                  onClick={() => { setReceiptFile(null); setReceiptPreview(null); }}
                  className="absolute top-1 left-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!receiptFile || uploading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-sm transition-colors"
            >
              {uploading ? 'جاري الرفع...' : '📤 رفع إيصال الدفع'}
            </button>
          </div>
        )}

        {payment.status === 'Failed' && showUpload && (
          <div className="border-t pt-3 mt-3">
            <p className="text-xs text-gray-500 mb-2">يمكنك إعادة رفع إيصال جديد:</p>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="رقم المرجع (اختياري)"
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  dir="ltr"
                />
              </div>
              {!receiptPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <span className="text-2xl">📤</span>
                  <p className="text-xs text-gray-500 mt-1">اضغط لاختيار صورة جديدة</p>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative">
                  <img src={receiptPreview} alt="الإيصال" width={400} height={160} className="w-full rounded-lg border max-h-40 object-contain" />
                  <button onClick={() => { setReceiptFile(null); setReceiptPreview(null); }}
                    className="absolute top-1 left-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">✕</button>
                </div>
              )}
              <button
                onClick={handleUpload}
                disabled={!receiptFile || uploading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-sm"
              >
                {uploading ? 'جاري الرفع...' : '📤 إعادة رفع الإيصال'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentsList = ({ payments = [], paymentInfo, showUpload, onUploadReceipt }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-gray-400">لا توجد مدفوعات مسجلة لهذا الطلب</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <PaymentCard
          key={payment.id}
          payment={payment}
          paymentInfo={paymentInfo}
          showUpload={showUpload}
          onUploadReceipt={onUploadReceipt}
        />
      ))}
    </div>
  );
};

function getPaymentTransferInfo(paymentMethod, paymentInfo) {
  if (!paymentInfo) return null;

  if (paymentMethod === 'BankTransfer') {
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

  const walletNumber = walletMap[paymentMethod];
  if (walletNumber) {
    return { type: 'wallet', walletNumber, methodLabel: PAYMENT_LABELS[paymentMethod] || paymentMethod };
  }

  return null;
}

export default PaymentsList;
