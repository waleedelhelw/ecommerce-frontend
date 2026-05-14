import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiSettings,
  FiArrowRight,
  FiX,
  FiRefreshCw,
  FiTrendingUp,
  FiTruck,
  FiCreditCard,
} from 'react-icons/fi';

const SellerSidebar = ({ isOpen, onClose, counts = {} }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/seller/dashboard', icon: <FiHome size={20} />, label: 'لوحة التحكم', exact: true },
    { path: '/seller/products', icon: <FiPackage size={20} />, label: 'منتجاتي' },
    { path: '/seller/orders', icon: <FiShoppingBag size={20} />, label: 'طلباتي', badge: counts.pendingOrders },
    { path: '/seller/returns', icon: <FiRefreshCw size={20} />, label: 'طلبات الإرجاع' },
    { path: '/seller/finance', icon: <FiTrendingUp size={20} />, label: 'المركز المالي', badge: counts.pendingPayments },
    { path: '/seller/shipping-zones', icon: <FiTruck size={20} />, label: 'مناطق الشحن' },
    { path: '/seller/payment-methods', icon: <FiCreditCard size={20} />, label: 'طرق الدفع' },
    { path: '/seller/payouts', icon: <FiDollarSign size={20} />, label: 'سحب الأرباح' },
    { path: '/seller/profile', icon: <FiSettings size={20} />, label: 'إعدادات المتجر' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:translate-x-0 lg:shadow-none lg:border-l lg:z-auto
          flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b h-14 sm:h-16 shrink-0">
          <Link to="/seller/dashboard" onClick={onClose} className="flex items-center gap-2">
            <span className="text-xl">🏪</span>
            <span className="text-base font-bold text-green-600">لوحة البائع</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm
                ${isActive(item.path, item.exact)
                  ? 'bg-green-50 text-green-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className="min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-[11px] font-bold rounded-full px-1.5">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t shrink-0">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors px-3 py-2"
          >
            <FiArrowRight size={16} />
            <span>العودة للمتجر</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default SellerSidebar;