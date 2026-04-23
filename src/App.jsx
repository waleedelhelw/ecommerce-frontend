import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';  // ✅ جديد
import router from './router';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>          {/* ✅ جديد */}
          <RouterProvider router={router} />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: 'Cairo, sans-serif',
                direction: 'rtl',
                borderRadius: '12px',
                padding: '12px 20px',
              },
              success: {
                style: {
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                },
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#f0fdf4',
                },
              },
              error: {
                style: {
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                },
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fef2f2',
                },
              },
            }}
          />
        </WishlistProvider>          {/* ✅ جديد */}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;