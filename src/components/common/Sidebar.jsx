import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiGrid,
  FiShoppingBag,
  FiUsers,
  FiStar,
  FiFileText,
  FiArrowRight,
  FiX,
  FiDollarSign,
  FiUserCheck,
  FiCreditCard,
  FiSettings,
  FiTruck,
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: <FiHome size={20} />, label: 'لوحة التحكم', exact: true },
    { path: '/admin/sellers', icon: <FiUserCheck size={20} />, label: 'البائعين' },
    { path: '/admin/products', icon: <FiPackage size={20} />, label: 'المنتجات' },
    { path: '/admin/categories', icon: <FiGrid size={20} />, label: 'التصنيفات' },
    { path: '/admin/orders', icon: <FiShoppingBag size={20} />, label: 'الطلبات' },
    { path: '/admin/payments', icon: <FiCreditCard size={20} />, label: 'مراجعة الإيصالات', badge: true },
    { path: '/admin/users', icon: <FiUsers size={20} />, label: 'المستخدمين' },
    { path: '/admin/reviews', icon: <FiStar size={20} />, label: 'التقييمات' },
    { path: '/admin/payouts', icon: <FiDollarSign size={20} />, label: 'السحوبات' },
    { path: '/admin/shipping', icon: <FiTruck size={20} />, label: 'خيارات الشحن' },
    { path: '/admin/settings', icon: <FiSettings size={20} />, label: 'الإعدادات' },
    { path: '/admin/logs', icon: <FiFileText size={20} />, label: 'السجلات' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay - موبايل فقط */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
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
          <Link to="/admin" onClick={onClose} className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <span className="text-base font-bold text-blue-600">SuperAdmin</span>
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
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t shrink-0">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors px-3 py-2"
          >
            <FiArrowRight size={16} />
            <span>العودة للمتجر</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;