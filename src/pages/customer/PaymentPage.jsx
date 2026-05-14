import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorMessage from '../../components/common/ErrorMessage';
import PaymentsList from '../../components/order/PaymentsList';
import orderService from '../../api/orderService';
import settingsService from '../../api/settingsService';
import { orderStatusMap } from '../../utils/orderStatusMap';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [orderData, settingsData] = await Promise.all([
          orderService.getOrderById(id),
          settingsService.getPaymentInfo().catch(() => null),
        ]);
        setOrder(orderData);
        setPaymentInfo(settingsData);
      } catch (err) {
        setError('فشل في تحميل بيانات الطلب');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUploadReceipt = async (paymentId, data) => {
    await orderService.uploadPaymentReceipt(id, paymentId, data);
    const updatedOrder = await orderService.getOrderById(id);
    setOrder(updatedOrder);
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!order) return <ErrorMessage message="الطلب غير موجود" />;

  const status = orderStatusMap[order.status] || orderStatusMap.PendingPayment;
  const payments = order.payments || [];
  const pendingPayments = payments.filter((p) => p.status === 'Pending' || p.status === 'Failed');
  const grandTotal = (order.totalPrice || 0) + (order.shippingCost || 0) + (order.codFee || 0);
  const allPaid = payments.every((p) => ['Confirmed', 'Completed'].includes(p.status));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'الرئيسية', link: '/' },
          { label: 'طلباتي', link: '/orders' },
          { label: `طلب #${order.id}`, link: `/orders/${order.id}` },
          { label: 'الدفع' },
        ]}
      />

      <h1 className="text-2xl font-bold mb-6">💳 إتمام الدفع - طلب #{order.id}</h1>

      {/* حالة الطلب */}
      <div className={`p-4 rounded-xl mb-6 ${
        order.status === 'PaymentFailed' ? 'bg-red-50 border border-red-200' :
        order.status === 'WaitingConfirmation' ? 'bg-orange-50 border border-orange-200' :
        allPaid ? 'bg-green-50 border border-green-200' :
        'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{status.icon}</span>
          <div>
            <p className="font-bold text-gray-800">{status.label}</p>
            {pendingPayments.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                متبقي {pendingPayments.length} دفعة في انتظار الدفع
              </p>
            )}
            {allPaid && (
              <p className="text-sm text-green-600 mt-1">
                ✅ تم دفع كل الدفعات بنجاح!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ملخص المدفوعات */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">💰 ملخص المدفوعات</h2>
          <Link to={`/orders/${id}`} className="text-sm text-blue-600 hover:underline">
            ← عرض تفاصيل الطلب
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">الإجمالي</p>
            <p className="text-lg font-bold text-gray-800">{formatPrice(grandTotal)}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-green-600">المدفوع</p>
            <p className="text-lg font-bold text-green-600">{formatPrice(order.totalPaidAmount || 0)}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-xs text-orange-600">المتبقي</p>
            <p className="text-lg font-bold text-orange-600">{formatPrice(order.remainingAmount || grandTotal)}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-600">عدد الدفعات</p>
            <p className="text-lg font-bold text-blue-600">{payments.length}</p>
          </div>
        </div>
      </div>

      {/* المدفوعات */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">📋 المدفوعات</h2>
        <PaymentsList
          payments={payments}
          paymentInfo={paymentInfo}
          showUpload={true}
          onUploadReceipt={handleUploadReceipt}
        />
      </div>

      {/* تحذير وقت */}
      {pendingPayments.length > 0 && (
        <div className="mt-6 p-3 bg-red-50 rounded-lg border border-red-100">
          <p className="text-xs text-red-600">
            ⏰ <strong>تنبيه:</strong> لو مرفعتش إيصال الدفع خلال 24 ساعة من إنشاء الطلب، هيتم إلغاؤه تلقائياً.
          </p>
        </div>
      )}

      {/* رابط العودة */}
      <div className="mt-6 text-center">
        <Link
          to={`/orders/${id}`}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          ← العودة لتفاصيل الطلب
        </Link>
      </div>
    </div>
  );
};

export default PaymentPage;
