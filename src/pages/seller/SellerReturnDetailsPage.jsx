import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiCheck,
  FiXCircle,
  FiPackage,
  FiDollarSign,
  FiAlertTriangle,
  FiUser,
  FiMail,
  FiTruck,
  FiImage,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import sellerReturnService from '../../api/seller/sellerReturnService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ReturnStatusBadge from '../../components/return/ReturnStatusBadge';
import ApproveReturnDialog from '../../components/return/ApproveReturnDialog';
import RejectReturnDialog from '../../components/return/RejectReturnDialog';
import EscalateReturnDialog from '../../components/return/EscalateReturnDialog';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import {
  getReturnReasonInfo,
  getShippingCostInfo,
} from '../../utils/returnStatusMap';

const SellerReturnDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [returnRequest, setReturnRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialogs state
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showEscalate, setShowEscalate] = useState(false);
  const [showConfirmReceived, setShowConfirmReceived] = useState(false);
  const [showProcessRefund, setShowProcessRefund] = useState(false);

  // Image preview
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchReturn();
  }, [id]);

  const fetchReturn = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sellerReturnService.getReturnById(id);
      setReturnRequest(data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'حدث خطأ فى تحميل تفاصيل طلب الإرجاع'
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Action: Approve
  const handleApprove = async (data) => {
    try {
      setActionLoading(true);
      await sellerReturnService.approveReturn(id, data);
      toast.success('تمت الموافقة على طلب الإرجاع ✅');
      setShowApprove(false);
      fetchReturn();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل فى الموافقة');
    } finally {
      setActionLoading(false);
    }
  };

  // ❌ Action: Reject
  const handleReject = async (data) => {
    try {
      setActionLoading(true);
      await sellerReturnService.rejectReturn(id, data);
      toast.success('تم رفض طلب الإرجاع');
      setShowReject(false);
      fetchReturn();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل فى الرفض');
    } finally {
      setActionLoading(false);
    }
  };

  // 📥 Action: Confirm Received
  const handleConfirmReceived = async () => {
    try {
      setActionLoading(true);
      await sellerReturnService.confirmReceived(id);
      toast.success('تم تأكيد استلام المنتج 📥');
      setShowConfirmReceived(false);
      fetchReturn();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل فى تأكيد الاستلام');
    } finally {
      setActionLoading(false);
    }
  };

  // 💰 Action: Process Refund
  const handleProcessRefund = async () => {
    try {
      setActionLoading(true);
      await sellerReturnService.processRefund(id);
      toast.success('تم صرف المبلغ للعميل بنجاح 💰');
      setShowProcessRefund(false);
      fetchReturn();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل فى صرف المبلغ');
    } finally {
      setActionLoading(false);
    }
  };

  // ⚠️ Action: Escalate
  const handleEscalate = async (data) => {
    try {
      setActionLoading(true);
      await sellerReturnService.escalateToAdmin(id, data.reason);
      toast.success('تم تصعيد الطلب للإدارة ⚠️');
      setShowEscalate(false);
      fetchReturn();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل فى التصعيد');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchReturn} />;
  if (!returnRequest) return null;

  const reasonInfo = getReturnReasonInfo(returnRequest.reason);
  const shippingInfo = getShippingCostInfo(returnRequest.shippingCostPaidBy);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button
          onClick={() => navigate('/seller/returns')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiArrowRight size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-800">
            طلب إرجاع {returnRequest.returnNumber || `#${returnRequest.id}`}
          </h1>
          <p className="text-gray-500 text-sm">
            {formatDate(returnRequest.createdAt)} • للأوردر{' '}
            <Link
              to={`/seller/orders/${returnRequest.orderId}`}
              className="text-blue-600 hover:underline"
            >
              #{returnRequest.orderId}
            </Link>
          </p>
        </div>
        <ReturnStatusBadge status={returnRequest.status} size="lg" />
      </div>

      {/* ============ Action Banners حسب الحالة ============ */}

      {/* ⏳ Pending → Approve / Reject */}
      {returnRequest.status === 'Pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="font-bold text-yellow-900">
                  طلب إرجاع جديد - يحتاج إجراء!
                </p>
                <p className="text-sm text-yellow-700">
                  راجع التفاصيل والصور ثم وافق أو ارفض الطلب
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowReject(true)}
                disabled={actionLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium flex items-center gap-1.5"
              >
                <FiXCircle size={16} /> رفض
              </button>
              <button
                onClick={() => setShowApprove(true)}
                disabled={actionLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium flex items-center gap-1.5"
              >
                <FiCheck size={16} /> موافقة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Approved → Waiting Customer */}
      {returnRequest.status === 'Approved' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <div className="flex-1">
              <p className="font-bold text-blue-900">
                فى انتظار شحن العميل للمنتج
              </p>
              <p className="text-sm text-blue-700">
                وافقت على الطلب. العميل لازم يشحن المنتج
                {returnRequest.shippingDeadline &&
                  ` قبل ${formatDate(returnRequest.shippingDeadline)}`}
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 📦 Shipped → Confirm Received / Escalate */}
      {returnRequest.status === 'Shipped' && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="font-bold text-purple-900">
                  العميل شحن المنتج إليك
                </p>
                <p className="text-sm text-purple-700">
                  لما تستلم المنتج، أكد الاستلام عشان نكمل المعاملة
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEscalate(true)}
                disabled={actionLoading}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm font-medium flex items-center gap-1.5"
              >
                <FiAlertTriangle size={16} /> تصعيد
              </button>
              <button
                onClick={() => setShowConfirmReceived(true)}
                disabled={actionLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium flex items-center gap-1.5"
              >
                <FiPackage size={16} /> تأكيد الاستلام
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📥 Received → Process Refund / Escalate */}
      {returnRequest.status === 'Received' && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <p className="font-bold text-indigo-900">
                  استلمت المنتج - حان وقت إرجاع المبلغ
                </p>
                <p className="text-sm text-indigo-700">
                  بعد فحص المنتج، اضغط "صرف المبلغ" لإتمام المعاملة
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEscalate(true)}
                disabled={actionLoading}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm font-medium flex items-center gap-1.5"
              >
                <FiAlertTriangle size={16} /> تصعيد
              </button>
              <button
                onClick={() => setShowProcessRefund(true)}
                disabled={actionLoading}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm font-medium flex items-center gap-1.5"
              >
                <FiDollarSign size={16} /> صرف المبلغ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💰 Refunded → Done */}
      {returnRequest.status === 'Refunded' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✅</span>
            <div>
              <p className="font-bold text-emerald-900">
                تم إغلاق طلب الإرجاع بنجاح
              </p>
              <p className="text-sm text-emerald-700">
                تم صرف المبلغ ({formatPrice(returnRequest.totalRefundAmount)})
                للعميل بتاريخ{' '}
                {returnRequest.refundedAt && formatDate(returnRequest.refundedAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ❌ Rejected */}
      {returnRequest.status === 'Rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="font-bold text-red-900 mb-2">❌ تم رفض طلب الإرجاع</p>
          {returnRequest.rejectionReason && (
            <div className="text-sm text-red-800 bg-white p-3 rounded-lg border border-red-200">
              <span className="font-bold">سبب الرفض: </span>
              {returnRequest.rejectionReason}
            </div>
          )}
        </div>
      )}

      {/* ⚠️ Escalated */}
      {returnRequest.status === 'Escalated' && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-orange-900">
                الطلب مصعّد للإدارة - فى انتظار التدخل
              </p>
              <p className="text-sm text-orange-700">
                ستقوم الإدارة بالتواصل معك خلال 24-48 ساعة
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🚫 Cancelled */}
      {returnRequest.status === 'Cancelled' && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <p className="font-bold text-gray-900">🚫 تم إلغاء طلب الإرجاع من العميل</p>
        </div>
      )}

      {/* ============ Main Grid ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== العمود الرئيسى ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* 📝 السبب والوصف */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              تفاصيل الإرجاع
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">سبب الإرجاع</label>
                <p className="font-medium flex items-center gap-2 mt-1">
                  <span>{reasonInfo.icon}</span>
                  <span>{reasonInfo.label}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {reasonInfo.description}
                </p>
              </div>

              <div className="pt-3 border-t">
                <label className="text-sm text-gray-500">وصف العميل</label>
                <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                  {returnRequest.description || 'لا يوجد وصف'}
                </p>
              </div>
            </div>
          </div>

          {/* 📦 المنتجات */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              المنتجات المُرجَعة ({returnRequest.items?.length || 0})
            </h2>
            <div className="space-y-3">
              {(returnRequest.items || []).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.productImageUrl || '/placeholder-product.png'}
                    alt={item.productName}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-gray-800">
                    {formatPrice(item.subTotal)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 🖼️ الصور */}
          {returnRequest.images && returnRequest.images.length > 0 && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiImage /> صور المنتج ({returnRequest.images.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {returnRequest.images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setPreviewImage(img.imageUrl)}
                    className="aspect-square rounded-lg overflow-hidden border hover:border-blue-400 hover:shadow-md transition-all"
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.altText || `صورة ${idx + 1}`}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 🚚 بيانات شحن العميل (لو موجودة) */}
          {returnRequest.returnTrackingNumber && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiTruck /> بيانات شحن العميل
              </h2>
              <div className="space-y-3 text-sm">
                {returnRequest.returnShippingCompany && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">شركة الشحن</span>
                    <span className="font-medium">
                      {returnRequest.returnShippingCompany}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">رقم التتبع</span>
                  <span className="font-mono font-bold text-purple-600">
                    {returnRequest.returnTrackingNumber}
                  </span>
                </div>
                {returnRequest.shippedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">تاريخ الشحن</span>
                    <span className="font-medium">
                      {formatDate(returnRequest.shippedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 📝 ملاحظات (Seller / Admin) */}
          {(returnRequest.sellerNotes || returnRequest.adminNotes) && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                الملاحظات
              </h2>
              <div className="space-y-3">
                {returnRequest.sellerNotes && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700 font-bold mb-1">
                      🏪 ملاحظتك كبائع:
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {returnRequest.sellerNotes}
                    </p>
                  </div>
                )}
                {returnRequest.adminNotes && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 font-bold mb-1">
                      👨‍💼 ملاحظات الإدارة:
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {returnRequest.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ===== العمود الجانبى ===== */}
        <div className="space-y-6">
          {/* 💰 الملخص المالى */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              الملخص المالى
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">قيمة المنتجات</span>
                <span className="font-medium">
                  {formatPrice(returnRequest.itemsTotal)}
                </span>
              </div>
              {returnRequest.shippingRefund > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">شحن مسترد</span>
                  <span className="font-medium">
                    {formatPrice(returnRequest.shippingRefund)}
                  </span>
                </div>
              )}
              <hr />
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  المبلغ المسترد
                </span>
                <span className="font-bold text-emerald-600 text-lg">
                  {formatPrice(returnRequest.totalRefundAmount)}
                </span>
              </div>

              {returnRequest.shippingCostPaidBy && (
                <>
                  <hr />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">شحن الإرجاع</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${shippingInfo.color}`}
                    >
                      {shippingInfo.icon} {shippingInfo.label}
                    </span>
                  </div>
                </>
              )}

              {returnRequest.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-500">طريقة الدفع</span>
                  <span className="font-medium text-xs">
                    {returnRequest.paymentMethod}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 👤 بيانات العميل */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              بيانات العميل
            </h2>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-700">
                <FiUser size={14} /> {returnRequest.customerName}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FiMail size={14} /> {returnRequest.customerEmail}
              </p>
            </div>
          </div>

          {/* 📅 التواريخ */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              المواعيد
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">تاريخ الطلب</span>
                <span className="font-medium">
                  {formatDate(returnRequest.createdAt)}
                </span>
              </div>
              {returnRequest.approvedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">تاريخ الموافقة</span>
                  <span className="font-medium">
                    {formatDate(returnRequest.approvedAt)}
                  </span>
                </div>
              )}
              {returnRequest.shippedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">تاريخ شحن العميل</span>
                  <span className="font-medium">
                    {formatDate(returnRequest.shippedAt)}
                  </span>
                </div>
              )}
              {returnRequest.receivedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">تاريخ الاستلام</span>
                  <span className="font-medium">
                    {formatDate(returnRequest.receivedAt)}
                  </span>
                </div>
              )}
              {returnRequest.refundedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">تاريخ صرف المبلغ</span>
                  <span className="font-medium text-emerald-600">
                    {formatDate(returnRequest.refundedAt)}
                  </span>
                </div>
              )}
              {returnRequest.rejectedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">تاريخ الرفض</span>
                  <span className="font-medium text-red-600">
                    {formatDate(returnRequest.rejectedAt)}
                  </span>
                </div>
              )}
              {returnRequest.shippingDeadline &&
                ['Approved'].includes(returnRequest.status) && (
                  <div className="flex justify-between bg-yellow-50 p-2 rounded">
                    <span className="text-yellow-800 font-bold">
                      آخر موعد للشحن
                    </span>
                    <span className="font-bold text-yellow-700">
                      {formatDate(returnRequest.shippingDeadline)}
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* ============ Dialogs ============ */}
      <ApproveReturnDialog
        isOpen={showApprove}
        onClose={() => setShowApprove(false)}
        onConfirm={handleApprove}
        loading={actionLoading}
      />

      <RejectReturnDialog
        isOpen={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={handleReject}
        loading={actionLoading}
      />

      <EscalateReturnDialog
        isOpen={showEscalate}
        onClose={() => setShowEscalate(false)}
        onConfirm={handleEscalate}
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={showConfirmReceived}
        onClose={() => setShowConfirmReceived(false)}
        onConfirm={handleConfirmReceived}
        title="📥 تأكيد استلام المنتج"
        message="هل استلمت المنتج المُرجَع وفحصته؟ بعد التأكيد، ستتمكن من صرف المبلغ للعميل."
        confirmText="نعم، استلمت المنتج"
      />

      <ConfirmDialog
        isOpen={showProcessRefund}
        onClose={() => setShowProcessRefund(false)}
        onConfirm={handleProcessRefund}
        title="💰 صرف المبلغ للعميل"
        message={`سيتم صرف ${formatPrice(
          returnRequest.totalRefundAmount
        )} للعميل بنفس طريقة الدفع الأصلية. هل أنت متأكد؟`}
        confirmText="نعم، صرف المبلغ"
      />

      {/* ============ Image Preview ============ */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="معاينة"
            width={800}
            height={800}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 left-4 bg-white text-black p-2 rounded-full hover:bg-gray-200"
          >
            <FiXCircle size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SellerReturnDetailsPage;