import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import adminAttributeService from '../../api/admin/adminAttributeService';
import toast from 'react-hot-toast';

const extractArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.attributes)) return data.attributes;
  if (Array.isArray(data.$values)) return data.$values;
  const keys = Object.keys(data);
  for (const key of keys) {
    if (Array.isArray(data[key])) return data[key];
  }
  return [];
};

const extractTotalPages = (data) => {
  if (!data || typeof data !== 'object') return 1;
  return data.totalPages || data.pageCount || data.total_pages || 1;
};

const AdminAttributesPage = () => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAttributes = useCallback(async (signal) => {
    try {
      setLoading(true);
      const data = await adminAttributeService.getAttributes({
        pageNumber: currentPage,
        pageSize: 10,
      });
      const items = extractArray(data);
      const pages = extractTotalPages(data);
      setAttributes(items);
      setTotalPages(pages);
    } catch (error) {
      if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') return;
      console.error('Error fetching attributes:', error);
      toast.error('فشل في تحميل الخصائص');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    const controller = new AbortController();
    fetchAttributes(controller.signal);
    return () => controller.abort();
  }, [fetchAttributes]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await adminAttributeService.deleteAttribute(deleteTarget.id);
      toast.success('تم حذف الخاصية بنجاح');
      setDeleteTarget(null);
      if (attributes.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchAttributes();
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'فشل حذف الخاصية';
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteTarget, attributes.length, currentPage, fetchAttributes]);

  const columns = [
    {
      header: '#',
      render: (row) => <span className="font-medium">{row.id}</span>,
    },
    {
      header: 'الاسم',
      render: (row) => <span className="font-bold">{row.name}</span>,
    },
    {
      header: 'ترتيب العرض',
      render: (row) => (
        <span className="text-gray-500">{row.displayOrder ?? '—'}</span>
      ),
    },
    {
      header: 'القيم',
      render: (row) => {
        const values = Array.isArray(row.values) ? row.values : [];
        return (
          <div className="flex flex-wrap gap-1">
            {values.length === 0 ? (
              <span className="text-gray-400 text-sm">—</span>
            ) : (
              values.map((v) => (
                <span
                  key={v.id || v}
                  className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs"
                >
                  {v.value || v}
                </span>
              ))
            )}
          </div>
        );
      },
    },
    {
      header: 'إجراءات',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/attributes/${row.id}/edit`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="تعديل"
          >
            <FiEdit size={16} />
          </Link>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="حذف"
            disabled={deleteLoading}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🏷️ إدارة الخصائص</h1>
        <Link
          to="/admin/attributes/create"
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={18} />
          إضافة خاصية
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={attributes}
        loading={loading}
        emptyMessage="لا توجد خصائص"
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => !deleteLoading && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف الخاصية"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText={deleteLoading ? 'جاري الحذف...' : 'حذف'}
        danger
      />
    </div>
  );
};

export default AdminAttributesPage;
