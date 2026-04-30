import { PAYMENT_METHODS } from '../../utils/constants';

const PaymentMethodSelector = ({ selected, onChange, codFee = 0 }) => {
  return (
    <div className="space-y-3">
      {PAYMENT_METHODS.map((method) => (
        <label
          key={method.value}
          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
            selected === method.value
              ? 'border-blue-500 bg-blue-50 shadow-sm'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={method.value}
            checked={selected === method.value}
            onChange={() => onChange(method.value)}
            className="w-4 h-4 text-blue-600"
          />
          <div className="flex-1">
            <span className="font-semibold text-gray-800">{method.label}</span>
            {method.value === 'CashOnDelivery' && codFee > 0 && (
              <p className="text-xs text-orange-600 mt-1">
                ⚠️ رسوم إضافية {codFee} ج.م عند اختيار الدفع عند الاستلام
              </p>
            )}
            {method.value !== 'CashOnDelivery' && (
              <p className="text-xs text-gray-400 mt-1">
                ستظهر لك تعليمات الدفع بعد تأكيد الطلب
              </p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;