import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminPaymentService from '../../api/admin/adminPaymentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { PAYMENT_LABELS, PAGINATION } from '../../utils/constants';
import toast from 'react-hot-toast';

const AdminPaymentReviewPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, paymentId: null });
  const [rejectReason, setRejectReason] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminPaymentService.getPendingPayments({
        pageNumber: page,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
      });
      setPayments(data.items || data || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError('فشل في تحميل الإيصالات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page]);

  // ✅ تأكيد الدفع
  const handleConfirm = async (paymentId) => {
    try {
      setActionLoading(paymentId);
      await adminPaymentService.confirmPayment(paymentId);
      toast.success('تم تأكيد الدفع بنجاح ✅');
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تأكيد الدفع');
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ رفض الدفع
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('يرجى كتابة سبب الرفض');
      return;
    }
    try {
      setActionLoading(rejectModal.paymentId);
      await adminPaymentService.rejectPayment(rejectModal.paymentId, rejectReason);
      toast.success('تم رفض الإيصال ❌');
      setRejectModal({ open: false, paymentId: null });
      setRejectReason('');
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل رفض الإيصال');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchPayments} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🧾 مراجعة إيصالات الدفع</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalCount} إيصال في انتظار المراجعة
          </p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <span className="text-5xl">✅</span>
          <h3 className="text-lg font-bold text-gray-700 mt-4">لا توجد إيصالات معلقة</h3>
          <p className="text-gray-500 mt-2">كل الإيصالات تمت مراجعتها</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {payments.map((payment) => (
            <div key={payment.paymentId} className="bg-white rounded-xl border overflow-hidden">
              {/* صورة الإيصال */}
              {payment.receiptImageUrl && (
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setPreviewImage(payment.receiptImageUrl)}
                >
                  <img
                    src={payment.receiptImageUrl}
                    alt="إيصال الدفع"
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-all">
                    <span className="opacity-0 group-hover:opacity-100 text-white bg-black/50 px-3 py-1 rounded-lg text-sm">
                      🔍 عرض بالكامل
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5">
                {/* معلومات الطلب */}
                <div className="flex items-center justify-between mb-3">
                  <Link
                    to={`/admin/orders/${payment.orderId}`}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    طلب #{payment.orderId}
                  </Link>
                  <span className="text-xl font-bold text-green-600">
                    {formatPrice(payment.amount)}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>👤 {payment.customerName || 'عميل'}</p>
                  <p>💳 {PAYMENT_LABELS[payment.paymentMethod] || payment.paymentMethod}</p>
                  <p>📅 {formatDate(payment.createdAt)}</p>
                  {payment.reference && (
                    <p className="text-xs text-gray-400">Ref: {payment.reference}</p>
                  )}
                </div>

                {/* ✅ أزرار الإجراء — paymentId بدل id */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConfirm(payment.paymentId)}
                    disabled={actionLoading === payment.paymentId}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium transition-colors"
                  >
                    {actionLoading === payment.paymentId ? '...' : '✅ تأكيد'}
                  </button>
                  <button
                    onClick={() => setRejectModal({ open: true, paymentId: payment.paymentId })}
                    disabled={actionLoading === payment.paymentId}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium transition-colors"
                  >
                    ❌ رفض
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalCount > PAGINATION.DEFAULT_PAGE_SIZE && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(totalCount / PAGINATION.DEFAULT_PAGE_SIZE)}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Modal رفض الإيصال */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">❌ رفض الإيصال</h3>
            <p className="text-sm text-gray-600 mb-3">
              يرجى كتابة سبب الرفض (سيتم إرساله للعميل عبر البريد الإلكتروني):
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="مثال: الإيصال غير واضح / المبلغ غير صحيح..."
              rows={3}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
              >
                {actionLoading ? 'جاري الرفض...' : '❌ تأكيد الرفض'}
              </button>
              <button
                onClick={() => {
                  setRejectModal({ open: false, paymentId: null });
                  setRejectReason('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal عرض الصورة بالكامل */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={previewImage}
              alt="إيصال الدفع"
              className="max-w-full max-h-[90vh] rounded-xl object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 left-2 bg-white/80 text-black w-8 h-8 rounded-full flex items-center justify-center hover:bg-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentReviewPage;