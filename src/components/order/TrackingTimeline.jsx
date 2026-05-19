import { formatDate } from '../../utils/formatDate';

const STEPS = [
  { key: 'PendingPayment', label: 'في انتظار الدفع', icon: '⏳' },
  { key: 'WaitingConfirmation', label: 'مراجعة الدفع', icon: '🧾' },
  { key: 'PaymentConfirmed', label: 'تم تأكيد الدفع', icon: '✅' },
  { key: 'Processing', label: 'قيد التجهيز', icon: '🔄' },
  { key: 'ReadyToShip', label: 'جاهز للشحن', icon: '📦' },
  { key: 'Shipped', label: 'تم الشحن', icon: '🚚' },
  { key: 'Delivered', label: 'تم التوصيل', icon: '✅' },
  { key: 'Completed', label: 'مكتمل', icon: '🎉' },
];

const FAILED_STEPS = [
  { key: 'PendingPayment', label: 'في انتظار الدفع', icon: '⏳' },
  { key: 'WaitingConfirmation', label: 'مراجعة الدفع', icon: '🧾' },
  { key: 'PaymentConfirmed', label: 'تم تأكيد الدفع', icon: '✅' },
  { key: 'Processing', label: 'قيد التجهيز', icon: '🔄' },
  { key: 'ReadyToShip', label: 'جاهز للشحن', icon: '📦' },
  { key: 'Shipped', label: 'تم الشحن', icon: '🚚' },
  { key: 'DeliveryFailed', label: 'فشل التوصيل', icon: '⚠️' },
  { key: 'ReturnedToSeller', label: 'رجع للبائع', icon: '↩️' },
];

const TrackingTimeline = ({ currentStatus, timeline = [] }) => {
  const isCancelled = currentStatus === 'Cancelled';
  const isFailedFlow = ['DeliveryFailed', 'ReturnedToSeller'].includes(currentStatus);
  const steps = isFailedFlow ? FAILED_STEPS : STEPS;
  const currentStepIndex = steps.findIndex((s) => s.key === currentStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex && !isCancelled;
          const isCurrent = step.key === currentStatus;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none min-w-0">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                    isCurrent
                      ? 'bg-purple-600 text-white shadow-lg scale-110'
                      : isActive
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step.icon}
                </div>
                <p
                  className={`text-xs mt-2 text-center whitespace-nowrap ${
                    isCurrent ? 'font-bold text-purple-600' : isActive ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                    index < currentStepIndex && !isCancelled ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {isCancelled && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="font-bold text-red-700">❌ تم إلغاء الطلب</p>
        </div>
      )}

      {currentStatus === 'DeliveryFailed' && (
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
          <p className="font-bold text-orange-700">⚠️ تعذر تسليم الشحنة</p>
          <p className="text-sm text-orange-600 mt-1">لم يتم تسليم الطلب للعميل.</p>
        </div>
      )}

      {currentStatus === 'ReturnedToSeller' && (
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-300">
          <p className="font-bold text-gray-800">↩️ تم إرجاع الشحنة إلى البائع</p>
        </div>
      )}

      {timeline.length > 0 && (
        <div className="border-r-2 border-gray-200 mr-4 space-y-4">
          {timeline.map((entry, index) => (
            <div key={entry.id || index} className="relative pr-8">
              <div className="absolute right-[-9px] top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-white" />
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-sm text-gray-800">{entry.description || entry.status}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">{formatDate(entry.createdAt)}</span>
                </div>
                {entry.note && (
                  <p className="text-xs text-gray-500 mt-1 bg-white p-2 rounded">📝 {entry.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackingTimeline;
