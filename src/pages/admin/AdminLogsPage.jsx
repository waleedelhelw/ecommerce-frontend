import { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import { getLogs } from '../../api/admin/adminLogService';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const AdminLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getLogs({
        pageNumber: currentPage,
        pageSize: 15,
      });
      setLogs(data?.items || data?.logs || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('فشل في تحميل السجلات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  const getActionBadge = (action) => {
    const actionMap = {
      Create: { label: 'إنشاء', variant: 'success' },
      Update: { label: 'تعديل', variant: 'warning' },
      Delete: { label: 'حذف', variant: 'danger' },
      Login: { label: 'دخول', variant: 'info' },
      Register: { label: 'تسجيل', variant: 'primary' },
    };
    const info = actionMap[action] || { label: action || 'غير معروف', variant: 'default' };
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  const columns = [
    {
      header: '#',
      render: (row) => <span className="font-medium">{row.id}</span>,
    },
    {
      header: 'المستخدم',
      render: (row) => (
        <div>
          <p className="font-medium">{row.customerName || row.customerEmail || '—'}</p>
          {row.adminRole && (
            <p className="text-xs text-gray-400">{row.adminRole}</p>
          )}
        </div>
      ),
    },
    {
      header: 'العملية',
      render: (row) => getActionBadge(row.action || row.actionType),
    },
    {
      header: 'التفاصيل',
      render: (row) => (
        <span className="text-sm text-gray-600 line-clamp-1 max-w-xs">
          {row.details || row.description || '—'}
        </span>
      ),
    },
    {
      header: 'الكيان',
      render: (row) => (
        <span className="text-sm">{row.entityType || row.entity || '—'}</span>
      ),
    },
    {
      header: 'IP',
      render: (row) => (
        <span className="text-xs text-gray-400 font-mono">
          {row.ipAddress || '—'}
        </span>
      ),
    },
    {
      header: 'التاريخ',
      render: (row) => (
        <span className="text-sm text-gray-500">
          {formatDate(row.createdAt || row.timestamp)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📝 سجلات العمليات</h1>

      <DataTable columns={columns} data={logs} loading={loading} emptyMessage="لا توجد سجلات" />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminLogsPage;