import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import router from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RouterProvider router={router} />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);