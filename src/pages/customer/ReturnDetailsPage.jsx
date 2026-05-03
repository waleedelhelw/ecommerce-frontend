import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiRefreshCw,
  FiPackage,
  FiAlertCircle,
  FiCalendar,
  FiDollarSign,
  FiInfo,
  FiTruck,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ReturnStatusBadge from '../../components/return/ReturnStatusBadge';
import ReturnTimeline from '../../components/return/ReturnTimeline';
import returnService from '../../api/returnService';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';
import {
  getReturnReasonInfo,
  getShippingCostInfo,
} from '../../utils/returnStatusMap';

const ReturnDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [returnRequest, setReturnRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cancel
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Ship
  const [showShipModal, setShowShipModal] = useState(false);
  const [shippingCompany, setShippingCompany] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipLoading, setShipLoading] = useState(false);
  const [shipErrors, setShipErrors] = useState({});

  // Image preview
  const [previewImage, setPreviewImage] = useState(null);

  const fetchReturn = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await returnService.getReturnById(id);
      setReturnRequest(data);
    } catch (err) {
      setError('فشل فى تحميل تفاصيل طلب الإرجاع');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturn();
  }, [id]);

  // Cancel return
  const handleCancel = async () => {
    try {
      setCancelLoading(true);
      await returnService.cancelReturnRequest(id);
      toast.success('تم إلغاء طلب الإرجاع بنجاح');
      setShowCancelDialog(false);
      fetchReturn();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل إلغاء الطلب');
    } finally {
      setCancelLoading(false);
    }
  };

  // Ship return
  const handleShip = async () => {
    const errors = {};
    if (!shippingCompany.trim()) errors.company = 'اسم شركة الشحن مطلوب';
    if (!trackingNumber.trim()) errors.tracking = 'رقم التتبع مطلوب';

    if (Object.keys(errors).length > 0) {
      setShipErrors(errors);
      return;
    }

    try {
      setShipLoading(true);
      await returnService.shipReturn(id, {
        shippingCompany: shippingCompany.trim(),
        trackingNumber: trackingNumber.trim(),
      });
      toast.success('تم تسجيل بيانات الشحن بنجاح');
      setShowShipModal(false);
      setShippingCompany('');
      setTrackingNumber('');
      setShipErrors({});
      fetchReturn();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تسجيل بيانات الشحن');
    } finally {
      setShipLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchReturn} />;
  if (!returnRequest)
    return <ErrorMessage message="طلب الإرجاع غير موجود" />;

  const canCancel = returnRequest.status === 'Pending';
  const canShip = returnRequest.status === 'Approved';
  const reasonInfo = getReturnReasonInfo(returnRequest.reason);
  const shippingInfo = getShippingCostInfo(returnRequest.shippingCostPaidBy);

  return (
    <>
      <SEO
        title={`طلب إرجاع ${returnRequest.returnNumber}`}
        noindex
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'الرئيسية', link: '/' },
            { label: 'طلباتى', link: '/orders' },
            { label: 'الإرجاعات', link: '/returns' },
            { label: returnRequest.returnNumber },
          ]}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
              <FiRefreshCw /> {returnRequest.returnNumber}
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FiCalendar size={14} />
              {formatDate(returnRequest.createdAt)} • طلب{' '}
              <Link
                to={`/orders/${returnRequest.orderId}`}
                className="text-blue-600 hover:underline"
              >
                #{returnRequest.orderId}
              </Link>
            </p>
          </div>
          <ReturnStatusBadge status={returnRequest.status} size="lg" />
        </div>

        {/* Status Banners */}
        {returnRequest.status === 'Approved' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-bold text-green-800">
                  تمت الموافقة على الإرجاع
                </p>
                <p className="text-sm text-green-700">
                  دلوقتى محتاج تشحن المنتج للبائع.{' '}
                  {returnRequest.shippingDeadline && (
                    <span className="font-bold">
                      آخر موعد:{' '}
                      {formatDate(returnRequest.shippingDeadline)}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowShipModal(true)}
              className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              📦 تسجيل بيانات الشحن
            </button>
          </div>
        )}

        {returnRequest.status === 'Shipped' && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <p className="font-bold text-purple-800">
                المنتج فى الطريق للبائع
              </p>
              <p className="text-sm text-purple-700">
                {returnRequest.returnShippingCompany} - رقم التتبع:{' '}
                <span className="font-mono">
                  {returnRequest.returnTrackingNumber}
                </span>
              </p>
            </div>
          </div>
        )}

        {returnRequest.status === 'Received' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">📥</span>
            <div>
              <p className="font-bold text-blue-800">
                البائع استلم المنتج
              </p>
              <p className="text-sm text-blue-700">
                البائع بيفحص المنتج. هيتم إرجاع المبلغ قريباً
              </p>
            </div>
          </div>
        )}

        {returnRequest.status === 'Refunded' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <p className="font-bold text-emerald-800">
                تم إرجاع المبلغ بنجاح!
              </p>
              <p className="text-sm text-emerald-700">
                تم إرجاع{' '}
                <strong>
                  {formatPrice(returnRequest.totalRefundAmount)}
                </strong>{' '}
                عبر{' '}
                {returnRequest.paymentMethod || 'نفس طريقة الدفع الأصلية'}
              </p>
            </div>
          </div>
        )}

        {returnRequest.status === 'Rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div className="flex-1">
                <p className="font-bold text-red-800 mb-1">
                  تم رفض طلب الإرجاع
                </p>
                <p className="text-sm text-red-700">
                  <strong>السبب:</strong>{' '}
                  {returnRequest.rejectionReason || 'غير محدد'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left: Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reason & Description */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold text-lg mb-4">📝 تفاصيل الطلب</h2>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">سبب الإرجاع:</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{reasonInfo.icon}</span>
                  <span className="font-medium">{reasonInfo.label}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">الوصف:</p>
                <p className="text-gray-800 whitespace-pre-wrap">
                  {returnRequest.description}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h2 className="font-bold flex items-center gap-2">
                  <FiPackage /> المنتجات المرتجعة (
                  {returnRequest.items?.length || 0})
                </h2>
              </div>
              <div className="divide-y">
                {returnRequest.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4"
                  >
                    {item.productImageUrl && (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="w-16 h-16 rounded-lg object-cover border flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.unitPrice)} × {item.quantity}
                      </p>
                    </div>
                    <div className="font-bold text-emerald-600">
                      {formatPrice(item.subTotal)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                <span className="font-medium">إجمالى الإرجاع:</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {formatPrice(returnRequest.totalRefundAmount)}
                </span>
              </div>
            </div>

            {/* Images */}
            {returnRequest.images?.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold mb-4">
                  📷 الصور المرفقة (
                  {returnRequest.images.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {returnRequest.images.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setPreviewImage(img.imageUrl)}
                      className="aspect-square rounded-lg overflow-hidden border hover:border-blue-500 transition-colors"
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.altText || 'صورة'}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Refund Info */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <FiDollarSign /> تفاصيل المبلغ
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">قيمة المنتجات:</span>
                  <span className="font-medium">
                    {formatPrice(returnRequest.itemsTotal)}
                  </span>
                </div>
                {returnRequest.shippingRefund > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">رد الشحن:</span>
                    <span className="font-medium">
                      {formatPrice(returnRequest.shippingRefund)}
                    </span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">إجمالى الإرجاع:</span>
                  <span className="font-bold text-emerald-600">
                    {formatPrice(returnRequest.totalRefundAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <FiTruck /> معلومات الشحن
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">تكلفة شحن الإرجاع:</p>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${shippingInfo.color}`}
                  >
                    {shippingInfo.icon} {shippingInfo.label}
                  </span>
                </div>

                {returnRequest.returnShippingCompany && (
                  <>
                    <hr />
                    <div>
                      <p className="text-gray-600">شركة الشحن:</p>
                      <p className="font-medium">
                        {returnRequest.returnShippingCompany}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">رقم التتبع:</p>
                      <p className="font-mono font-medium">
                        {returnRequest.returnTrackingNumber}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold mb-3">🏪 البائع</h3>
              <Link
                to={`/sellers/${returnRequest.sellerId}`}
                className="text-blue-600 hover:underline font-medium"
              >
                {returnRequest.storeName || returnRequest.sellerName}
              </Link>
              {returnRequest.sellerNotes && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-1">
                    ملاحظات البائع:
                  </p>
                  <p className="text-sm text-gray-700">
                    {returnRequest.sellerNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <ReturnTimeline returnRequest={returnRequest} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {canShip && (
            <button
              onClick={() => setShowShipModal(true)}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              📦 تسجيل بيانات الشحن
            </button>
          )}

          {canCancel && (
            <button
              onClick={() => setShowCancelDialog(true)}
              className="btn-danger"
            >
              ❌ إلغاء الطلب
            </button>
          )}

          <button
            onClick={() => navigate('/returns')}
            className="btn-secondary"
          >
            ← رجوع للإرجاعات
          </button>
        </div>

        {/* Cancel Dialog */}
        <ConfirmDialog
          isOpen={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
          onConfirm={handleCancel}
          title="إلغاء طلب الإرجاع"
          message="هل أنت متأكد من إلغاء طلب الإرجاع؟ لا يمكن التراجع."
          confirmText={cancelLoading ? 'جارى الإلغاء...' : 'نعم، إلغاء'}
          danger
        />

        {/* Ship Modal */}
        <Modal
          isOpen={showShipModal}
          onClose={() => {
            setShowShipModal(false);
            setShipErrors({});
          }}
          title="تسجيل بيانات شحن الإرجاع"
          size="md"
        >
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="text-blue-900 flex items-start gap-2">
                <FiInfo size={16} className="flex-shrink-0 mt-0.5" />
                <span>
                  بعد ما تشحن المنتج للبائع، سجّل بيانات الشحن هنا عشان
                  البائع يقدر يتابع الشحنة.
                </span>
              </p>
            </div>

            <Input
              label="شركة الشحن *"
              placeholder="مثلاً: Aramex, DHL, Bosta"
              value={shippingCompany}
              onChange={(e) => setShippingCompany(e.target.value)}
              error={shipErrors.company}
            />

            <Input
              label="رقم التتبع *"
              placeholder="مثلاً: TRK-123456789"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              error={shipErrors.tracking}
            />

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowShipModal(false)}
                className="btn-secondary"
                disabled={shipLoading}
              >
                إلغاء
              </button>
              <Button
                type="button"
                onClick={handleShip}
                variant="primary"
                loading={shipLoading}
              >
                تأكيد الشحن
              </Button>
            </div>
          </div>
        </Modal>

        {/* Image Preview Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <img
              src={previewImage}
              alt="معاينة"
              className="max-w-full max-h-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center text-2xl hover:bg-gray-200"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ReturnDetailsPage;