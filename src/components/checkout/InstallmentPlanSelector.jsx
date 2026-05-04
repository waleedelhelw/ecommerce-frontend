import { useState, useEffect } from 'react';
import { getAvailablePlans } from '../../api/installmentService';
import { formatPrice } from '../../utils/formatPrice';
import LoadingSpinner from '../common/LoadingSpinner';

const InstallmentPlanSelector = ({ selected, onChange, orderTotal = 0 }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getAvailablePlans();
      setPlans(data || []);
    } catch (err) {
      setError('فشل في تحميل خطط التقسيط');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSplitAmount = (percentage, total, extraFee) => {
    const totalWithFee = total + (total * (extraFee || 0)) / 100;
    return (totalWithFee * percentage) / 100;
  };

  const calculateTotalWithFee = (extraFee) => {
    return orderTotal + (orderTotal * (extraFee || 0)) / 100;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (plans.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* خيار الدفع الكامل */}
      <label
        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
          !selected
            ? 'border-blue-500 bg-blue-50 shadow-sm'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <input
          type="radio"
          name="installmentPlan"
          value=""
          checked={!selected}
          onChange={() => onChange(null)}
          className="w-4 h-4 text-blue-600"
        />
        <div className="flex-1">
          <span className="font-semibold text-gray-800">💰 دفع المبلغ كامل</span>
          <p className="text-sm text-gray-500 mt-1">
            {formatPrice(orderTotal)}
          </p>
        </div>
      </label>

      {/* خطط التقسيط */}
      {plans.map((plan) => {
        const totalWithFee = calculateTotalWithFee(plan.extraFeePercentage);
        const hasExtraFee = plan.extraFeePercentage > 0;
        const isExpanded = expandedPlan === plan.id;

        return (
          <div key={plan.id}>
            <label
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selected === plan.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="installmentPlan"
                value={plan.id}
                checked={selected === plan.id}
                onChange={() => onChange(plan.id)}
                className="w-4 h-4 text-blue-600"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">
                    📋 {plan.name}
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {plan.numberOfInstallments} دفعات
                  </span>
                </div>

                {plan.description && (
                  <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                )}

                {hasExtraFee && (
                  <p className="text-xs text-orange-600 mt-1">
                    ⚠️ رسوم تقسيط {plan.extraFeePercentage}% — الإجمالي: {formatPrice(totalWithFee)}
                  </p>
                )}

                {/* زر عرض التفاصيل */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setExpandedPlan(isExpanded ? null : plan.id);
                  }}
                  className="text-xs text-blue-500 hover:text-blue-700 mt-2 underline"
                >
                  {isExpanded ? 'إخفاء التفاصيل ▲' : 'عرض التفاصيل ▼'}
                </button>
              </div>
            </label>

            {/* تفاصيل الدفعات */}
            {isExpanded && plan.splits && plan.splits.length > 0 && (
              <div className="mr-12 mt-2 mb-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="text-right pb-2 font-medium">الدفعة</th>
                      <th className="text-right pb-2 font-medium">النسبة</th>
                      <th className="text-right pb-2 font-medium">المبلغ</th>
                      <th className="text-right pb-2 font-medium">موعد الاستحقاق</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.splits
                      .sort((a, b) => a.splitOrder - b.splitOrder)
                      .map((split) => (
                        <tr key={split.id || split.splitOrder} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 font-medium">
                            {split.splitOrder === 1 ? '🔵' : split.splitOrder === 2 ? '🟡' : '🟢'} الدفعة {split.splitOrder}
                          </td>
                          <td className="py-2">{split.percentage}%</td>
                          <td className="py-2 font-bold text-blue-600">
                            {formatPrice(calculateSplitAmount(split.percentage, orderTotal, plan.extraFeePercentage))}
                          </td>
                          <td className="py-2 text-gray-500 text-xs">
                            {getDueTriggerLabel(split.dueTrigger, split.dueDaysAfterDelivery)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Helper: عرض موعد الاستحقاق
const getDueTriggerLabel = (trigger, days) => {
  switch (trigger) {
    case 'BeforeShipping':
      return '📦 قبل الشحن';
    case 'OnDelivery':
      return '🚚 عند الاستلام';
    case 'DaysAfterDelivery':
      return `⏰ بعد ${days} يوم من الاستلام`;
    default:
      return trigger;
  }
};

export default InstallmentPlanSelector;