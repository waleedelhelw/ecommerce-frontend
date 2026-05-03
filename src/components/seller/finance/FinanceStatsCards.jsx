import { formatPrice } from '../../../utils/formatPrice';

const StatItem = ({ label, value, valueColor = 'text-gray-800' }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-b-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className={`font-semibold ${valueColor}`}>{value}</span>
  </div>
);

const FinanceStatsCards = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* إجماليات تاريخية */}
      <div className="bg-white rounded-xl border p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          📊 الإجماليات التاريخية
        </h3>
        <div className="space-y-1">
          <StatItem
            label="إجمالي المبيعات"
            value={formatPrice(summary.totalSales)}
            valueColor="text-green-600"
          />
          <StatItem
            label="إجمالي العمولات"
            value={formatPrice(summary.totalCommissions)}
            valueColor="text-orange-600"
          />
          <StatItem
            label="إجمالي الاسترجاعات"
            value={formatPrice(summary.totalRefunded)}
            valueColor="text-red-600"
          />
          <StatItem
            label="نسبة العمولة"
            value={`${summary.commissionRate}%`}
            valueColor="text-gray-700"
          />
        </div>
      </div>

      {/* إحصائيات الشهر الحالي */}
      <div className="bg-white rounded-xl border p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          📅 الشهر الحالي
        </h3>
        <div className="space-y-1">
          <StatItem
            label="أرباح الشهر"
            value={formatPrice(summary.currentMonthEarnings)}
            valueColor="text-green-600"
          />
          <StatItem
            label="مبيعات الشهر"
            value={formatPrice(summary.currentMonthSales)}
            valueColor="text-blue-600"
          />
          <StatItem
            label="عدد الطلبات"
            value={summary.currentMonthOrders}
            valueColor="text-gray-700"
          />
          <StatItem
            label="فترة الانتظار"
            value={`${summary.daysBeforeAvailable} يوم`}
            valueColor="text-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default FinanceStatsCards;