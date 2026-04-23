import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiSettings,
  FiPackage,
  FiShoppingBag,
} from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';

const Navbar = () => {
  const {
    user,
    isAuthenticated,
    isSuperAdmin,
    isSeller,
    isCustomer,
    logout,
    getRedirectPath,
  } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  // اسم المستخدم للعرض
  const displayName = () => {
    if (isSeller && user?.storeName) return user.storeName;
    return user?.name || 'المستخدم';
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <span className="text-xl font-bold text-blue-600">متجرنا</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              الرئيسية
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              المنتجات
            </Link>
            <Link to="/categories" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              التصنيفات
            </Link>
            <Link to="/sellers" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              المتاجر
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* أيقونات السلة والمفضلة - للعميل فقط */}
            {isAuthenticated && isCustomer && (
              <>
                <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-red-500 transition-colors">
                  <FiHeart size={22} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <FiShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {/* صورة البروفايل لو Google */}
                  {user?.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt="profile"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <FiUser size={20} />
                  )}
                  <span className="hidden md:block text-sm font-medium">
                    {displayName()}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute left-0 mt-2 w-52 bg-white rounded-lg shadow-lg border py-2 z-50">
                    {/* === SuperAdmin === */}
                    {isSuperAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiSettings size={16} />
                        لوحة التحكم
                      </Link>
                    )}

                    {/* === Seller === */}
                    {isSeller && (
                      <>
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiShoppingBag size={16} />
                          لوحة تحكم المتجر
                        </Link>
                        <Link
                          to="/seller/products"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiPackage size={16} />
                          منتجاتي
                        </Link>
                      </>
                    )}

                    {/* === Customer === */}
                    {isCustomer && (
                      <>
                        <Link
                          to="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiPackage size={16} />
                          طلباتي
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiUser size={16} />
                          الملف الشخصي
                        </Link>
                      </>
                    )}

                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <FiLogOut size={16} />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm px-4 py-2">
                  دخول
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  تسجيل
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 hover:text-blue-600">
              الرئيسية
            </Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 hover:text-blue-600">
              المنتجات
            </Link>
            <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 hover:text-blue-600">
              التصنيفات
            </Link>
            <Link to="/sellers" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 hover:text-blue-600">
              المتاجر
            </Link>

            {/* لينكات إضافية في الموبايل */}
            {!isAuthenticated && (
              <div className="mt-3 pt-3 border-t space-y-2">
                <Link to="/register-seller" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-green-600 hover:text-green-700 font-medium">
                  🏪 سجّل كبائع
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay لإغلاق القائمة */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)}></div>
      )}
    </nav>
  );
};

export default Navbar;