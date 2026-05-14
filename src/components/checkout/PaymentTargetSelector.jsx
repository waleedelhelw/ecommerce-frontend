import { PAYMENT_TARGET, PAYMENT_TARGET_LABELS } from '../../utils/constants';

const PaymentTargetSelector = ({ selected, onChange, sellerSelfPaymentDisabled = false }) => {
  const options = [
    {
      value: PAYMENT_TARGET.PLATFORM,
      ...PAYMENT_TARGET_LABELS.Platform,
      desc: 'تحول الفلوس لمحفظة المنصة — المنصة بتضمن حقك المالي',
      badge: '🔒 موصى به',
      disabled: false,
    },
    {
      value: PAYMENT_TARGET.SELLER,
      ...PAYMENT_TARGET_LABELS.Seller,
      desc: sellerSelfPaymentDisabled
        ? 'هذا التاجر لا يقبل الدفع المباشر'
        : 'تحول الفلوس لحساب التاجر مباشرة — بدون ضمان المنصة',
      badge: sellerSelfPaymentDisabled ? '🚫 غير متاح' : '⚠️ بدون ضمان',
      disabled: sellerSelfPaymentDisabled,
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-700 mb-2">جهة الدفع</h3>

      {options.map((opt) => (
        <label
          key={opt.value}
          className={`flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
            opt.disabled
              ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
              : selected === opt.value
              ? 'border-blue-500 bg-blue-50 shadow-sm cursor-pointer'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
          }`}
        >
          <input
            type="radio"
            name="paymentTarget"
            value={opt.value}
            checked={selected === opt.value}
            onChange={() => !opt.disabled && onChange(opt.value)}
            disabled={opt.disabled}
            className="w-4 h-4 text-blue-600 shrink-0"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{opt.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  opt.disabled
                    ? 'bg-gray-100 text-gray-500'
                    : opt.value === PAYMENT_TARGET.PLATFORM
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {opt.badge}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
          </div>
        </label>
      ))}

      {selected === PAYMENT_TARGET.SELLER && !sellerSelfPaymentDisabled && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
          <p className="text-xs text-orange-700">
            ⚠️ عند اختيار الدفع للتاجر مباشرة، أنت المسؤول عن التحويل. المنصة مش هتتقدر تتدخل
            في أي نزاع مالي بينك وبين التاجر.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentTargetSelector;