import {
  FiDollarSign,
  FiClock,
  FiTrendingUp,
  FiCheckCircle,
} from 'react-icons/fi';
import { formatPrice } from '../../../utils/formatPrice';

const Card = ({ title, value, icon, gradient, textColor }) => (
  <div className={`${gradient} rounded-xl p-5 text-white shadow-sm`}>
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-lg bg-white/20`}>{icon}</div>
    </div>
    <p className="text-white/80 text-sm mb-1">{title}</p>
    <p className={`text-2xl font-bold ${textColor || 'text-white'}`}>
      {formatPrice(value || 0)}
    </p>
  </div>
);

const FinanceSummaryCards = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <Card
        title="الرصيد المتاح للسحب"
        value={summary?.availableBalance}
        icon={<FiDollarSign size={20} />}
        gradient="bg-gradient-to-l from-green-500 to-green-600"
      />
      <Card
        title="الرصيد المعلق"
        value={summary?.pendingBalance}
        icon={<FiClock size={20} />}
        gradient="bg-gradient-to-l from-yellow-500 to-orange-500"
      />
      <Card
        title="إجمالي الأرباح"
        value={summary?.totalRevenue}
        icon={<FiTrendingUp size={20} />}
        gradient="bg-gradient-to-l from-blue-500 to-blue-600"
      />
      <Card
        title="إجمالي المسحوب"
        value={summary?.totalWithdrawn}
        icon={<FiCheckCircle size={20} />}
        gradient="bg-gradient-to-l from-purple-500 to-purple-600"
      />
    </div>
  );
};

export default FinanceSummaryCards;