import { createBrowserRouter, Outlet } from 'react-router-dom';

// ✅ ScrollToTop
import ScrollToTop from './components/common/ScrollToTop';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import SellerLayout from './layouts/SellerLayout';
import AuthLayout from './layouts/AuthLayout';

// Guards
import ProtectedRoute from './guards/ProtectedRoute';
import SuperAdminRoute from './guards/SuperAdminRoute';
import SellerRoute from './guards/SellerRoute';
import CustomerRoute from './guards/CustomerRoute';
import GuestRoute from './guards/GuestRoute';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetailsPage from './pages/customer/ProductDetailsPage';
import CategoryProductsPage from './pages/customer/CategoryProductsPage';
import CategoriesPage from './pages/customer/CategoriesPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailsPage from './pages/customer/OrderDetailsPage';
import WishlistPage from './pages/customer/WishlistPage';
import ProfilePage from './pages/customer/ProfilePage';
import SellersPage from './pages/customer/SellersPage';
import SellerStorePage from './pages/customer/SellerStorePage';
import PaymentPage from './pages/customer/PaymentPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RegisterSellerPage from './pages/auth/RegisterSellerPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Seller Pages
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import SellerProductsPage from './pages/seller/SellerProductsPage';
import SellerProductFormPage from './pages/seller/SellerProductFormPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerOrderDetailsPage from './pages/seller/SellerOrderDetailsPage';
import SellerPayoutsPage from './pages/seller/SellerPayoutsPage';
import SellerProfilePage from './pages/seller/SellerProfilePage';
import SellerPendingPage from './pages/seller/SellerPendingPage';
import SellerSuspendedPage from './pages/seller/SellerSuspendedPage';
import SellerRejectedPage from './pages/seller/SellerRejectedPage';
import SellerFinancePage from './pages/seller/SellerFinancePage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminCategoryFormPage from './pages/admin/AdminCategoryFormPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailsPage from './pages/admin/AdminOrderDetailsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminLogsPage from './pages/admin/AdminLogsPage';
import AdminSellersPage from './pages/admin/AdminSellersPage';
import AdminSellerDetailsPage from './pages/admin/AdminSellerDetailsPage';
import AdminPayoutsPage from './pages/admin/AdminPayoutsPage';
import AdminPaymentReviewPage from './pages/admin/AdminPaymentReviewPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminShippingOptionsPage from './pages/admin/AdminShippingOptionsPage';
import AdminReturnsPage from './pages/admin/AdminReturnsPage';
import AdminReturnDetailsPage from './pages/admin/AdminReturnDetailsPage';

// Error Pages
import NotFoundPage from './pages/errors/NotFoundPage';
import UnauthorizedPage from './pages/errors/UnauthorizedPage';
import ForbiddenPage from './pages/errors/ForbiddenPage';

// Static Pages
import AboutPage from './pages/static/AboutPage';
import ContactPage from './pages/static/ContactPage';
import FaqPage from './pages/static/FaqPage';
import HowToSellPage from './pages/static/HowToSellPage';
import PrivacyPage from './pages/static/PrivacyPage';
import TermsPage from './pages/static/TermsPage';
import ShippingPage from './pages/static/ShippingPage';
import ReturnPolicyPage from './pages/static/ReturnPolicyPage';

// Returns System Pages
import ReturnsListPage from './pages/customer/ReturnsListPage';
import ReturnDetailsPage from './pages/customer/ReturnDetailsPage';
import CreateReturnPage from './pages/customer/CreateReturnPage';
import SellerReturnsPage from './pages/seller/SellerReturnsPage';
import SellerReturnDetailsPage from './pages/seller/SellerReturnDetailsPage';

// ✅ Root Wrapper - يحط ScrollToTop في كل الصفحات
const RootLayout = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />, // ✅ كل الـ routes هتمر من هنا الأول
    children: [
      // ══════════════════════════════════════════
      // صفحات المصادقة (Auth)
      // ══════════════════════════════════════════
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: (
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            ),
          },
          {
            path: '/register',
            element: (
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            ),
          },
          {
            path: '/register-seller',
            element: (
              <GuestRoute>
                <RegisterSellerPage />
              </GuestRoute>
            ),
          },
          {
            path: '/verify-email',
            element: <VerifyEmailPage />,
          },
        ],
      },

      // ══════════════════════════════════════════
      // صفحات العميل (Customer + Public)
      // ══════════════════════════════════════════
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/products', element: <ProductsPage /> },
          { path: '/products/:id', element: <ProductDetailsPage /> },
          { path: '/categories', element: <CategoriesPage /> },
          { path: '/categories/:id/products', element: <CategoryProductsPage /> },
          { path: '/sellers', element: <SellersPage /> },
          { path: '/sellers/:sellerId', element: <SellerStorePage /> },

          // Static Pages
          { path: '/about', element: <AboutPage /> },
          { path: '/contact', element: <ContactPage /> },
          { path: '/faq', element: <FaqPage /> },
          { path: '/how-to-sell', element: <HowToSellPage /> },
          { path: '/privacy', element: <PrivacyPage /> },
          { path: '/terms', element: <TermsPage /> },
          { path: '/shipping', element: <ShippingPage /> },
          { path: '/return-policy', element: <ReturnPolicyPage /> },

          // Customer Protected
          {
            path: '/cart',
            element: (
              <CustomerRoute>
                <CartPage />
              </CustomerRoute>
            ),
          },
          {
            path: '/checkout',
            element: (
              <CustomerRoute>
                <CheckoutPage />
              </CustomerRoute>
            ),
          },
          {
            path: '/orders',
            element: (
              <CustomerRoute>
                <OrdersPage />
              </CustomerRoute>
            ),
          },
          {
            path: '/orders/:id',
            element: (
              <CustomerRoute>
                <OrderDetailsPage />
              </CustomerRoute>
            ),
          },
          {
            path: '/orders/:id/payment',
            element: (
              <CustomerRoute>
                <PaymentPage />
              </CustomerRoute>
            ),
          },

          // Returns
          {
            path: '/returns',
            element: (
              <CustomerRoute>
                <ReturnsListPage />
              </CustomerRoute>
            ),
          },
          {
            path: '/returns/new/:orderId',
            element: (
              <CustomerRoute>
                <CreateReturnPage />
              </CustomerRoute>
            ),
          },
          {
            path: '/returns/:id',
            element: (
              <CustomerRoute>
                <ReturnDetailsPage />
              </CustomerRoute>
            ),
          },

          {
            path: '/wishlist',
            element: (
              <CustomerRoute>
                <WishlistPage />
              </CustomerRoute>
            ),
          },
          {
            path: '/profile',
            element: (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/change-password',
            element: (
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            ),
          },

          // Errors
          { path: '/unauthorized', element: <UnauthorizedPage /> },
          { path: '/forbidden', element: <ForbiddenPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },

      // ══════════════════════════════════════════
      // لوحة تحكم البائع (Seller)
      // ══════════════════════════════════════════
      {
        path: '/seller',
        element: <SellerLayout />,
        children: [
          { path: 'pending-approval', element: <SellerPendingPage /> },
          { path: 'suspended', element: <SellerSuspendedPage /> },
          { path: 'rejected', element: <SellerRejectedPage /> },
          {
            path: 'dashboard',
            element: (
              <SellerRoute>
                <SellerDashboardPage />
              </SellerRoute>
            ),
          },
          {
            path: 'products',
            element: (
              <SellerRoute>
                <SellerProductsPage />
              </SellerRoute>
            ),
          },
          {
            path: 'products/new',
            element: (
              <SellerRoute>
                <SellerProductFormPage />
              </SellerRoute>
            ),
          },
          {
            path: 'products/:id/edit',
            element: (
              <SellerRoute>
                <SellerProductFormPage />
              </SellerRoute>
            ),
          },
          {
            path: 'orders',
            element: (
              <SellerRoute>
                <SellerOrdersPage />
              </SellerRoute>
            ),
          },
          {
            path: 'orders/:id',
            element: (
              <SellerRoute>
                <SellerOrderDetailsPage />
              </SellerRoute>
            ),
          },
          {
            path: 'returns',
            element: (
              <SellerRoute>
                <SellerReturnsPage />
              </SellerRoute>
            ),
          },
          {
            path: 'returns/:id',
            element: (
              <SellerRoute>
                <SellerReturnDetailsPage />
              </SellerRoute>
            ),
          },

          {
            path: 'finance',
            element: (
              <SellerRoute>
                <SellerFinancePage />
              </SellerRoute>
            ),
          },

          {
            path: 'payouts',
            element: (
              <SellerRoute>
                <SellerPayoutsPage />
              </SellerRoute>
            ),
          },
          {
            path: 'profile',
            element: (
              <SellerRoute>
                <SellerProfilePage />
              </SellerRoute>
            ),
          },
        ],
      },

      // ══════════════════════════════════════════
      // لوحة تحكم السوبر أدمن (SuperAdmin)
      // ══════════════════════════════════════════
      {
        path: '/admin',
        element: (
          <SuperAdminRoute>
            <AdminLayout />
          </SuperAdminRoute>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'sellers', element: <AdminSellersPage /> },
          { path: 'sellers/:id', element: <AdminSellerDetailsPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'categories', element: <AdminCategoriesPage /> },
          { path: 'categories/create', element: <AdminCategoryFormPage /> },
          { path: 'categories/edit/:id', element: <AdminCategoryFormPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'orders/:id', element: <AdminOrderDetailsPage /> },
          { path: 'returns', element: <AdminReturnsPage /> },
          { path: 'returns/:id', element: <AdminReturnDetailsPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'reviews', element: <AdminReviewsPage /> },
          { path: 'payouts', element: <AdminPayoutsPage /> },
          { path: 'logs', element: <AdminLogsPage /> },
          { path: 'payments', element: <AdminPaymentReviewPage /> },
          { path: 'settings', element: <AdminSettingsPage /> },
          { path: 'shipping', element: <AdminShippingOptionsPage /> },
        ],
      },
    ],
  },
]);

export default router;