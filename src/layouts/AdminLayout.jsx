import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import Sidebar from '../components/common/Sidebar';
import useAuth from '../hooks/useAuth';
import useAdminNotificationCounts from '../hooks/useAdminNotificationCounts';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const counts = useAdminNotificationCounts();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} counts={counts} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full lg:w-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-3 sm:px-4 h-14 sm:h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiMenu size={22} />
            </button>

            <span className="lg:hidden text-sm font-bold text-blue-600">
              SuperAdmin
            </span>

            <div className="flex items-center gap-2 sm:gap-4 mr-auto">
              <div className="hidden sm:flex items-center gap-2">
                <FiUser size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'المدير'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                <FiLogOut size={16} />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;