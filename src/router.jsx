import React, { Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';

// ✅ ScrollToTop
import ScrollToTop from './components/common/ScrollToTop';
import ForegroundMessageHandler from './components/fcm/ForegroundMessageHandler';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from './components/common/LoadingSpinner';

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

// Eager — critical for initial render
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetailsPage from './pages/customer/ProductDetailsPage';
import CategoryProductsPage from './pages/customer/CategoryProductsPage';
import CategoriesPage from './pages/customer/CategoriesPage';
import SellersPage from './pages/customer/SellersPage';
import SellerStorePage from './pages/customer/SellerStorePage';
import TrackingPage from './pages/public/TrackingPage';
import NotFoundPage from './pages/errors/NotFoundPage';

// Lazy loader utility
const lazyPage = (importFn) => {
  const Component = React.lazy(importFn);
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  );
};

// ✅ Root Wrapper
const RootLayout = () => (
  <>
    <ScrollToTop />
    <ForegroundMessageHandler />
    <Toaster position="top-center" />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
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
                {lazyPage(() => import('./pages/auth/LoginPage'))}
              </GuestRoute>
            ),
          },
          {
            path: '/register',
            element: (
              <GuestRoute>
                {lazyPage(() => import('./pages/auth/RegisterPage'))}
              </GuestRoute>
            ),
          },
          {
            path: '/register-seller',
            element: (
              <GuestRoute>
                {lazyPage(() => import('./pages/auth/RegisterSellerPage'))}
              </GuestRoute>
            ),
          },
          {
            path: '/verify-email',
            element: lazyPage(() => import('./pages/auth/VerifyEmailPage')),
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
          { path: '/offers', element: lazyPage(() => import('./pages/customer/OffersPage')) },
          { path: '/categories', element: <CategoriesPage /> },
          { path: '/categories/:id/products', element: <CategoryProductsPage /> },
          { path: '/sellers', element: <SellersPage /> },
          { path: '/sellers/:sellerId', element: <SellerStorePage /> },

          // Static Pages
          { path: '/about', element: lazyPage(() => import('./pages/static/AboutPage')) },
          { path: '/contact', element: lazyPage(() => import('./pages/static/ContactPage')) },
          { path: '/faq', element: lazyPage(() => import('./pages/static/FaqPage')) },
          { path: '/how-to-sell', element: lazyPage(() => import('./pages/static/HowToSellPage')) },
          { path: '/privacy', element: lazyPage(() => import('./pages/static/PrivacyPage')) },
          { path: '/terms', element: lazyPage(() => import('./pages/static/TermsPage')) },
          { path: '/shipping', element: lazyPage(() => import('./pages/static/ShippingPage')) },
          { path: '/return-policy', element: lazyPage(() => import('./pages/static/ReturnPolicyPage')) },
          { path: '/track/:trackingToken', element: <TrackingPage /> },

          // Customer Protected
          {
            path: '/cart',
            element: <CustomerRoute>{lazyPage(() => import('./pages/customer/CartPage'))}</CustomerRoute>,
          },
          {
            path: '/checkout',
            element: <CustomerRoute>{lazyPage(() => import('./pages/customer/CheckoutPage'))}</CustomerRoute>,
          },
          {
            path: '/orders',
            element: <CustomerRoute>{lazyPage(() => import('./pages/customer/OrdersPage'))}</CustomerRoute>,
          },
          {
            path: '/orders/:id',
            element: <CustomerRoute>{lazyPage(() => import('./pages/customer/OrderDetailsPage'))}</CustomerRoute>,
          },
          {
            path: '/orders/:id/payment',
            element: <CustomerRoute>{lazyPage(() => import('./pages/customer/PaymentPage'))}</CustomerRoute>,
          },
          {
            path: '/orders/:id/installments',
            element: <CustomerRoute>{lazyPage(() => import('./pages/customer/InstallmentPaymentPage'))}</CustomerRoute>,
          },

          // Returns
          {
            path: '/returns',
            element: <CustomerRoute>{lazyPage(() => import('./pages/customer/ReturnsListPage'))}</CustomerRoute>,
          },
          {
            path: '/returns/new/:orderId',
            element: <CustomerRoute>{lazyPage(() => import('./pages/customer/CreateReturnPage'))}</CustomerRoute>,
          },
          {
            path: '/returns/:id',
            element: <CustomerRoute>{lazyPage(() => import('./pages/customer/ReturnDetailsPage'))}</CustomerRoute>,
          },

          {
            path: '/wishlist',
            element: <CustomerRoute>{lazyPage(() => import('./pages/customer/WishlistPage'))}</CustomerRoute>,
          },
          {
            path: '/profile',
            element: (
              <ProtectedRoute>
                {lazyPage(() => import('./pages/customer/ProfilePage'))}
              </ProtectedRoute>
            ),
          },
          {
            path: '/change-password',
            element: (
              <ProtectedRoute>
                {lazyPage(() => import('./pages/auth/ChangePasswordPage'))}
              </ProtectedRoute>
            ),
          },

          // Errors
          { path: '/unauthorized', element: lazyPage(() => import('./pages/errors/UnauthorizedPage')) },
          { path: '/forbidden', element: lazyPage(() => import('./pages/errors/ForbiddenPage')) },
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
          { path: 'pending-approval', element: lazyPage(() => import('./pages/seller/SellerPendingPage')) },
          { path: 'suspended', element: lazyPage(() => import('./pages/seller/SellerSuspendedPage')) },
          { path: 'rejected', element: lazyPage(() => import('./pages/seller/SellerRejectedPage')) },
          {
            path: 'dashboard',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerDashboardPage'))}
              </SellerRoute>
            ),
          },
          {
            path: 'products',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerProductsPage'))}
              </SellerRoute>
            ),
          },
          {
            path: 'products/new',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerProductFormPage'))}
              </SellerRoute>
            ),
          },
          {
            path: 'products/:id/edit',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerProductFormPage'))}
              </SellerRoute>
            ),
          },
          {
            path: 'offers',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerOffersPage'))}
              </SellerRoute>
            ),
          },
          {
            path: 'offers/new',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerOfferFormPage'))}
              </SellerRoute>
            ),
          },
          {
            path: 'offers/:id/edit',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerOfferFormPage'))}
              </SellerRoute>
            ),
          },
          {
            path: 'orders',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerOrdersPage'))}
              </SellerRoute>
            ),
          },
          {
            path: 'orders/:id',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerOrderDetailsPage'))}
              </SellerRoute>
            ),
          },
          {
            path: 'returns',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerReturnsPage'))}
              </SellerRoute>
            ),
          },
          {
            path: 'returns/:id',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerReturnDetailsPage'))}
              </SellerRoute>
            ),
          },
          {
            path: 'finance',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerFinancePage'))}
              </SellerRoute>
            ),
          },
          // ✅ جديد — مناطق الشحن
          {
            path: 'shipping-zones',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerShippingZonesPage'))}
              </SellerRoute>
            ),
          },
          {
            path: 'payment-methods',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerPaymentMethodsPage'))}
              </SellerRoute>
            ),
          },
          {
            path: 'payouts',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerPayoutsPage'))}
              </SellerRoute>
            ),
          },
          {
            path: 'profile',
            element: (
              <SellerRoute>
                {lazyPage(() => import('./pages/seller/SellerProfilePage'))}
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
          { index: true, element: lazyPage(() => import('./pages/admin/DashboardPage')) },
          { path: 'dashboard', element: lazyPage(() => import('./pages/admin/DashboardPage')) },
          { path: 'sellers', element: lazyPage(() => import('./pages/admin/AdminSellersPage')) },
          { path: 'sellers/:id', element: lazyPage(() => import('./pages/admin/AdminSellerDetailsPage')) },
          { path: 'products', element: lazyPage(() => import('./pages/admin/AdminProductsPage')) },
          { path: 'categories', element: lazyPage(() => import('./pages/admin/AdminCategoriesPage')) },
          { path: 'categories/create', element: lazyPage(() => import('./pages/admin/AdminCategoryFormPage')) },
          { path: 'categories/edit/:id', element: lazyPage(() => import('./pages/admin/AdminCategoryFormPage')) },
          { path: 'orders', element: lazyPage(() => import('./pages/admin/AdminOrdersPage')) },
          { path: 'orders/:id', element: lazyPage(() => import('./pages/admin/AdminOrderDetailsPage')) },
          { path: 'returns', element: lazyPage(() => import('./pages/admin/AdminReturnsPage')) },
          { path: 'returns/:id', element: lazyPage(() => import('./pages/admin/AdminReturnDetailsPage')) },

          // 🆕 ✅ Installments
          { path: 'installments', element: lazyPage(() => import('./pages/admin/AdminInstallmentPlansPage')) },

          { path: 'users', element: lazyPage(() => import('./pages/admin/AdminUsersPage')) },
          { path: 'reviews', element: lazyPage(() => import('./pages/admin/AdminReviewsPage')) },
          { path: 'payouts', element: lazyPage(() => import('./pages/admin/AdminPayoutsPage')) },
          { path: 'logs', element: lazyPage(() => import('./pages/admin/AdminLogsPage')) },
          { path: 'payments', element: lazyPage(() => import('./pages/admin/AdminPaymentReviewPage')) },
          { path: 'settings', element: lazyPage(() => import('./pages/admin/AdminSettingsPage')) },
          { path: 'shipping', element: lazyPage(() => import('./pages/admin/AdminShippingOptionsPage')) },
        ],
      },
    ],
  },
]);

export default router;