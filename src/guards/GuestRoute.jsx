import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/common/LoadingScreen';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, getRedirectPath, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (isAuthenticated) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  return children;
};

export default GuestRoute;