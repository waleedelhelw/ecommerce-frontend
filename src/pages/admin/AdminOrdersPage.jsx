import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/common/Pagination';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';
import { getAllOrders } from '../../api/admin/adminOrderService';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders({
        pageNumber: currentPage,
        pageSize: 10,
        status: statusFilter || undefined,
      });
      setOrders(data?.items || data?.orders || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('فشل في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const columns = [
    {
      header: '#',
      render: (row) => <span className="font-bold">#{row.id}</span>,
    },
    {
      header: 'العميل',
      render: (row) => (
        <span className="font-medium">
          {row.customerName || row.userName || 'غير معروف'}
        </span>
      ),
    },
    {
      header: 'المتجر',
      render: (row) => (
        <span className="text-sm text-gray-500">
          {row.storeName || row.sellerName || '—'}
        </span>
      ),
    },
    {
      header: 'المبلغ',
      render: (row) => (
        <span className="font-bold text-blue-600">
          {formatPrice(row.totalAmount || row.totalPrice)}
        </span>
      ),
    },
    {
      header: 'الحالة',
      render: (row) => <OrderStatusBadge status={row.status} />,
    },
    {
      header: 'التاريخ',
      render: (row) => (
        <span className="text-sm text-gray-500">
          {formatDate(row.createdAt || row.orderDate)}
        </span>
      ),
    },
    {
      header: 'إجراءات',
      render: (row) => (
        <Link
          to={`/admin/orders/${row.id}`}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1"
        >
          <FiEye size={16} />
          <span className="text-sm">عرض</span>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📋 إدارة الطلبات</h1>

      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600">تصفية حسب الحالة:</label>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="input-field w-auto"
        >
          <option value="">الكل</option>
          <option value="Pending">قيد الانتظار</option>
          <option value="Processing">قيد المعالجة</option>
          <option value="Shipped">تم الشحن</option>
          <option value="Delivered">تم التسليم</option>
          <option value="Cancelled">ملغى</option>
        </select>
      </div>

      <DataTable columns={columns} data={orders} loading={loading} emptyMessage="لا توجد طلبات" />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default AdminOrdersPage;