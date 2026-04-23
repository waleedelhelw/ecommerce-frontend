import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import OrderCard from '../../components/order/OrderCard';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import orderService from '../../api/orderService';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrders({
        pageNumber: currentPage,
        pageSize: 10,
      });
      setOrders(data.items || data.orders || data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError('فشل في تحميل الطلبات');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrders} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'الرئيسية', link: '/' },
          { label: 'طلباتي' },
        ]}
      />

      <h1 className="text-2xl font-bold mb-6">📋 طلباتي</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon="📋"
          title="لا توجد طلبات"
          message="لم تقم بإنشاء أي طلبات بعد"
          action={
            <Link to="/products" className="btn-primary">
              تصفح المنتجات
            </Link>
          }
        />
      ) : (
        <>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}
    </div>
  );
};

export default OrdersPage;
