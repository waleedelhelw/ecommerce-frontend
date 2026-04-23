import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/common/LoadingScreen';
import { ROUTES } from '../utils/constants';

const CustomerRoute = ({ children }) => {
  const { isAuthenticated, isCustomer, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isCustomer) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return children;
};

export default CustomerRoute;