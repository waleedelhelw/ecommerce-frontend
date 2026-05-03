import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorMessage from '../../components/common/ErrorMessage';
import ReturnRequestForm from '../../components/return/ReturnRequestForm';
import orderService from '../../api/orderService';
import { checkOrderReturnable } from '../../utils/returnStatusMap';

const CreateReturnPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returnableInfo, setReturnableInfo] = useState(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrder(orderId);
      setOrder(data);
      setReturnableInfo(checkOrderReturnable(data));
    } catch (err) {
      setError('فشل فى تحميل بيانات الطلب');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrder} />;
  if (!order) return <ErrorMessage message="الطلب غير موجود" />;

  // التحقق من إمكانية الإرجاع
  if (!returnableInfo?.canReturn) {
    return (
      <>
        <SEO title="طلب إرجاع" noindex />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Breadcrumb
            items={[
              { label: 'الرئيسية', link: '/' },
              { label: 'طلباتى', link: '/orders' },
              { label: `طلب #${order.id}`, link: `/orders/${order.id}` },
              { label: 'طلب إرجاع' },
            ]}
          />

          <div className="bg-white rounded-xl border p-8 text-center">
            <FiAlertCircle
              size={64}
              className="text-orange-500 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold mb-2">
              لا يمكن طلب الإرجاع
            </h1>
            <p className="text-gray-600 mb-6">{returnableInfo.reason}</p>

            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                to={`/orders/${order.id}`}
                className="btn-secondary"
              >
                ← رجوع للطلب
              </Link>
              <Link to="/orders" className="btn-primary">
                طلباتى
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`طلب إرجاع - طلب #${order.id}`}
        description="إنشاء طلب إرجاع لمنتج أو أكثر من الطلب"
        noindex
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'الرئيسية', link: '/' },
            { label: 'طلباتى', link: '/orders' },
            { label: `طلب #${order.id}`, link: `/orders/${order.id}` },
            { label: 'طلب إرجاع' },
          ]}
        />

        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <FiRefreshCw /> طلب إرجاع - طلب #{order.id}
          </h1>
          <p className="text-sm text-gray-500">
            متبقى <strong className="text-orange-600">
              {returnableInfo.daysLeft} يوم
            </strong> من فترة الإرجاع المسموحة (14 يوم)
          </p>
        </div>

        <ReturnRequestForm order={order} />
      </div>
    </>
  );
};

export default CreateReturnPage;