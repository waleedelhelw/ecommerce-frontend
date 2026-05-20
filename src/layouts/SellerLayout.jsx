import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut, FiUser, FiGrid } from 'react-icons/fi';
import SellerSidebar from '../components/seller/SellerSidebar';
import useAuth from '../hooks/useAuth';
import useSellerNotificationCounts from '../hooks/useSellerNotificationCounts';

const SellerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isSellerApproved } = useAuth();
  const counts = useSellerNotificationCounts();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      {isSellerApproved && (
        <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} counts={counts} />
      )}

      <div className="flex-1 flex flex-col min-h-screen w-full lg:w-auto">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-l from-emerald-500 via-green-500 to-teal-400" />

        {/* Top Bar */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            {isSellerApproved && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FiMenu size={20} />
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
                <FiGrid size={18} className="text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-800 block leading-tight">
                  {user?.storeName || 'متجري'}
                </span>
                <span className="text-[10px] text-gray-400">لوحة تحكم البائع</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mr-auto">
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                  {user?.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt="profile"
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <FiUser size={14} className="text-white" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'البائع'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <FiLogOut size={15} />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;