import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import adminCategoryService from '../../api/admin/adminCategoryService';
import toast from 'react-hot-toast';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ✅ useCallback عشان نتجنب مشكلة stale closure
  const fetchCategories = useCallback(async (signal) => {
    try {
      setLoading(true);
      const data = await adminCategoryService.getCategories({
        pageNumber: currentPage,
        pageSize: 10,
        signal, // ✅ لدعم الـ abort
      });

      // ✅ استخدام nullish coalescing بدل || عشان القيم الفارغة
      const items = data?.items ?? data?.categories ?? data ?? [];
      const pages = data?.totalPages ?? 1;

      setCategories(items);
      setTotalPages(pages);
    } catch (error) {
      // ✅ تجاهل الـ abort errors
      if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') {
        return;
      }
      console.error('Error fetching categories:', error);
      toast.error('فشل في تحميل التصنيفات');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  // ✅ useEffect مع cleanup
  useEffect(() => {
    const controller = new AbortController();

    fetchCategories(controller.signal);

    // ✅ Cleanup: لو المستخدم غيّر الصفحة أو الـ component اتشال
    return () => controller.abort();
  }, [fetchCategories]);

  // ✅ handleDelete مع error handling أفضل
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      await adminCategoryService.deleteCategory(deleteTarget.id);
      toast.success('تم حذف التصنيف بنجاح');
      setDeleteTarget(null);

      // ✅ لو كان آخر عنصر في الصفحة، ارجع صفحة لورا
      if (categories.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchCategories();
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || 'فشل حذف التصنيف';
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteTarget, categories.length, currentPage, fetchCategories]);

  // ✅ الأعمدة مفصولة عن الـ render عشان الأداء
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
      {/* ✅ Header */}
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

      {/* ✅ Table */}
      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        emptyMessage="لا توجد تصنيفات"
      />

      {/* ✅ Pagination - بيظهر بس لو فيه أكتر من صفحة */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* ✅ Delete Confirmation Dialog */}
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