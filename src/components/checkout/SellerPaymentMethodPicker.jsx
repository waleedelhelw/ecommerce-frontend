import { PAYMENT_LABELS } from '../../utils/constants';

const PaymentMethodCard = ({ method, isSelected, onSelect }) => (
  <label
    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
      isSelected
        ? 'border-blue-500 bg-blue-50 shadow-sm'
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    }`}
  >
    <input
      type="radio"
      name="sellerPaymentMethod"
      value={method.id}
      checked={isSelected}
      onChange={() => onSelect(method.id)}
      className="w-4 h-4 text-blue-600 shrink-0"
    />
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-800">
          {method.paymentMethodDisplay || PAYMENT_LABELS[method.paymentMethod] || method.paymentMethod}
        </span>
        {method.isDefault && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            افتراضي
          </span>
        )}
      </div>
      <div className="mt-2 bg-gray-50 rounded-lg p-3 space-y-1">
        {method.accountIdentifier && (
          <p className="text-sm font-mono font-bold text-gray-700 dir-ltr text-left">
            {method.accountIdentifier}
          </p>
        )}
        {method.accountHolderName && (
          <p className="text-xs text-gray-500">
            باسم: <span className="font-medium text-gray-700">{method.accountHolderName}</span>
          </p>
        )}
        {method.providerName && (
          <p className="text-xs text-gray-400">عبر: {method.providerName}</p>
        )}
        {method.bankName && (
          <p className="text-xs text-gray-400">بنك: {method.bankName}</p>
        )}
      </div>
    </div>
  </label>
);

const SellerPaymentMethodPicker = ({ methods = [], selectedId, onChange, loading, error }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-700">طرق دفع التاجر</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-24 bg-gray-100 rounded-xl" />
          <div className="h-24 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-sm text-red-700">⚠️ {error}</p>
      </div>
    );
  }

  if (!methods || methods.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-sm text-yellow-700">
          ⚠️ التاجر لم يضف طرق دفع بعد. لا يمكن اختيار الدفع المباشر حالياً.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-700">
        اختر طريقة الدفع للتاجر
        <span className="text-xs font-normal text-gray-400 mr-2">
          (حول المبلغ على الحساب اللي تختاره)
        </span>
      </h3>

      {methods.map((method) => (
        <PaymentMethodCard
          key={method.id}
          method={method}
          isSelected={selectedId === method.id}
          onSelect={onChange}
        />
      ))}
    </div>
  );
};

export default SellerPaymentMethodPicker;
