import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { formatPrice } from '../../../utils/formatPrice';

const EarningsChart = ({ data, year }) => {
  // ✅ استخراج الـ months من شكل الـ response
  let monthsArray = [];
  let totals = null;

  if (Array.isArray(data)) {
    monthsArray = data;
  } else if (data && typeof data === 'object') {
    monthsArray = data.months || data.data || data.items || [];
    totals = {
      totalSales: data.totalSales || 0,
      totalEarnings: data.totalEarnings || 0,
      totalCommissions: data.totalCommissions || 0,
      totalRefunds: data.totalRefunds || 0,
      totalOrders: data.totalOrders || 0,
    };
  }

  // تجهيز بيانات الـ Chart
  const chartData = (Array.isArray(monthsArray) ? monthsArray : []).map(
    (item) => ({
      month: item.monthName || `شهر ${item.month}`,
      sales: item.sales || 0,
      earnings: item.earnings || 0,
      commissions: item.commissions || 0,
      refunds: item.refunds || 0,
    })
  );

  // هل فيه بيانات فعلية ولا كل القيم 0؟
  const hasRealData = chartData.some(
    (m) => m.sales > 0 || m.earnings > 0 || m.commissions > 0 || m.refunds > 0
  );

  return (
    <div className="bg-white rounded-xl border p-5 mb-6">
      {/* العنوان */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">
          📈 الأرباح الشهرية {year ? `(${year})` : ''}
        </h3>
      </div>

      {/* ملخص الإجماليات */}
      {totals && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">إجمالي المبيعات</p>
            <p className="text-sm font-bold text-blue-600">
              {formatPrice(totals.totalSales)}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">صافي الأرباح</p>
            <p className="text-sm font-bold text-green-600">
              {formatPrice(totals.totalEarnings)}
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">العمولات</p>
            <p className="text-sm font-bold text-orange-600">
              {formatPrice(totals.totalCommissions)}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">الاسترجاعات</p>
            <p className="text-sm font-bold text-red-600">
              {formatPrice(totals.totalRefunds)}
            </p>
          </div>
        </div>
      )}

      {/* الرسم البياني */}
      {chartData.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-gray-400">
          لا توجد بيانات لعرضها
        </div>
      ) : !hasRealData ? (
        <div className="h-72 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
          <span className="text-4xl mb-2">📊</span>
          <p className="text-sm">لا توجد مبيعات في هذه السنة بعد</p>
          <p className="text-xs mt-1 text-gray-300">
            ستظهر الأرباح هنا بمجرد إتمام أول عملية بيع
          </p>
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value) => formatPrice(value)}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '13px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '13px' }} />
              <Bar
                dataKey="sales"
                name="المبيعات"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="earnings"
                name="الأرباح الصافية"
                fill="#16a34a"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="commissions"
                name="العمولات"
                fill="#f97316"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default EarningsChart;