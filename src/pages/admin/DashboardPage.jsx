import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../../components/admin/StatsCard';
import SalesChart from '../../components/admin/SalesChart';
import RecentOrdersTable from '../../components/admin/RecentOrdersTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getDashboardStats, getSalesReport, getTopSelling, getTopRated } from '../../api/admin/adminDashboardService';
import { getAllOrders } from '../../api/admin/adminOrderService';

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [salesReport, setSalesReport] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ حساب تاريخ آخر 30 يوم للـ sales report
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const [dashData, salesData, topSellingData, topRatedData, ordersData] = await Promise.allSettled([
        getDashboardStats(),
        getSalesReport({ startDate, endDate }),
        getTopSelling(),
        getTopRated(),
        getAllOrders({ pageNumber: 1, pageSize: 5 }),
      ]);

      if (dashData.status === 'fulfilled') setDashboard(dashData.value);

      // ✅ Fix: استخرج dailySales من الـ response
      if (salesData.status === 'fulfilled') {
        const sales = salesData.value;
        if (sales?.dailySales && Array.isArray(sales.dailySales)) {
          setSalesReport(sales.dailySales);
        } else if (Array.isArray(sales)) {
          setSalesReport(sales);
        } else {
          setSalesReport([]);
        }
      }

      if (topSellingData.status === 'fulfilled') {
        const top = topSellingData.value;
        setTopSelling(Array.isArray(top) ? top : top?.items || top?.data || []);
      }

      if (topRatedData.status === 'fulfilled') {
        const rated = topRatedData.value;
        setTopRated(Array.isArray(rated) ? rated : rated?.items || rated?.data || []);
      }

      // ✅ Fix: جلب آخر الطلبات
      if (ordersData.status === 'fulfilled') {
        const orders = ordersData.value;
        if (Array.isArray(orders)) {
          setRecentOrders(orders.slice(0, 5));
        } else if (orders?.items) {
          setRecentOrders(orders.items.slice(0, 5));
        } else if (orders?.data) {
          setRecentOrders(Array.isArray(orders.data) ? orders.data.slice(0, 5) : []);
        } else {
          setRecentOrders([]);
        }
      }
    } catch (err) {
      setError('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📊 لوحة التحكم</h1>

      {/* Stats Cards - الصف الأول */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatsCard icon="🏪" label="البائعين" value={dashboard?.totalSellers || 0} color="green" />
        <StatsCard icon="📦" label="المنتجات" value={dashboard?.totalProducts || 0} color="blue" />
        <StatsCard icon="📋" label="الطلبات" value={dashboard?.totalOrders || 0} color="orange" />
        <StatsCard icon="👥" label="العملاء" value={dashboard?.totalCustomers || 0} color="purple" />
      </div>

      {/* Stats Cards - الصف الثاني */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon="💰"
          label="إجمالي المبيعات"
          value={`${(dashboard?.totalSales || 0).toLocaleString()} ج.م`}
          color="yellow"
        />
        <StatsCard
          icon="💵"
          label="إجمالي العمولات"
          value={`${(dashboard?.totalCommission || 0).toLocaleString()} ج.م`}
          color="green"
        />
        <StatsCard
          icon="⏳"
          label="بائعين معلقين"
          value={dashboard?.pendingSellers || 0}
          color="red"
        />
        <StatsCard
          icon="💳"
          label="سحوبات معلقة"
          value={dashboard?.pendingPayouts || 0}
          color="orange"
        />
      </div>

      {/* تنبيهات سريعة */}
      {((dashboard?.pendingSellers || 0) > 0 || (dashboard?.pendingPayouts || 0) > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
          <h3 className="font-bold text-yellow-800 mb-2">⚠️ يتطلب انتباهك</h3>
          <div className="flex flex-wrap gap-4">
            {(dashboard?.pendingSellers || 0) > 0 && (
              <Link to="/admin/sellers?status=Pending" className="text-sm text-yellow-700 hover:underline">
                🏪 {dashboard.pendingSellers} بائع في انتظار الموافقة
              </Link>
            )}
            {(dashboard?.pendingPayouts || 0) > 0 && (
              <Link to="/admin/payouts" className="text-sm text-yellow-700 hover:underline">
                💳 {dashboard.pendingPayouts} طلب سحب في الانتظار
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Sales Chart */}
      <div className="mb-8">
        <SalesChart data={salesReport} />
      </div>

      {/* Top Selling & Top Rated */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-bold mb-4">🏆 الأكثر مبيعاً</h3>
          {topSelling.length > 0 ? (
            <div className="space-y-3">
              {topSelling.slice(0, 5).map((product, index) => (
                <div key={product.id || index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">{index + 1}</span>
                    <span className="font-medium text-sm">{product.name || product.productName}</span>
                  </div>
                  <span className="text-sm text-gray-500">{product.totalSold || product.salesCount} مبيعة</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">لا توجد بيانات</p>
          )}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-bold mb-4">⭐ الأعلى تقييماً</h3>
          {topRated.length > 0 ? (
            <div className="space-y-3">
              {topRated.slice(0, 5).map((product, index) => (
                <div key={product.id || index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">{index + 1}</span>
                    <span className="font-medium text-sm">{product.name || product.productName}</span>
                  </div>
                  <span className="text-sm text-yellow-600">⭐ {product.averageRating || product.rating}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">لا توجد بيانات</p>
          )}
        </div>
      </div>

      {/* ✅ Fix: Recent Orders */}
      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
};

export default DashboardPage;