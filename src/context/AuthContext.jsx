import { createContext, useState, useEffect, useCallback } from 'react';
import { ROLES, SELLER_STATUS, ROUTES } from '../utils/constants';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ============ تحميل بيانات المستخدم من localStorage ============
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (savedUser && token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (!isExpired) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // ============ تسجيل الدخول ============
  const login = useCallback((data) => {
    const userData = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      authProvider: data.authProvider || 'Local',
      profilePictureUrl: data.profilePictureUrl || null,
      storeName: data.storeName || null,
      sellerStatus: data.sellerStatus || null,
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // ============ تسجيل الخروج ============
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ============ تحديث بيانات المستخدم ============
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  // ============ تحديث التوكن ============
  const updateToken = useCallback((newToken, newRefreshToken) => {
    localStorage.setItem('token', newToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }
  }, []);

  // ============ Role Checks ============
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;
  const isSeller = user?.role === ROLES.SELLER;
  const isCustomer = user?.role === ROLES.CUSTOMER;

  // ============ Seller Status Checks ============
  const isSellerApproved = isSeller && user?.sellerStatus === SELLER_STATUS.APPROVED;
  const isSellerPending = isSeller && user?.sellerStatus === SELLER_STATUS.PENDING;
  const isSellerSuspended = isSeller && user?.sellerStatus === SELLER_STATUS.SUSPENDED;
  const isSellerRejected = isSeller && user?.sellerStatus === SELLER_STATUS.REJECTED;

  // ============ Other Checks ============
  const isGoogleUser = user?.authProvider === 'Google';

  // ============ التوجيه بعد تسجيل الدخول ============
  const getRedirectPath = useCallback(() => {
    if (!user) return ROUTES.LOGIN;

    switch (user.role) {
      case ROLES.SUPER_ADMIN:
        return ROUTES.ADMIN_DASHBOARD;

      case ROLES.SELLER:
        switch (user.sellerStatus) {
          case SELLER_STATUS.APPROVED:
            return ROUTES.SELLER_DASHBOARD;
          case SELLER_STATUS.PENDING:
            return ROUTES.SELLER_PENDING;
          case SELLER_STATUS.SUSPENDED:
            return ROUTES.SELLER_SUSPENDED;
          case SELLER_STATUS.REJECTED:
            return ROUTES.SELLER_REJECTED;
          default:
            return ROUTES.SELLER_PENDING;
        }

      case ROLES.CUSTOMER:
        return ROUTES.HOME;

      default:
        return ROUTES.HOME;
    }
  }, [user]);

  // ============ القيم المتاحة ============
  const value = {
    user,
    isAuthenticated,
    loading,

    login,
    logout,
    updateUser,
    updateToken,

    isSuperAdmin,
    isSeller,
    isCustomer,

    isSellerApproved,
    isSellerPending,
    isSellerSuspended,
    isSellerRejected,

    isGoogleUser,

    getRedirectPath,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;