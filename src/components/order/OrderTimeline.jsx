import { formatDate } from '../../utils/formatDate';

// ✅ خطوات التدفق العادي (محفظة / بنك)
const ONLINE_NORMAL_STEPS = [
  { key: 'PendingPayment', label: 'في انتظار الدفع', icon: '⏳' },
  { key: 'WaitingConfirmation', label: 'مراجعة الإيصال', icon: '🧾' },
  { key: 'PaymentConfirmed', label: 'تم تأكيد الدفع', icon: '✅' },
  { key: 'Processing', label: 'قيد التجهيز', icon: '🔄' },
  { key: 'ReadyToShip', label: 'جاهز للشحن', icon: '📦' },
  { key: 'Shipped', label: 'تم الشحن', icon: '🚚' },
  { key: 'Delivered', label: 'تم التسليم', icon: '✅' },
  { key: 'Completed', label: 'مكتمل', icon: '🎉' },
];

// ✅ خطوات التدفق البديل بعد الشحن
const ONLINE_RETURNED_STEPS = [
  { key: 'PendingPayment', label: 'في انتظار الدفع', icon: '⏳' },
  { key: 'WaitingConfirmation', label: 'مراجعة الإيصال', icon: '🧾' },
  { key: 'PaymentConfirmed', label: 'تم تأكيد الدفع', icon: '✅' },
  { key: 'Processing', label: 'قيد التجهيز', icon: '🔄' },
  { key: 'ReadyToShip', label: 'جاهز للشحن', icon: '📦' },
  { key: 'Shipped', label: 'تم الشحن', icon: '🚚' },
  { key: 'DeliveryFailed', label: 'فشل التسليم', icon: '⚠️' },
  { key: 'ReturnedToSeller', label: 'رجعت للبائع', icon: '↩️' },
];

// ✅ خطوات الدفع عند الاستلام (COD) - المسار الطبيعي
const COD_NORMAL_STEPS = [
  { key: 'Processing', label: 'قيد التجهيز', icon: '🔄' },
  { key: 'ReadyToShip', label: 'جاهز للشحن', icon: '📦' },
  { key: 'Shipped', label: 'تم الشحن', icon: '🚚' },
  { key: 'Delivered', label: 'تم التسليم', icon: '✅' },
  { key: 'Completed', label: 'مكتمل', icon: '🎉' },
];

// ✅ خطوات الدفع عند الاستلام (COD) - المسار البديل
const COD_RETURNED_STEPS = [
  { key: 'Processing', label: 'قيد التجهيز', icon: '🔄' },
  { key: 'ReadyToShip', label: 'جاهز للشحن', icon: '📦' },
  { key: 'Shipped', label: 'تم الشحن', icon: '🚚' },
  { key: 'DeliveryFailed', label: 'فشل التسليم', icon: '⚠️' },
  { key: 'ReturnedToSeller', label: 'رجعت للبائع', icon: '↩️' },
];

const OrderTimeline = ({ currentStatus, timeline = [], paymentMethod }) => {
  const isCOD = paymentMethod === 'CashOnDelivery';
  const isCancelled = currentStatus === 'Cancelled';
  const isRefunded = currentStatus === 'Refunded';
  const isFailed = currentStatus === 'PaymentFailed';
  const isReturnedFlow = ['DeliveryFailed', 'ReturnedToSeller'].includes(currentStatus);

  const steps = isCOD
    ? isReturnedFlow
      ? COD_RETURNED_STEPS
      : COD_NORMAL_STEPS
    : isReturnedFlow
    ? ONLINE_RETURNED_STEPS
    : ONLINE_NORMAL_STEPS;

  const currentStepIndex = steps.findIndex((s) => s.key === currentStatus);

  if (timeline && timeline.length > 0) {
    return (
      <div className="space-y-0">
        {/* الخطوات العلوية */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const isActive = index <= currentStepIndex && !isCancelled && !isRefunded && !isFailed;
            const isCurrent = step.key === currentStatus;

            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-lg scale-110'
                        : isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p
                    className={`text-xs mt-2 text-center whitespace-nowrap ${
                      isCurrent ? 'font-bold text-blue-600' : isActive ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      index < currentStepIndex && !isCancelled && !isRefunded && !isFailed
                        ? 'bg-green-400'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* حالات خاصة */}
        {(isCancelled || isRefunded || isFailed) && (
          <div
            className={`p-4 rounded-xl mb-4 ${
              isCancelled || isFailed
                ? 'bg-red-50 border border-red-200'
                : 'bg-amber-50 border border-amber-200'
            }`}
          >
            <p className={`font-bold ${isCancelled || isFailed ? 'text-red-700' : 'text-amber-700'}`}>
              {isCancelled ? '❌ تم إلغاء الطلب' : isFailed ? '❌ فشل الدفع' : '🔄 تم استرجاع الطلب'}
            </p>
          </div>
        )}

        {currentStatus === 'DeliveryFailed' && (
          <div className="p-4 rounded-xl mb-4 bg-orange-50 border border-orange-200">
            <p className="font-bold text-orange-700">⚠️ تعذر تسليم الشحنة</p>
            <p className="text-sm text-orange-600 mt-1">
              لم يتم تسليم الطلب للعميل، ويتم الآن متابعة حالة الشحنة.
            </p>
          </div>
        )}

        {currentStatus === 'ReturnedToSeller' && (
          <div className="p-4 rounded-xl mb-4 bg-gray-50 border border-gray-300">
            <p className="font-bold text-gray-800">↩️ تم إرجاع الشحنة إلى البائع</p>
            <p className="text-sm text-gray-600 mt-1">
              الشحنة رجعت فعليًا إلى البائع بعد فشل التسليم.
            </p>
          </div>
        )}

        {/* Timeline المفصل */}
        <div className="border-r-2 border-gray-200 mr-4 space-y-4">
          {timeline.map((entry, index) => (
            <div key={entry.id || index} className="relative pr-8">
              <div className="absolute right-[-9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-sm text-gray-800">{entry.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">{formatDate(entry.createdAt)}</span>
                  {entry.updatedByRole && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      {entry.updatedByRole === 'System'
                        ? '🤖 النظام'
                        : entry.updatedByRole === 'Admin'
                        ? '👨‍💼 الإدارة'
                        : entry.updatedByRole === 'Seller'
                        ? '🏪 البائع'
                        : entry.updatedByRole === 'Customer'
                        ? '👤 العميل'
                        : entry.updatedByRole}
                    </span>
                  )}
                </div>
                {entry.note && (
                  <p className="text-xs text-gray-500 mt-1 bg-white p-2 rounded">📝 {entry.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const isActive = index <= currentStepIndex && !isCancelled && !isRefunded && !isFailed;
        const isCurrent = step.key === currentStatus;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-lg scale-110'
                    : isActive
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step.icon}
              </div>
              <p
                className={`text-xs mt-2 text-center whitespace-nowrap ${
                  isCurrent ? 'font-bold text-blue-600' : isActive ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${
                  index < currentStepIndex && !isCancelled && !isRefunded && !isFailed
                    ? 'bg-green-400'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;