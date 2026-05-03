import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { getEarningsBreakdown } from '../../../api/seller/sellerFinanceService';
import { formatPrice } from '../../../utils/formatPrice';

// ألوان الـ Pie
const COLORS = {
  sales: '#16a34a',       // أخضر - مبيعات
  commissions: '#f97316', // برتقالي - عمولات
  refunds: '#ef4444',     // أحمر - استرجاعات
  payouts: '#3b82f6',     // أزرق - سحوبات
};

// خيارات الفترات السريعة
const periodOptions = [
  { label: 'آخر 7 أيام', days: 7 },
  { label: 'آخر 30 يوم', days: 30 },
  { label: 'آخر 90 يوم', days: 90 },
  { label: 'هذه السنة', type: 'year' },
  { label: 'كل الفترة', type: 'all' },
];

const EarningsBreakdownChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[1]); // افتراضي: آخر 30 يوم

  // ============ حساب الفترة ============
  const calculateDateRange = (period) => {
    const today = new Date();
    let fromDate = null;
    let toDate = null;

    if (period.type === 'all') {
      return { fromDate: null, toDate: null };
    }

    if (period.type === 'year') {
      fromDate = new Date(today.getFullYear(), 0, 1);
      toDate = today;
    } else if (period.days) {
      fromDate = new Date();
      fromDate.setDate(today.getDate() - period.days);
      toDate = today;
    }

    return {
      fromDate: fromDate ? fromDate.toISOString().split('T')[0] : null,
      toDate: toDate ? toDate.toISOString().split('T')[0] : null,
    };
  };

  // ============ تحميل البيانات ============
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { fromDate, toDate } = calculateDateRange(selectedPeriod);
        const result = await getEarningsBreakdown(fromDate, toDate);
        setData(result);
      } catch (err) {
        setError(err.response?.data?.message || 'حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedPeriod]);

  // ============ تحويل البيانات لشكل Pie ============
  const buildChartData = () => {
    if (!data) return [];

    const items = [
      {
        name: 'المبيعات',
        value: data.totalSales || 0,
        color: COLORS.sales,
        count: data.salesCount || 0,
      },
      {
        name: 'العمولات',
        value: Math.abs(data.totalCommissions || 0),
        color: COLORS.commissions,
        count: null,
      },
      {
        name: 'الاسترجاعات',
        value: Math.abs(data.totalRefunds || 0),
        color: COLORS.refunds,
        count: data.refundsCount || 0,
      },
      {
        name: 'السحوبات',
        value: Math.abs(data.totalPayouts || 0),
        color: COLORS.payouts,
        count: data.payoutsCount || 0,
      },
    ];

    // فلترة العناصر بقيمة 0
    return items.filter((item) => item.value > 0);
  };

  const chartData = buildChartData();
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const hasData = chartData.length > 0;

  // ============ Custom Tooltip ============
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white border rounded-lg shadow-lg p-3 text-xs">
          <p className="font-semibold text-gray-800 mb-1">{item.name}</p>
          <p className="text-gray-600">المبلغ: {formatPrice(item.value)}</p>
          <p className="text-gray-600">النسبة: {percentage}%</p>
          {item.count !== null && (
            <p className="text-gray-600">العدد: {item.count}</p>
          )}
        </div>
      );
    }
    return null;
  };

  // ============ Custom Label داخل الـ Pie ============
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl border p-5 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            🥧 توزيع الأرباح
          </h3>
          {data && (
            <p className="text-xs text-gray-400 mt-1">
              {selectedPeriod.label}
            </p>
          )}
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-400" size={16} />
          <select
            value={periodOptions.findIndex((p) => p.label === selectedPeriod.label)}
            onChange={(e) => setSelectedPeriod(periodOptions[e.target.value])}
            className="px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
          >
            {periodOptions.map((option, idx) => (
              <option key={idx} value={idx}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* صافي الأرباح + الإحصائيات */}
      {data && !loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <div className="bg-gradient-to-l from-green-500 to-green-600 rounded-lg p-3 text-white">
            <p className="text-xs text-green-100 mb-1">صافي الأرباح</p>
            <p className="text-base font-bold flex items-center gap-1">
              <FiTrendingUp size={14} />
              {formatPrice(data.netEarnings || 0)}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">عدد المبيعات</p>
            <p className="text-base font-bold text-blue-600">
              {data.salesCount || 0}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">عدد الاسترجاعات</p>
            <p className="text-base font-bold text-red-600">
              {data.refundsCount || 0}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">عدد السحوبات</p>
            <p className="text-base font-bold text-purple-600">
              {data.payoutsCount || 0}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="h-72 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : error ? (
        <div className="h-72 flex items-center justify-center text-red-500 text-sm">
          {error}
        </div>
      ) : !hasData ? (
        <div className="h-72 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
          <span className="text-4xl mb-2">📊</span>
          <p className="text-sm">لا توجد بيانات في هذه الفترة</p>
          <p className="text-xs mt-1 text-gray-300">
            جرب فترة زمنية أكبر أو ابدأ البيع
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pie Chart */}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend مع التفاصيل */}
          <div className="flex flex-col justify-center space-y-2">
            {chartData.map((item, idx) => {
              const percentage =
                totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : 0;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {item.name}
                      </p>
                      {item.count !== null && (
                        <p className="text-xs text-gray-400">
                          {item.count} عملية
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-800">
                      {formatPrice(item.value)}
                    </p>
                    <p className="text-xs text-gray-500">{percentage}%</p>
                  </div>
                </div>
              );
            })}

            {/* الإجمالي */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-l from-green-50 to-green-100 rounded-lg border border-green-200">
              <span className="text-sm font-semibold text-green-700">
                إجمالي الحركات
              </span>
              <span className="text-base font-bold text-green-700">
                {formatPrice(totalValue)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsBreakdownChart;