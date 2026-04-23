import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiStar,
  FiTrendingUp,
  FiClock,
} from 'react-icons/fi';
import { getSellerDashboard } from '../../api/seller/sellerDashboardService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatPrice } from '../../utils/formatPrice';

const SellerDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await getSellerDashboard();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />;

  const statCards = [
    {
      title: 'إجمالي المبيعات',
      value: formatPrice(stats?.totalSales || 0),
      icon: <FiTrendingUp size={24} />,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
    },
    {
      title: 'إجمالي الإيرادات',
      value: formatPrice(stats?.totalRevenue || 0),
      icon: <FiDollarSign size={24} />,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
    },
    {
      title: 'الرصيد المتاح',
      value: formatPrice(stats?.balance || 0),
      icon: <FiDollarSign size={24} />,
      color: 'bg-yellow-500',
      bgLight: 'bg-yellow-50',
    },
    {
      title: 'نسبة العمولة',
      value: `${stats?.commissionRate || 0}%`,
      icon: <FiDollarSign size={24} />,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
    },
    {
      title: 'إجمالي المنتجات',
      value: stats?.totalProducts || 0,
      subtitle: `${stats?.activeProducts || 0} نشط`,
      icon: <FiPackage size={24} />,
      color: 'bg-indigo-500',
      bgLight: 'bg-indigo-50',
    },
    {
      title: 'إجمالي الطلبات',
      value: stats?.totalOrders || 0,
      subtitle: `${stats?.pendingOrders || 0} في الانتظار`,
      icon: <FiShoppingBag size={24} />,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
    },
    {
      title: 'الطلبات المسلّمة',
      value: stats?.deliveredOrders || 0,
      icon: <FiShoppingBag size={24} />,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
    },
    {
      title: 'التقييم',
      value: stats?.rating ? `${stats.rating} / 5` : 'لا يوجد',
      subtitle: `${stats?.totalRatings || 0} تقييم`,
      icon: <FiStar size={24} />,
      color: 'bg-yellow-500',
      bgLight: 'bg-yellow-50',
    },
  ];

  return (
    <div>
      {/* العنوان */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">مرحباً بك في لوحة تحكم متجرك</p>
      </div>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgLight} rounded-xl p-5 border`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${card.color} text-white p-2.5 rounded-lg`}>
                {card.icon}
              </div>
            </div>
            <h3 className="text-sm text-gray-500 mb-1">{card.title}</h3>
            <p className="text-xl font-bold text-gray-800">{card.value}</p>
            {card.subtitle && (
              <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
            )}
          </div>
        ))}
      </div>

      {/* روابط سريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/seller/products/new"
          className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow text-center"
        >
          <FiPackage size={28} className="mx-auto mb-2 text-green-500" />
          <p className="font-medium text-gray-700">إضافة منتج جديد</p>
        </Link>

        <Link
          to="/seller/orders"
          className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow text-center"
        >
          <FiShoppingBag size={28} className="mx-auto mb-2 text-blue-500" />
          <p className="font-medium text-gray-700">إدارة الطلبات</p>
          {stats?.pendingOrders > 0 && (
            <span className="inline-block mt-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
              {stats.pendingOrders} في الانتظار
            </span>
          )}
        </Link>

        <Link
          to="/seller/payouts"
          className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow text-center"
        >
          <FiDollarSign size={28} className="mx-auto mb-2 text-yellow-500" />
          <p className="font-medium text-gray-700">سحب الأرباح</p>
          <span className="inline-block mt-2 text-sm text-green-600 font-medium">
            {formatPrice(stats?.balance || 0)}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SellerDashboardPage;