import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiStar,
  FiClock,
  FiExternalLink,
} from 'react-icons/fi';
import { getSellerDashboard } from '../../api/seller/sellerDashboardService';
import { getSellerProfile } from '../../api/seller/sellerProfileService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatPrice } from '../../utils/formatPrice';
import useAuth from '../../hooks/useAuth';
import ShareStoreButton from '../../components/seller/ShareStoreButton';

const SellerDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [dashboardData, profileData] = await Promise.all([
        getSellerDashboard(),
        getSellerProfile().catch(() => null),
      ]);
      setStats(dashboardData);
      setSellerProfile(profileData);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />;

  const sellerId = sellerProfile?.userId || stats?.userId || stats?.sellerId || user?.userId;
  const storeName = sellerProfile?.storeName || stats?.storeName || user?.storeName || 'متجري';
  const storeDescription = sellerProfile?.storeDescription || stats?.storeDescription || '';
  const storeSlug = sellerProfile?.storeSlug || stats?.storeSlug || user?.storeSlug;

  const statCards = [
    {
      title: 'الرصيد المعلق',
      value: formatPrice(stats?.pendingBalance || 0),
      icon: <FiClock size={20} />,
      gradient: 'from-amber-500 to-orange-600',
      subtitle: 'سيتوفر خلال أيام',
    },
    {
      title: 'نسبة العمولة',
      value: `${stats?.commissionRate || 0}%`,
      icon: <FiDollarSign size={20} />,
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      title: 'إجمالي المنتجات',
      value: stats?.totalProducts || 0,
      subtitle: `${stats?.activeProducts || 0} نشط`,
      icon: <FiPackage size={20} />,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'إجمالي الطلبات',
      value: stats?.totalOrders || 0,
      subtitle: `${stats?.pendingOrders || 0} في الانتظار`,
      icon: <FiShoppingBag size={20} />,
      gradient: 'from-cyan-500 to-teal-600',
    },
    {
      title: 'التقييم',
      value: stats?.rating ? `${stats.rating} / 5` : 'لا يوجد',
      subtitle: `${stats?.totalRatings || 0} تقييم`,
      icon: <FiStar size={20} />,
      gradient: 'from-yellow-500 to-amber-600',
    },
  ];

  return (
    <div>
      {/* العنوان */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">نظرة عامة</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-sm text-gray-500 mt-1">مرحباً بك في لوحة تحكم متجرك</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            to={`/sellers/${storeSlug || sellerId}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium shadow-sm"
          >
            <FiExternalLink size={15} aria-hidden="true" />
            عرض المتجر
          </Link>
          <ShareStoreButton
            sellerId={sellerId}
            storeSlug={storeSlug}
            storeName={storeName}
            storeDescription={storeDescription}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 text-sm font-medium rounded-xl shadow-sm"
          />
        </div>
      </div>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow`}>
                {card.icon}
              </div>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
            </div>
            <h3 className="text-xs text-gray-400 font-medium mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{card.value}</p>
            {card.subtitle && (
              <p className="text-xs text-gray-400 mt-1.5">{card.subtitle}</p>
            )}
          </div>
        ))}
      </div>

      {/* تفاصيل الرصيد المعلق */}
      {stats?.pendingEarnings?.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
              <FiClock size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-900">تفاصيل الرصيد المعلق</h2>
              <p className="text-xs text-amber-600">أرباح قيد الانتظار حتى تأكيد التسليم</p>
            </div>
          </div>
          <div className="space-y-3">
            {stats.pendingEarnings.map((earning) => {
              const progress = Math.max(0, Math.min(100, 100 - (earning.remainingDays / 5) * 100));
              return (
                <div
                  key={earning.orderId}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between border border-amber-100/50 hover:bg-white transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-800">طلب #{earning.orderId}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      {earning.remainingDays > 0 ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          متبقي {earning.remainingDays} يوم
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          جاهز للسحب
                        </>
                      )}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-emerald-600">{formatPrice(earning.amount)}</p>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-amber-200/50 flex justify-between items-center">
            <span className="text-sm font-medium text-amber-700">إجمالي الرصيد المعلق</span>
            <span className="text-xl font-bold text-amber-900">{formatPrice(stats.pendingBalance || 0)}</span>
          </div>
        </div>
      )}

      {/* روابط سريعة */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/seller/products/new"
            className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 text-center"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
              <FiPackage size={26} className="text-white" />
            </div>
            <p className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">إضافة منتج جديد</p>
            <p className="text-xs text-gray-400 mt-1.5">انشر منتجك وابدأ البيع</p>
          </Link>

          <Link
            to="/seller/orders"
            className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300 text-center"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
              <FiShoppingBag size={26} className="text-white" />
            </div>
            <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">إدارة الطلبات</p>
            {stats?.pendingOrders > 0 ? (
              <span className="inline-flex items-center gap-1 mt-2 bg-red-50 text-red-600 text-xs px-2.5 py-1 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {stats.pendingOrders} في الانتظار
              </span>
            ) : (
              <p className="text-xs text-gray-400 mt-1.5">لا توجد طلبات معلقة</p>
            )}
          </Link>

          <Link
            to="/seller/payouts"
            className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-amber-200 hover:shadow-lg transition-all duration-300 text-center"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
              <FiDollarSign size={26} className="text-white" />
            </div>
            <p className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">سحب الأرباح</p>
            <p className="text-xs text-gray-400 mt-1.5">
              الرصيد المتاح: <span className="text-emerald-600 font-bold">{formatPrice(stats?.balance || 0)}</span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
