import { PAYMENT_METHODS } from '../../utils/constants';

const PaymentMethodSelector = ({ selected, onChange, codFee = 0 }) => {
  const isCOD = selected === 'CashOnDelivery';

  return (
    <div className="space-y-3">

      {/* ── خيارات الدفع ── */}
      {PAYMENT_METHODS.map((method) => (
        <label
          key={method.value}
          className={`flex items-center gap-4 p-4 border-2 rounded-xl
                      cursor-pointer transition-all
                      ${selected === method.value
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
            className="w-4 h-4 text-blue-600 shrink-0"
          />
          <div className="flex-1">
            <span className="font-semibold text-gray-800">{method.label}</span>

            {/* رسوم الدفع عند الاستلام */}
            {method.value === 'CashOnDelivery' && codFee > 0 && (
              <p className="text-xs text-orange-600 mt-1">
                ⚠️ رسوم إضافية {codFee} ج.م عند اختيار الدفع عند الاستلام
              </p>
            )}

            {/* تعليمات الدفع الإلكتروني */}
            {method.value !== 'CashOnDelivery' && (
              <p className="text-xs text-gray-400 mt-1">
                ستظهر لك تعليمات الدفع بعد تأكيد الطلب
              </p>
            )}
          </div>

          {/* شارة "الأكثر أماناً" على الدفع الإلكتروني */}
          {method.value !== 'CashOnDelivery' && (
            <span className="shrink-0 text-xs bg-green-100 text-green-700
                             font-semibold px-2 py-1 rounded-full">
              🔒 آمن
            </span>
          )}
        </label>
      ))}

      {/* ── تحذير الدفع عند الاستلام ── */}
      {isCOD && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4
                        flex items-start gap-3">
          <span className="text-xl shrink-0">⚠️</span>
          <div className="space-y-2">
            <p className="font-bold text-amber-800 text-sm">
              تنبيه مهم — الدفع عند الاستلام
            </p>
            <ul className="text-xs text-amber-700 space-y-1.5">
              <li className="flex items-start gap-1.5">
                <span className="shrink-0 mt-0.5 text-amber-500">•</span>
                <span>
                  عند اختيار الدفع عند الاستلام، تعاملك المالي سيكون
                  <strong> مباشرةً مع التاجر </strong>
                  وليس عبر المنصة
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="shrink-0 mt-0.5 text-amber-500">•</span>
                <span>
                  المنصة <strong>لن تتمكن من التدخل</strong> في أي نزاع مالي
                  ينشأ عن هذه الطريقة
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="shrink-0 mt-0.5 text-amber-500">•</span>
                <span>
                  ننصحك باختيار <strong>وسيلة دفع إلكترونية</strong> للحصول
                  على الحماية المالية الكاملة من المنصة
                </span>
              </li>
            </ul>

            {/* زرار تغيير طريقة الدفع */}
            <button
              type="button"
              onClick={() => {
                const firstElectronic = PAYMENT_METHODS.find(
                  (m) => m.value !== 'CashOnDelivery'
                );
                if (firstElectronic) onChange(firstElectronic.value);
              }}
              className="mt-1 text-xs font-semibold text-amber-800
                         underline underline-offset-2 hover:text-amber-900
                         transition-colors"
            >
              🔒 التبديل لوسيلة دفع إلكترونية
            </button>
          </div>
        </div>
      )}

      {/* ── رسالة الطمأنينة للدفع الإلكتروني ── */}
      {!isCOD && selected && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4
                        flex items-start gap-3">
          <span className="text-lg shrink-0">🔒</span>
          <div>
            <p className="font-bold text-green-800 text-sm">دفع آمن عبر المنصة</p>
            <p className="text-xs text-green-700 mt-1">
              دفعتك محمية بالكامل — في حالة أي مشكلة في الطلب،
              المنصة ستتدخل وتضمن حقك المالي
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentMethodSelector;