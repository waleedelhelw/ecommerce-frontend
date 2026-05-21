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
  FiTag,
} from 'react-icons/fi';

const iconMap = {
  dashboard: <FiHome size={18} />,
  products: <FiPackage size={18} />,
  offers: <FiTag size={18} />,
  orders: <FiShoppingBag size={18} />,
  returns: <FiRefreshCw size={18} />,
  finance: <FiTrendingUp size={18} />,
  shipping: <FiTruck size={18} />,
  payment: <FiCreditCard size={18} />,
  payouts: <FiDollarSign size={18} />,
  profile: <FiSettings size={18} />,
};

const iconBgMap = {
  dashboard: 'from-emerald-500 to-green-600',
  products: 'from-violet-500 to-purple-600',
  offers: 'from-amber-500 to-orange-600',
  orders: 'from-blue-500 to-indigo-600',
  returns: 'from-orange-500 to-amber-600',
  finance: 'from-cyan-500 to-teal-600',
  shipping: 'from-rose-500 to-pink-600',
  payment: 'from-amber-500 to-yellow-600',
  payouts: 'from-emerald-500 to-teal-600',
  profile: 'from-gray-500 to-slate-600',
};

const SellerSidebar = ({ isOpen, onClose, counts = {} }) => {
  const location = useLocation();

  const menuItems = [
    { key: 'dashboard', path: '/seller/dashboard', label: 'لوحة التحكم', exact: true },
    { key: 'products', path: '/seller/products', label: 'منتجاتي' },
    { key: 'offers', path: '/seller/offers', label: 'العروض' },
    { key: 'orders', path: '/seller/orders', label: 'طلباتي', badge: counts.pendingOrders },
    { key: 'returns', path: '/seller/returns', label: 'طلبات الإرجاع' },
    { key: 'finance', path: '/seller/finance', label: 'المركز المالي', badge: counts.pendingPayments },
    { key: 'shipping', path: '/seller/shipping-zones', label: 'مناطق الشحن' },
    { key: 'payment', path: '/seller/payment-methods', label: 'طرق الدفع' },
    { key: 'payouts', path: '/seller/payouts', label: 'سحب الأرباح' },
    { key: 'profile', path: '/seller/profile', label: 'إعدادات المتجر' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:translate-x-0 lg:shadow-none lg:border-l lg:border-gray-100 lg:z-auto
          flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 shrink-0 border-b border-gray-50">
          <Link to="/seller/dashboard" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
              <FiShoppingBag size={18} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-800 block leading-tight">لوحة البائع</span>
              <span className="text-[10px] text-gray-400">تسوّق</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm
                  ${active
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 font-semibold shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                  ${active
                    ? `bg-gradient-to-br ${iconBgMap[item.key]} text-white shadow-sm`
                    : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                  }`}
                >
                  {iconMap[item.key]}
                </div>
                <span className="flex-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className="min-w-[22px] h-5 flex items-center justify-center bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-full px-1.5 shadow-sm">
                    {item.badge}
                  </span>
                )}
                {active && (
                  <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-green-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-50 shrink-0">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <FiArrowRight size={16} />
            </div>
            <span>العودة للمتجر</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default SellerSidebar;