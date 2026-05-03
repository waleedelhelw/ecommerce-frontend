import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/common/Pagination';
import ReturnStatusBadge from '../../components/return/ReturnStatusBadge';
import adminReturnService from '../../api/admin/adminReturnService';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { getReturnReasonInfo } from '../../utils/returnStatusMap';
import toast from 'react-hot-toast';

const AdminReturnsPage = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all | escalated | pending

  // ✅ Stats
  const [stats, setStats] = useState({
    total: 0,
    escalated: 0,
    pending: 0,
    refunded: 0,
  });

  const fetchReturns = async () => {
    try {
      setLoading(true);

      // ✅ تحديد الـ status حسب الـ tab
      let status = statusFilter;
      if (activeTab === 'escalated') status = 'Escalated';
      if (activeTab === 'pending') status = 'Pending';

      const data = await adminReturnService.getAllReturns({
        pageNumber: currentPage,
        pageSize: 10,
        status: status || undefined,
      });

      const items = data?.items || data?.returns || data || [];
      setReturns(items);
      setTotalPages(data?.totalPages || 1);

      // ✅ احسب الـ stats من الـ response (لو متاحة)
      if (data?.stats) {
        setStats(data.stats);
      } else {
        // fallback: نحسب من الـ items الحالية (تقريبى)
        const total = data?.totalCount || items.length;
        setStats((prev) => ({ ...prev, total }));
      }
    } catch (error) {
      console.error('Error fetching returns:', error);
      toast.error('فشل فى تحميل طلبات الإرجاع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [currentPage, statusFilter, activeTab]);

  // ✅ تغيير الـ Tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStatusFilter('');
    setCurrentPage(1);
  };

  // ✅ Columns للـ DataTable
  const columns = [
    {
      header: 'رقم الإرجاع',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600">
          {row.returnNumber || `#${row.id}`}
        </span>
      ),
    },
    {
      header: 'الأوردر',
      render: (row) => (
        <Link
          to={`/admin/orders/${row.orderId}`}
          className="text-blue-600 hover:underline text-sm"
        >
          #{row.orderId}
        </Link>
      ),
    },
    {
      header: 'العميل',
      render: (row) => (
        <div className="text-sm">
          <p className="font-medium">{row.userName || '—'}</p>
          <p className="text-xs text-gray-500">{row.userEmail || ''}</p>
        </div>
      ),
    },
    {
      header: 'البائع',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.storeName || row.sellerName || '—'}
        </span>
      ),
    },
    {
      header: 'السبب',
      render: (row) => {
        const reasonInfo = getReturnReasonInfo(row.reason);
        return (
          <span className="flex items-center gap-1 text-xs">
            <span>{reasonInfo.icon}</span>
            <span>{reasonInfo.label}</span>
          </span>
        );
      },
    },
    {
      header: 'المبلغ',
      render: (row) => (
        <span className="font-bold text-emerald-600">
          {formatPrice(row.totalRefundAmount)}
        </span>
      ),
    },
    {
      header: 'الحالة',
      render: (row) => <ReturnStatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'التاريخ',
      render: (row) => (
        <span className="text-xs text-gray-500">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      header: 'إجراءات',
      render: (row) => (
        <Link
          to={`/admin/returns/${row.id}`}
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FiRefreshCw /> 🔄 إدارة طلبات الإرجاع
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          مراقبة جميع طلبات الإرجاع فى المنصة والتدخل فى النزاعات
        </p>
      </div>

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-gray-500 mb-1">إجمالى الطلبات</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total || 0}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-xs text-orange-700 mb-1 flex items-center gap-1">
            <FiAlertTriangle size={12} /> مُصعَّدة (تحتاج تدخلك)
          </p>
          <p className="text-2xl font-bold text-orange-600">
            {stats.escalated || 0}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-xs text-yellow-700 mb-1">قيد المراجعة</p>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.pending || 0}
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-xs text-emerald-700 mb-1">مكتملة</p>
          <p className="text-2xl font-bold text-emerald-600">
            {stats.refunded || 0}
          </p>
        </div>
      </div>

      {/* ✅ Tabs */}
      <div className="bg-white rounded-xl border mb-4 overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            📋 الكل
          </button>
          <button
            onClick={() => handleTabChange('escalated')}
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'escalated'
                ? 'border-orange-600 text-orange-600 bg-orange-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            ⚠️ مُصعَّدة
            {stats.escalated > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {stats.escalated}
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabChange('pending')}
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'pending'
                ? 'border-yellow-600 text-yellow-600 bg-yellow-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            ⏳ قيد المراجعة
          </button>
        </div>

        {/* ✅ Filter داخل Tab "الكل" */}
        {activeTab === 'all' && (
          <div className="p-4 flex items-center gap-3 border-b">
            <label className="text-sm font-medium text-gray-600">
              تصفية حسب الحالة:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field w-auto text-sm"
            >
              <option value="">الكل</option>
              <option value="Pending">⏳ قيد المراجعة</option>
              <option value="Approved">✅ موافق عليها</option>
              <option value="Shipped">📦 العميل شحن</option>
              <option value="Received">📥 البائع استلم</option>
              <option value="Refunded">💰 تم الإرجاع</option>
              <option value="Rejected">❌ مرفوضة</option>
              <option value="Cancelled">🚫 ملغية</option>
              <option value="Escalated">⚠️ مُصعَّدة</option>
            </select>
          </div>
        )}
      </div>

      {/* ✅ Escalated Alert */}
      {activeTab === 'escalated' && returns.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mb-4 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold text-orange-900">
              لديك {returns.length} طلب مُصعَّد يحتاج تدخلك
            </p>
            <p className="text-sm text-orange-700">
              هذه الطلبات صعّدها البائعون للإدارة لحل النزاع. راجعها فى أقرب
              وقت.
            </p>
          </div>
        </div>
      )}

      {/* ✅ Table */}
      <DataTable
        columns={columns}
        data={returns}
        loading={loading}
        emptyMessage={
          activeTab === 'escalated'
            ? '🎉 لا توجد طلبات مُصعَّدة حالياً'
            : activeTab === 'pending'
            ? 'لا توجد طلبات قيد المراجعة'
            : 'لا توجد طلبات إرجاع'
        }
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminReturnsPage;