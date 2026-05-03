import { formatDate } from '../../utils/formatDate';
import {
  FiClock,
  FiCheckCircle,
  FiPackage,
  FiInbox,
  FiDollarSign,
  FiXCircle,
} from 'react-icons/fi';

const ReturnTimeline = ({ returnRequest }) => {
  if (!returnRequest) return null;

  // بناء الـ Timeline ديناميكياً من التواريخ
  const buildTimeline = () => {
    const timeline = [];

    // 1. تم إنشاء الطلب
    timeline.push({
      id: 'created',
      label: 'تم إنشاء طلب الإرجاع',
      description: 'العميل قدّم طلب الإرجاع',
      date: returnRequest.createdAt,
      icon: <FiClock />,
      color: 'bg-blue-500',
      completed: true,
    });

    // 2. الموافقة
    if (returnRequest.approvedAt) {
      timeline.push({
        id: 'approved',
        label: 'تمت الموافقة',
        description: 'البائع وافق على طلب الإرجاع',
        date: returnRequest.approvedAt,
        icon: <FiCheckCircle />,
        color: 'bg-green-500',
        completed: true,
      });
    }

    // 3. الشحن
    if (returnRequest.shippedAt) {
      timeline.push({
        id: 'shipped',
        label: 'العميل شحن المنتج',
        description: returnRequest.returnShippingCompany
          ? `${returnRequest.returnShippingCompany} - ${returnRequest.returnTrackingNumber}`
          : 'تم تسجيل بيانات الشحن',
        date: returnRequest.shippedAt,
        icon: <FiPackage />,
        color: 'bg-purple-500',
        completed: true,
      });
    }

    // 4. الاستلام
    if (returnRequest.receivedAt) {
      timeline.push({
        id: 'received',
        label: 'البائع استلم المنتج',
        description: 'تم تأكيد استلام المنتج المرتجع',
        date: returnRequest.receivedAt,
        icon: <FiInbox />,
        color: 'bg-indigo-500',
        completed: true,
      });
    }

    // 5. الإرجاع
    if (returnRequest.refundedAt) {
      timeline.push({
        id: 'refunded',
        label: 'تم إرجاع المبلغ',
        description: 'تم إرجاع المبلغ بنجاح',
        date: returnRequest.refundedAt,
        icon: <FiDollarSign />,
        color: 'bg-emerald-500',
        completed: true,
      });
    }

    // الرفض
    if (returnRequest.rejectedAt) {
      timeline.push({
        id: 'rejected',
        label: 'تم رفض الطلب',
        description: returnRequest.rejectionReason || 'تم رفض طلب الإرجاع',
        date: returnRequest.rejectedAt,
        icon: <FiXCircle />,
        color: 'bg-red-500',
        completed: true,
      });
    }

    // الإلغاء
    if (returnRequest.cancelledAt) {
      timeline.push({
        id: 'cancelled',
        label: 'تم إلغاء الطلب',
        description: 'العميل ألغى طلب الإرجاع',
        date: returnRequest.cancelledAt,
        icon: <FiXCircle />,
        color: 'bg-gray-500',
        completed: true,
      });
    }

    return timeline;
  };

  const timeline = buildTimeline();

  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <FiClock /> تتبع حالة الإرجاع
      </h3>

      <div className="relative">
        {/* خط التتبع */}
        <div className="absolute right-5 top-2 bottom-2 w-0.5 bg-gray-200" />

        {timeline.map((item) => (
          <div key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* النقطة */}
            <div
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full text-white flex-shrink-0 ${item.color}`}
            >
              {item.icon}
            </div>

            {/* المحتوى */}
            <div className="flex-1 pt-1.5">
              <h4 className="font-bold text-gray-900 mb-1">{item.label}</h4>
              <p className="text-sm text-gray-600 mb-1">{item.description}</p>
              <p className="text-xs text-gray-400">{formatDate(item.date)}</p>
            </div>
          </div>
        ))}

        {/* فى انتظار الخطوة الجاية */}
        {returnRequest.status === 'Approved' &&
          !returnRequest.shippedAt && (
            <div className="relative flex gap-4">
              <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex-shrink-0">
                <FiPackage />
              </div>
              <div className="flex-1 pt-1.5">
                <h4 className="font-medium text-gray-500 mb-1">
                  فى انتظار شحن المنتج
                </h4>
                <p className="text-sm text-gray-400">
                  {returnRequest.shippingDeadline
                    ? `الموعد النهائى: ${formatDate(returnRequest.shippingDeadline)}`
                    : 'يجب شحن المنتج خلال 7 أيام'}
                </p>
              </div>
            </div>
          )}

        {returnRequest.status === 'Shipped' && (
          <div className="relative flex gap-4">
            <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex-shrink-0">
              <FiInbox />
            </div>
            <div className="flex-1 pt-1.5">
              <h4 className="font-medium text-gray-500 mb-1">
                فى انتظار استلام البائع للمنتج
              </h4>
              <p className="text-sm text-gray-400">
                البائع هيستلم المنتج ويفحصه قريباً
              </p>
            </div>
          </div>
        )}

        {returnRequest.status === 'Received' && (
          <div className="relative flex gap-4">
            <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex-shrink-0">
              <FiDollarSign />
            </div>
            <div className="flex-1 pt-1.5">
              <h4 className="font-medium text-gray-500 mb-1">
                فى انتظار إرجاع المبلغ
              </h4>
              <p className="text-sm text-gray-400">
                البائع/الأدمن هيعالج الإرجاع قريباً
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnTimeline;