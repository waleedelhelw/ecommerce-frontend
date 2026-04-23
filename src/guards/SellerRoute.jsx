import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/common/LoadingScreen';
import { ROUTES } from '../utils/constants';

const SellerRoute = ({ children }) => {
  const {
    isAuthenticated,
    isSeller,
    isSellerApproved,
    isSellerPending,
    isSellerSuspended,
    isSellerRejected,
    loading,
  } = useAuth();

  const location = useLocation();

  if (loading) return <LoadingScreen />;

  // مش مسجل دخول
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // مش بائع
  if (!isSeller) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  // صفحات الحالة - نسمح بيها بدون تحويل (عشان ميحصلش loop)
  const statusPages = [
    ROUTES.SELLER_PENDING,
    ROUTES.SELLER_SUSPENDED,
    ROUTES.SELLER_REJECTED,
  ];

  if (statusPages.includes(location.pathname)) {
    return children;
  }

  // البائع في الانتظار
  if (isSellerPending) {
    return <Navigate to={ROUTES.SELLER_PENDING} replace />;
  }

  // البائع موقوف
  if (isSellerSuspended) {
    return <Navigate to={ROUTES.SELLER_SUSPENDED} replace />;
  }

  // البائع مرفوض
  if (isSellerRejected) {
    return <Navigate to={ROUTES.SELLER_REJECTED} replace />;
  }

  // البائع معتمد - يقدر يدخل
  if (isSellerApproved) {
    return children;
  }

  // أي حالة تانية
  return <Navigate to={ROUTES.SELLER_PENDING} replace />;
};

export default SellerRoute;