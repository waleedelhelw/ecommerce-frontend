import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import InstallmentTimeline from '../../components/order/InstallmentTimeline';
import PayInstallmentModal from '../../components/order/PayInstallmentModal';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorMessage from '../../components/common/ErrorMessage';
import orderService from '../../api/orderService';
import installmentService from '../../api/installmentService';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const InstallmentPaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [orderData, installmentsData] = await Promise.all([
        orderService.getOrder(id),
        installmentService.getOrderInstallments(id),
      ]);
      setOrder(orderData);
      setInstallments(installmentsData || []);

      // لو مفيش تقسيط → ارجع لصفحة الطلب
      if (!orderData.isInstallment && !orderData.installmentPlanId) {
        navigate(`/orders/${id}`);
        return;
      }

      // Auto-open modal للدفعة الأولى لو لسه pending
      const firstPending = (installmentsData || []).find(
        i => (i.status === 'Pending' || i.status === 'Overdue')
      );
      if (firstPending) {
        setSelectedInstallment(firstPending);
        setShowPayModal(true);
      }
    } catch (err) {
      setError('فشل في تحميل بيانات الطلب');
    } finally {
      setLoading(false);
    }
  };

  const handlePayInstallment = (installment) => {
    setSelectedInstallment(installment);
    setShowPayModal(true);
  };

  const handlePaySuccess = () => {
    toast.success('تم رفع إيصال الدفع! جاري المراجعة 🧾');
    fetchData();
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  if (!order) return <ErrorMessage message="الطلب غير موجود" />;

  const totalAmount = installments.reduce((sum, i) => sum + i.amount, 0);
  const paidAmount = installments.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const nextPending = installments.find(i => i.status === 'Pending' || i.status === 'Overdue');

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'الرئيسية', link: '/' },
          { label: 'طلباتي', link: '/orders' },
          { label: `طلب #${order.id}`, link: `/orders/${order.id}` },
          { label: 'دفع الأقساط' },
        ]}
      />

      <h1 className="text-2xl font-bold mb-2">📋 دفع أقساط الطلب #{order.id}</h1>
      <p className="text-gray-500 mb-6">ادفع الدفعات المطلوبة عشان الطلب يتقدم</p>

      {/* ملخص سريع */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-xs text-blue-600 mb-1">الإجمالي</p>
          <p className="text-lg font-bold text-blue-700">{formatPrice(totalAmount)}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-xs text-green-600 mb-1">المدفوع</p>
          <p className="text-lg font-bold text-green-700">{formatPrice(paidAmount)}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <p className="text-xs text-orange-600 mb-1">المتبقي</p>
          <p className="text-lg font-bold text-orange-700">{formatPrice(totalAmount - paidAmount)}</p>
        </div>
      </div>

      {/* الدفعة التالية */}
      {nextPending && (
        <div className="bg-gradient-to-l from-blue-600 to-blue-700 text-white rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">الدفعة التالية المطلوبة:</p>
              <p className="text-3xl font-bold mt-1">{formatPrice(nextPending.amount)}</p>
              <p className="text-blue-200 text-sm mt-1">
                الدفعة {nextPending.installmentNumber} من {installments.length}
              </p>
            </div>
            <button
              onClick={() => handlePayInstallment(nextPending)}
              className={`px-8 py-4 rounded-xl font-bold text-lg shadow-md transition-all ${
                nextPending.status === 'Overdue'
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-white text-blue-700 hover:bg-blue-50'
              }`}
            >
              {nextPending.status === 'Overdue' ? '🚨 ادفع فوراً!' : '💳 ادفع الآن'}
            </button>
          </div>
        </div>
      )}

      {/* كل الدفعات مدفوعة */}
      {!nextPending && installments.length > 0 && (
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-6 text-center">
          <span className="text-4xl block mb-2">🎉</span>
          <h3 className="text-xl font-bold text-green-800">تم دفع كل الأقساط!</h3>
          <p className="text-green-600 mt-1">شكراً لك. الطلب مكتمل الدفع.</p>
        </div>
      )}

      {/* جدول الدفعات */}
      <InstallmentTimeline
        installments={installments}
        showPayButton={true}
        onPayClick={handlePayInstallment}
      />

      {/* رجوع */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(`/orders/${order.id}`)}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← رجوع لتفاصيل الطلب
        </button>
      </div>

      {/* Modal الدفع */}
      <PayInstallmentModal
        installment={selectedInstallment}
        isOpen={showPayModal}
        onClose={() => {
          setShowPayModal(false);
          setSelectedInstallment(null);
        }}
        onSuccess={handlePaySuccess}
      />
    </div>
  );
};

export default InstallmentPaymentPage;