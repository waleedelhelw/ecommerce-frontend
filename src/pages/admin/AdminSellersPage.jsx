import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiCheck, FiX, FiSlash } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { getAllSellers, approveSeller, rejectSeller, suspendSeller } from '../../api/admin/adminSellerService';
import { sellerStatusMap, getStatusInfo } from '../../utils/orderStatusMap';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

// ✅ الـ Backend بيستخدم userId في الـ approve/reject/suspend
const getSellerActionId = (seller) => {
  return seller.userId || seller.id;
};

const extractArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.sellers)) return data.sellers;
  if (Array.isArray(data.$values)) return data.$values;
  const keys = Object.keys(data);
  for (const key of keys) {
    if (Array.isArray(data[key])) return data[key];
  }
  return [];
};

const AdminSellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionDialog, setActionDialog] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const data = await getAllSellers({
        pageNumber: currentPage,
        pageSize: 10,
        status: statusFilter || undefined,
      });

      const items = extractArray(data);
      setSellers(items);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error('فشل في تحميل البائعين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [currentPage, statusFilter]);

  // ✅ كل الـ actions بتستخدم userId
  const handleApprove = async (seller) => {
    const id = getSellerActionId(seller);
    try {
      setActionLoading(true);
      await approveSeller(id);
      toast.success('تم قبول البائع بنجاح');
      setActionDialog(null);
      fetchSellers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل قبول البائع');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (seller) => {
    if (!rejectReason.trim()) {
      toast.error('يرجى إدخال سبب الرفض');
      return;
    }
    const id = getSellerActionId(seller);
    try {
      setActionLoading(true);
      await rejectSeller(id, rejectReason);
      toast.success('تم رفض البائع');
      setActionDialog(null);
      setRejectReason('');
      fetchSellers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل رفض البائع');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async (seller) => {
    const id = getSellerActionId(seller);
    try {
      setActionLoading(true);
      await suspendSeller(id);
      toast.success('تم إيقاف البائع');
      setActionDialog(null);
      fetchSellers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إيقاف البائع');
    } finally {
      setActionLoading(false);
    }
  };

  const statusFilters = [
    { value: '', label: 'الكل' },
    { value: 'Pending', label: '⏳ في الانتظار' },
    { value: 'Approved', label: '✅ معتمد' },
    { value: 'Rejected', label: '❌ مرفوض' },
    { value: 'Suspended', label: '🚫 موقوف' },
  ];

  const columns = [
    {
      header: '#',
      render: (row) => <span className="font-medium">{row.id}</span>,
    },
    {
      header: 'المتجر',
      render: (row) => (
        <div>
          <p className="font-medium">{row.storeName}</p>
          <p className="text-xs text-gray-400">{row.sellerName || row.userName}</p>
        </div>
      ),
    },
    {
      header: 'البريد',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.sellerEmail || row.email}</span>
      ),
    },
    {
      header: 'العمولة',
      render: (row) => (
        <span className="font-medium">{row.commissionRate || 10}%</span>
      ),
    },
    {
      header: 'الحالة',
      render: (row) => {
        const status = getStatusInfo(sellerStatusMap, row.status);
        return (
          <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
            {status.icon} {status.label}
          </span>
        );
      },
    },
    {
      header: 'التاريخ',
      render: (row) => (
        <span className="text-sm text-gray-500">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: 'إجراءات',
      render: (row) => (
        <div className="flex items-center gap-1">
          {/* ✅ صفحة التفاصيل تستخدم userId كمان */}
          <Link
            to={`/admin/sellers/${getSellerActionId(row)}`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="عرض"
          >
            <FiEye size={16} />
          </Link>

          {row.status === 'Pending' && (
            <>
              <button
                onClick={() => setActionDialog({ type: 'approve', seller: row })}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                title="قبول"
              >
                <FiCheck size={16} />
              </button>
              <button
                onClick={() => setActionDialog({ type: 'reject', seller: row })}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="رفض"
              >
                <FiX size={16} />
              </button>
            </>
          )}

          {row.status === 'Approved' && (
            <button
              onClick={() => setActionDialog({ type: 'suspend', seller: row })}
              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
              title="إيقاف"
            >
              <FiSlash size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">🏪 إدارة البائعين</h1>

      {/* فلاتر الحالة */}
      <div className="mb-6 flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => {
              setStatusFilter(filter.value);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${statusFilter === filter.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={sellers} loading={loading} emptyMessage="لا يوجد بائعين" />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* ✅ Approve Dialog */}
      {actionDialog?.type === 'approve' && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setActionDialog(null)}
          onConfirm={() => handleApprove(actionDialog.seller)}
          title="قبول البائع"
          message={`هل أنت متأكد من قبول "${actionDialog.seller.storeName}" كبائع على المنصة؟`}
          confirmText={actionLoading ? 'جاري القبول...' : 'نعم، قبول'}
        />
      )}

      {/* ✅ Reject Dialog */}
      {actionDialog?.type === 'reject' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">رفض البائع</h3>
            <p className="text-sm text-gray-500 mb-4">
              رفض "{actionDialog.seller.storeName}"
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="سبب الرفض (مطلوب)..."
              rows={3}
              className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleReject(actionDialog.seller)}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
              >
                {actionLoading ? 'جاري الرفض...' : 'رفض'}
              </button>
              <button
                onClick={() => { setActionDialog(null); setRejectReason(''); }}
                className="flex-1 border py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Suspend Dialog */}
      {actionDialog?.type === 'suspend' && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setActionDialog(null)}
          onConfirm={() => handleSuspend(actionDialog.seller)}
          title="إيقاف البائع"
          message={`هل أنت متأكد من إيقاف "${actionDialog.seller.storeName}"؟ لن يتمكن من البيع حتى يتم إعادة تفعيله.`}
          confirmText={actionLoading ? 'جاري الإيقاف...' : 'نعم، إيقاف'}
          danger
        />
      )}
    </div>
  );
};

export default AdminSellersPage;