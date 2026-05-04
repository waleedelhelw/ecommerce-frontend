import { useState } from 'react';
import { payInstallment } from '../../api/installmentService';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { PAYMENT_METHODS } from '../../utils/constants';
import Modal from '../common/Modal';

const PayInstallmentModal = ({ installment, isOpen, onClose, onSuccess, paymentSettings = {} }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // طرق الدفع المتاحة للأقساط (بدون كاش)
  const availableMethods = PAYMENT_METHODS.filter(
    (m) => m.value !== 'CashOnDelivery'
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      setError('اختر طريقة الدفع');
      return;
    }
    if (!paymentProofUrl.trim()) {
      setError('ارفع صورة إيصال الدفع');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await payInstallment(installment.id, {
        paymentMethod,
        paymentProofUrl: paymentProofUrl.trim(),
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || 'حدث خطأ أثناء دفع الدفعة'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPaymentMethod('');
    setPaymentProofUrl('');
    setError(null);
  };

  if (!installment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleReset();
        onClose();
      }}
      title={`💳 دفع الدفعة ${installment.installmentNumber}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* معلومات الدفعة */}
        <div className={`p-4 rounded-xl border ${
          installment.status === 'Overdue'
            ? 'bg-red-50 border-red-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">المبلغ المطلوب:</span>
            <span className="text-2xl font-bold text-blue-700">
              {formatPrice(installment.amount)}
            </span>
          </div>
          {installment.dueDate && (
            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-gray-500">تاريخ الاستحقاق:</span>
              <span className={`font-medium ${
                installment.status === 'Overdue' ? 'text-red-600' : 'text-gray-700'
              }`}>
                {formatDate(installment.dueDate)}
              </span>
            </div>
          )}
          {installment.status === 'Overdue' && (
            <p className="text-red-600 text-xs mt-2 font-bold">
              🚨 هذه الدفعة متأخرة! يرجى الدفع فوراً لتجنب إلغاء الطلب.
            </p>
          )}
        </div>

        {/* اختيار طريقة الدفع */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            طريقة الدفع
          </label>
          <div className="space-y-2">
            {availableMethods.map((method) => (
              <label
                key={method.value}
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === method.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="installmentPaymentMethod"
                  value={method.value}
                  checked={paymentMethod === method.value}
                  onChange={() => setPaymentMethod(method.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium text-gray-800">{method.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* معلومات التحويل */}
        {paymentMethod && paymentMethod !== 'CashOnDelivery' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm font-bold text-yellow-800 mb-1">📌 تعليمات الدفع:</p>
            <p className="text-xs text-yellow-700">
              قم بتحويل المبلغ {formatPrice(installment.amount)} عبر {
                PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label
              } ثم ارفع صورة الإيصال أدناه.
            </p>
          </div>
        )}

        {/* رابط صورة الإيصال */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            📸 رابط صورة إيصال الدفع
          </label>
          <input
            type="url"
            value={paymentProofUrl}
            onChange={(e) => setPaymentProofUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/... أو أي رابط صورة"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            dir="ltr"
          />
          <p className="text-xs text-gray-400 mt-1">
            ارفع الصورة على Cloudinary أو أي خدمة رفع وألصق الرابط هنا
          </p>
        </div>

        {/* رسالة خطأ */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}

        {/* الأزرار */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                جاري الدفع...
              </span>
            ) : (
              '💳 تأكيد الدفع'
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
          >
            إلغاء
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PayInstallmentModal;