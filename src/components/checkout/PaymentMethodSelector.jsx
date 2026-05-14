import { PAYMENT_METHODS } from '../../utils/constants';
import PaymentTargetSelector from './PaymentTargetSelector';
import SellerPaymentMethodPicker from './SellerPaymentMethodPicker';

const PLATFORM_METHODS = PAYMENT_METHODS.filter((m) => m.value !== 'CashOnDelivery');

const PaymentMethodSelector = ({
  paymentType,
  onPaymentTypeChange,
  selectedMethod,
  onMethodChange,
  paymentTarget,
  onTargetChange,
  codFee = 0,
  sellerPaymentMethods,
  selectedSellerMethodId,
  onSellerMethodChange,
  loadingSellerMethods,
  sellerMethodsError,
}) => {
  const isCOD = paymentType === 'CashOnDelivery';
  const isElectronic = paymentType === 'Electronic';

  return (
    <div className="space-y-4">
      {/* ── المستوى الأول: COD أو إلكتروني ── */}

      <label
        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
          isCOD ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <input
          type="radio"
          name="paymentType"
          value="CashOnDelivery"
          checked={isCOD}
          onChange={() => onPaymentTypeChange('CashOnDelivery')}
          className="w-4 h-4 text-blue-600 shrink-0"
        />
        <div className="flex-1">
          <span className="font-semibold text-gray-800">💵 الدفع عند الاستلام</span>
          {codFee > 0 && (
            <p className="text-xs text-orange-600 mt-1">
              ⚠️ رسوم إضافية {codFee} ج.م عند اختيار الدفع عند الاستلام
            </p>
          )}
        </div>
      </label>

      <label
        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
          isElectronic ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <input
          type="radio"
          name="paymentType"
          value="Electronic"
          checked={isElectronic}
          onChange={() => onPaymentTypeChange('Electronic')}
          className="w-4 h-4 text-blue-600 shrink-0"
        />
        <div className="flex-1">
          <span className="font-semibold text-gray-800">💳 دفع إلكتروني</span>
          <p className="text-xs text-gray-400 mt-1">فيزا، محافظ إلكترونية، تحويل بنكي</p>
        </div>
        <span className="shrink-0 text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">
          🔒 آمن
        </span>
      </label>

      {/* ── تحذير COD ── */}
      {isCOD && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-xl shrink-0">⚠️</span>
          <div className="space-y-2">
            <p className="font-bold text-amber-800 text-sm">تنبيه مهم — الدفع عند الاستلام</p>
            <ul className="text-xs text-amber-700 space-y-1.5">
              <li className="flex items-start gap-1.5">
                <span className="shrink-0 mt-0.5 text-amber-500">•</span>
                <span>تعاملك المالي سيكون مباشرةً مع التاجر وليس عبر المنصة</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="shrink-0 mt-0.5 text-amber-500">•</span>
                <span>المنصة لن تتمكن من التدخل في أي نزاع مالي ينشأ عن هذه الطريقة</span>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => onPaymentTypeChange('Electronic')}
              className="mt-1 text-xs font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-900 transition-colors"
            >
              🔒 التبديل لوسيلة دفع إلكترونية
            </button>
          </div>
        </div>
      )}

      {/* ── المستوى الثاني: اختيار جهة الدفع (للمدفوعات الإلكترونية) ── */}
      {isElectronic && (
        <div className="border-t pt-4">
          <PaymentTargetSelector
            selected={paymentTarget}
            onChange={onTargetChange}
            paymentMethod="Electronic"
          />
        </div>
      )}

      {/* ── المستوى الثالث: اختيار طريقة الدفع ── */}
      {isElectronic && paymentTarget === 'Platform' && (
        <div className="border-t pt-4 space-y-3">
          <h3 className="text-sm font-bold text-gray-700">طريقة الدفع عبر المنصة</h3>
          {PLATFORM_METHODS.map((method) => (
            <label
              key={method.value}
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedMethod === method.value
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="platformPaymentMethod"
                value={method.value}
                checked={selectedMethod === method.value}
                onChange={() => onMethodChange(method.value)}
                className="w-4 h-4 text-blue-600 shrink-0"
              />
              <div className="flex-1">
                <span className="font-semibold text-gray-800">{method.label}</span>
                <p className="text-xs text-gray-400 mt-1">
                  ستظهر لك تعليمات الدفع بعد تأكيد الطلب
                </p>
              </div>
            </label>
          ))}
        </div>
      )}

      {isElectronic && paymentTarget === 'Seller' && (
        <div className="border-t pt-4">
          <SellerPaymentMethodPicker
            methods={sellerPaymentMethods}
            selectedId={selectedSellerMethodId}
            onChange={onSellerMethodChange}
            loading={loadingSellerMethods}
            error={sellerMethodsError}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
