import { useState, useEffect } from 'react';
import { FiTrash2, FiCheck } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StarRating from '../../components/common/StarRating';
import { getAllReviews, approveReview, deleteReview } from '../../api/admin/adminReviewService';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews({
        pageNumber: currentPage,
        pageSize: 10,
      });
      setReviews(data?.items || data?.reviews || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('فشل في تحميل التقييمات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const handleApprove = async (id) => {
    try {
      await approveReview(id);
      toast.success('تم اعتماد التقييم');
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل اعتماد التقييم');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await deleteReview(deleteTarget.id);
      toast.success('تم حذف التقييم بنجاح');
      setDeleteTarget(null);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل حذف التقييم');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      header: '#',
      render: (row) => <span className="font-medium">{row.id}</span>,
    },
    {
      header: 'المستخدم',
      render: (row) => (
        <span className="font-medium">
          {row.userName || row.userFirstName || 'مستخدم'}
        </span>
      ),
    },
    {
      header: 'المنتج',
      render: (row) => (
        <span className="text-sm">{row.productName || '—'}</span>
      ),
    },
    {
      header: 'التقييم',
      render: (row) => <StarRating rating={row.rating} size={14} showNumber={false} />,
    },
    {
      header: 'التعليق',
      render: (row) => (
        <span className="text-sm text-gray-600 line-clamp-2 max-w-xs">
          {row.comment || '—'}
        </span>
      ),
    },
    {
      header: 'التاريخ',
      render: (row) => (
        <span className="text-sm text-gray-500">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      header: 'إجراءات',
      render: (row) => (
        <div className="flex items-center gap-1">
          {/* 🆕 زر الموافقة */}
          {!row.isApproved && (
            <button
              onClick={() => handleApprove(row.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="اعتماد"
            >
              <FiCheck size={16} />
            </button>
          )}
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="حذف"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">⭐ إدارة التقييمات</h1>

      <DataTable columns={columns} data={reviews} loading={loading} emptyMessage="لا توجد تقييمات" />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف التقييم"
        message="هل أنت متأكد من حذف هذا التقييم؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText={deleteLoading ? 'جاري الحذف...' : 'حذف'}
        danger
      />
    </div>
  );
};

export default AdminReviewsPage;