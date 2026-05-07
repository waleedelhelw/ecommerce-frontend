import { formatPrice } from '../../../utils/formatPrice';

const StatItem = ({ label, value, valueColor = 'text-gray-800', highlight = false }) => (
  <div
    className={`flex items-center justify-between py-3 border-b last:border-b-0 ${
      highlight ? 'bg-green-50 px-2 rounded-lg' : ''
    }`}
  >
    <span className="text-sm text-gray-500">{label}</span>
    <span className={`font-semibold ${valueColor}`}>{value}</span>
  </div>
);

const FinanceStatsCards = ({ summary }) => {
  if (!summary) return null;

  // ✅ حساب صافي الشهر
  const currentMonthNet = summary.currentMonthEarnings ?? 0;
  const isPositiveMonth = currentMonthNet >= 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* إجماليات تاريخية */}
      <div className="bg-white rounded-xl border p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          📊 الإجماليات التاريخية
        </h3>
        <div>
          <StatItem
            label="إجمالي المبيعات"
            value={formatPrice(summary.totalSales ?? 0)}
            valueColor="text-gray-700"
          />
          <StatItem
            label="إجمالي العمولات للمنصة"
            value={`- ${formatPrice(summary.totalCommissions ?? 0)}`}
            valueColor="text-orange-600"
          />
          <StatItem
            label="إجمالي الاسترجاعات"
            value={`- ${formatPrice(summary.totalRefunded ?? 0)}`}
            valueColor="text-red-600"
          />
          <StatItem
            label="إجمالي السحوبات"
            value={`- ${formatPrice(summary.totalWithdrawn ?? 0)}`}
            valueColor="text-purple-600"
          />
          <StatItem
            label="✅ صافي الأرباح الكلي"
            value={formatPrice(summary.totalRevenue ?? 0)}
            valueColor="text-green-600"
            highlight
          />
          <StatItem
            label="نسبة العمولة"
            value={`${summary.commissionRate ?? 0}%`}
            valueColor="text-gray-600"
          />
        </div>
      </div>

      {/* إحصائيات الشهر الحالي */}
      {/*
      <div className="bg-white rounded-xl border p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          📅 الشهر الحالي
        </h3>
        <div>
          <StatItem
            label="إجمالي المبيعات"
            value={formatPrice(summary.currentMonthSales ?? 0)}
            valueColor="text-gray-700"
          />
          <StatItem
            label="عدد الطلبات"
            value={summary.currentMonthOrders ?? 0}
            valueColor="text-blue-600"
          />

          <div className={`mt-3 p-3 rounded-lg ${
            isPositiveMonth ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className="text-xs text-gray-500 mb-1">
              صافي أرباح الشهر
              <span className="text-gray-400 mr-1">(بعد العمولات والاسترجاعات)</span>
            </p>
            <p className={`text-xl font-bold ${
              isPositiveMonth ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositiveMonth ? '+' : ''}{formatPrice(currentMonthNet)}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t">
            <StatItem
              label="فترة الانتظار"
              value={`${summary.daysBeforeAvailable ?? 3} أيام`}
              valueColor="text-gray-600"
            />
            <StatItem
              label="الحد الأدنى للسحب"
              value={formatPrice(summary.minPayoutAmount ?? 50)}
              valueColor="text-gray-600"
            />
          </div>
        </div>
      </div>
      */}
    </div>
  );
};

export default FinanceStatsCards;