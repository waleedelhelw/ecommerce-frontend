import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiShoppingCart, FiMoreHorizontal } from 'react-icons/fi';

const ICONS = {
  '/': FiHome,
  '/categories': FiGrid,
  '/cart': FiShoppingCart,
  '/sellers': FiMoreHorizontal,
};

const navItems = [
  { to: '/', label: 'الرئيسية' },
  { to: '/categories', label: 'الأقسام' },
  { to: '/cart', label: 'السلة' },
  { to: '/sellers', label: 'المتاجر' },
];

const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bootom">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ to, label }) => {
          const Icon = ICONS[to];
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 transition-colors ${
                isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {label}
              </span>
              {isActive && <div className="absolute -top-px w-8 h-0.5 bg-black rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
