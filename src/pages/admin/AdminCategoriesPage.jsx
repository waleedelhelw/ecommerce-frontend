import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import adminCategoryService from '../../api/admin/adminCategoryService';
import toast from 'react-hot-toast';

// ✅ Helper function لاستخراج الـ Array من أي شكل response
const extractArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.categories)) return data.categories;
  if (Array.isArray(data.$values)) return data.$values;

  // لو الـ data object وفيه key واحد بس وهو array
  const keys = Object.keys(data);
  for (const key of keys) {
    if (Array.isArray(data[key])) return data[key];
  }

  return [];
};

// ✅ Helper function لاستخراج عدد الصفحات
const extractTotalPages = (data) => {
  if (!data || typeof data !== 'object') return 1;
  return data.totalPages || data.pageCount || data.total_pages || 1;
};

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = useCallback(async (signal) => {
    try {
      setLoading(true);
      const data = await adminCategoryService.getCategories({
        pageNumber: currentPage,
        pageSize: 10,
      });

      // ✅ استخراج الـ array بطريقة آمنة
      const items = extractArray(data);
      const pages = extractTotalPages(data);

      console.log('📋 Extracted categories:', items);
      console.log('📄 Total pages:', pages);

      setCategories(items);
      setTotalPages(pages);
    } catch (error) {
      if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') {
        return;
      }
      console.error('Error fetching categories:', error);
      toast.error('فشل في تحميل التصنيفات');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal);
    return () => controller.abort();
  }, [fetchCategories]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      await adminCategoryService.deleteCategory(deleteTarget.id);
      toast.success('تم حذف التصنيف بنجاح');
      setDeleteTarget(null);

      if (categories.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchCategories();
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'فشل حذف التصنيف';
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteTarget, categories.length, currentPage, fetchCategories]);

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
      header: 'الوصف',
      render: (row) => (
        <span className="text-gray-500 text-sm line-clamp-1">
          {row.description || '—'}
        </span>
      ),
    },
    {
      header: 'عدد المنتجات',
      render: (row) => (
        <span className="font-medium">{row.productCount ?? 0}</span>
      ),
    },
    {
      header: 'إجراءات',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/categories/edit/${row.id}`}
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
        <h1 className="text-2xl font-bold">🏷️ إدارة التصنيفات</h1>
        <Link
          to="/admin/categories/create"
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={18} />
          إضافة تصنيف
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        emptyMessage="لا توجد تصنيفات"
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
        title="حذف التصنيف"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText={deleteLoading ? 'جاري الحذف...' : 'حذف'}
        danger
      />
    </div>
  );
};

export default AdminCategoriesPage;