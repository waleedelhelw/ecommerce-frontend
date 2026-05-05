import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getSellerProfile } from '../../api/seller/sellerProfileService';
import { ROUTES, SELLER_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';

const SellerPendingPage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(false);

  // ✅ جديد - logout صح مع navigate
  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  // ✅ جديد - تحقق من الحالة
  const handleCheckStatus = async () => {
    try {
      setChecking(true);

      const profile = await getSellerProfile();

      const status = profile?.status || profile?.sellerStatus;

      if (status === SELLER_STATUS.APPROVED) {
        // ✅ تم التفعيل → حدّث الـ context وروّح للداشبورد
        updateUser({
          sellerStatus: SELLER_STATUS.APPROVED,
          storeName: profile.storeName || user?.storeName,
        });
        toast.success('تم تفعيل حسابك! مرحباً بك في لوحة التحكم 🎉');
        navigate(ROUTES.SELLER_DASHBOARD, { replace: true });

      } else if (status === SELLER_STATUS.REJECTED) {
        updateUser({ sellerStatus: SELLER_STATUS.REJECTED });
        toast.error('تم رفض طلبك');
        navigate(ROUTES.SELLER_REJECTED, { replace: true });

      } else if (status === SELLER_STATUS.SUSPENDED) {
        updateUser({ sellerStatus: SELLER_STATUS.SUSPENDED });
        toast.error('تم تعليق حسابك');
        navigate(ROUTES.SELLER_SUSPENDED, { replace: true });

      } else {
        // لا يزال Pending
        toast('لا يزال طلبك قيد المراجعة', { icon: '⏳' });
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'فشل التحقق من الحالة، حاول مرة أخرى'
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {/* أيقونة */}
        <div className="text-6xl mb-4">⏳</div>

        {/* العنوان */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          في انتظار الموافقة
        </h1>

        {/* الرسالة */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          مرحباً{' '}
          <span className="font-medium text-gray-800">{user?.name}</span>،
          <br />
          تم استلام طلب تسجيلك كبائع
          {user?.storeName && (
            <>
              {' '}لمتجر{' '}
              <span className="font-medium text-green-600">
                "{user.storeName}"
              </span>
            </>
          )}
          .
          <br />
          سيتم مراجعة طلبك والرد عليك في أقرب وقت.
        </p>

        {/* معلومات إضافية */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-yellow-800">
          <p className="font-medium mb-1">⚡ ما الخطوة التالية؟</p>
          <ul className="text-right space-y-1">
            <li>• سيقوم مدير الموقع بمراجعة بياناتك</li>
            <li>• ستصلك رسالة عند الموافقة</li>
            <li>• بعد الموافقة تقدر تضيف منتجاتك وتبدأ البيع</li>
          </ul>
        </div>

        {/* الأزرار */}
        <div className="space-y-3">
          {/* ✅ جديد - زرار تحقق من الحالة */}
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="block w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {checking ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                جاري التحقق...
              </span>
            ) : (
              '🔄 تحقق من الحالة'
            )}
          </button>

          {/* تصفح المتجر */}
          <Link
            to="/"
            className="block w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            تصفح المتجر
          </Link>

          {/* ✅ جديد - logout مع navigate صح */}
          <button
            onClick={handleLogout}
            className="block w-full text-red-600 py-2.5 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerPendingPage;