import {
  FiDollarSign,
  FiClock,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiShieldOff,
} from 'react-icons/fi';
import { formatPrice } from '../../../utils/formatPrice';

const Card = ({ title, value, subtitle, icon, gradient }) => (
  <div className={`${gradient} rounded-xl p-5 text-white shadow-sm`}>
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 rounded-lg bg-white/20">{icon}</div>
    </div>
    <p className="text-white/80 text-sm mb-1">{title}</p>
    <p className="text-2xl font-bold text-white">
      {formatPrice(value ?? 0)}
    </p>
    {subtitle && (
      <p className="text-white/60 text-xs mt-1">{subtitle}</p>
    )}
  </div>
);

const FinanceSummaryCards = ({ summary }) => {
  if (!summary) return null;

  return (
    <div>
      {summary.isSelfPaymentDisabledByAdmin && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
          <FiShieldOff size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-800 text-sm">الدفع المباشر معطل</p>
            <p className="text-xs text-red-700 mt-1">
              قامت الإدارة بتعطيل خيار الدفع المباشر (Self Payment) لمتجرك. العملاء لن يتمكنوا من الدفع مباشرة لحسابك البنكي/المحفظة، وجميع المدفوعات ستكون عبر المنصة.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        {/* ✅ الرصيد المتاح */}
        <Card
          title="الرصيد المتاح للسحب"
          value={summary.availableBalance}
          subtitle={
            summary.canRequestPayout
              ? '✅ يمكنك السحب الآن'
              : summary.hasPendingPayout
              ? '⏳ يوجد طلب سحب معلق'
              : `الحد الأدنى ${formatPrice(summary.minPayoutAmount)}`
          }
          icon={<FiDollarSign size={20} />}
          gradient="bg-gradient-to-l from-green-500 to-green-600"
        />

        {/* ✅ الرصيد المعلق */}
        <Card
          title="الرصيد المعلق"
          value={summary.pendingBalance}
          subtitle={`يتاح بعد ${summary.daysBeforeAvailable} أيام من التسليم`}
          icon={<FiClock size={20} />}
          gradient="bg-gradient-to-l from-yellow-500 to-orange-500"
        />

        {/* ✅ إجمالي الأرباح */}
        <Card
          title="إجمالي الأرباح"
          value={summary.totalRevenue}
          subtitle="صافي بعد العمولات والاسترجاعات"
          icon={<FiTrendingUp size={20} />}
          gradient="bg-gradient-to-l from-blue-500 to-blue-600"
        />

        {/* ✅ إجمالي المسحوب */}
        <Card
          title="إجمالي المسحوب"
          value={summary.totalWithdrawn}
          subtitle="إجمالي السحوبات المكتملة"
          icon={<FiCheckCircle size={20} />}
          gradient="bg-gradient-to-l from-purple-500 to-purple-600"
        />

        {/* ✅ المدفوعات الذاتية المعلقة */}
        <Card
          title="المدفوعات الذاتية المعلقة"
          value={summary.pendingSelfPayments ?? 0}
          subtitle="بانتظار التأكيد من الإدارة"
          icon={<FiAlertCircle size={20} />}
          gradient="bg-gradient-to-l from-rose-500 to-pink-600"
        />
      </div> {/* ✅ إقفال الـ grid div */}
    </div>
  );
};

export default FinanceSummaryCards;