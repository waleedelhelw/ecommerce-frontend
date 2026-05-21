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

  const displayName = () => {
    if (isSeller && user?.storeName) return user.storeName;
    return user?.name || 'المستخدم';
  };

  return (
    <nav
      className="bg-white shadow-sm sticky top-0 z-40"
      aria-label="شريط التنقل الرئيسي"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ✅ Logo - تسوّق */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="تسوّق - الصفحة الرئيسية"
          >
            <div className="relative">
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
                aria-hidden="true"
              >
                <FiShoppingBag className="text-white" size={22} />
              </div>
            </div>
            <span className="text-2xl font-extrabold brand-text-gradient">
              تسوّق
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div
            className="hidden md:flex items-center gap-6"
            role="menubar"
          >
            <Link
              to="/"
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
              role="menuitem"
            >
              الرئيسية
            </Link>
            <Link
              to="/products"
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
              role="menuitem"
            >
              المنتجات
            </Link>
            <Link
              to="/offers"
              className="text-amber-600 hover:text-orange-600 transition-colors font-medium"
              role="menuitem"
            >
              🔥 العروض
            </Link>
            <Link
              to="/categories"
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
              role="menuitem"
            >
              التصنيفات
            </Link>
            <Link
              to="/sellers"
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
              role="menuitem"
            >
              المتاجر
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && isCustomer && (
              <>
                <Link
                  to="/wishlist"
                  className="relative p-2 text-gray-600 hover:text-red-500 transition-colors"
                  aria-label={`المفضلة${wishlistCount > 0 ? ` - ${wishlistCount} عنصر` : ''}`}
                >
                  <FiHeart size={22} aria-hidden="true" />
                  {wishlistCount > 0 && (
                    <span
                      className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  aria-label={`سلة التسوق${cartCount > 0 ? ` - ${cartCount} عنصر` : ''}`}
                >
                  <FiShoppingCart size={22} aria-hidden="true" />
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-1 -left-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      aria-hidden="true"
                    >
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
                  aria-label={`قائمة ${displayName()}`}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  {user?.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt={`صورة ${displayName()}`}
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-200"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <FiUser size={14} className="text-white" />
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium">
                    {displayName()}
                  </span>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute left-0 mt-2 w-52 bg-white rounded-lg shadow-lg border py-2 z-50"
                    role="menu"
                  >
                    {isSuperAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                        role="menuitem"
                      >
                        <FiSettings size={16} aria-hidden="true" />
                        لوحة التحكم
                      </Link>
                    )}

                    {isSeller && (
                      <>
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                          role="menuitem"
                        >
                          <FiShoppingBag size={16} aria-hidden="true" />
                          لوحة تحكم المتجر
                        </Link>
                        <Link
                          to="/seller/products"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                          role="menuitem"
                        >
                          <FiPackage size={16} aria-hidden="true" />
                          منتجاتي
                        </Link>
                      </>
                    )}

                    {isCustomer && (
                      <>
                        <Link
                          to="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                          role="menuitem"
                        >
                          <FiPackage size={16} aria-hidden="true" />
                          طلباتي
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                          role="menuitem"
                        >
                          <FiUser size={16} aria-hidden="true" />
                          الملف الشخصي
                        </Link>
                      </>
                    )}

                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      role="menuitem"
                    >
                      <FiLogOut size={16} aria-hidden="true" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="btn-outline text-sm px-4 py-2"
                  aria-label="تسجيل الدخول"
                >
                  دخول
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-4 py-2"
                  aria-label="إنشاء حساب جديد"
                >
                  تسجيل
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600"
              aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <FiX size={24} aria-hidden="true" />
              ) : (
                <FiMenu size={24} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden py-4 border-t"
            role="menu"
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-600 hover:text-purple-600"
              role="menuitem"
            >
              الرئيسية
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-600 hover:text-purple-600"
              role="menuitem"
            >
              المنتجات
            </Link>
            <Link
              to="/offers"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-amber-600 hover:text-orange-600"
              role="menuitem"
            >
              🔥 العروض
            </Link>
            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-600 hover:text-purple-600"
              role="menuitem"
            >
              التصنيفات
            </Link>
            <Link
              to="/sellers"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-600 hover:text-purple-600"
              role="menuitem"
            >
              المتاجر
            </Link>

            {!isAuthenticated && (
              <div className="mt-3 pt-3 border-t space-y-2">
                <Link
                  to="/register-seller"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-green-600 hover:text-green-700 font-medium"
                  role="menuitem"
                >
                  <span aria-hidden="true">🏪</span> سجّل كبائع
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {userMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setUserMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </nav>
  );
};

export default Navbar;