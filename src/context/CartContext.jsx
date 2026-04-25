import { createContext, useState, useEffect, useCallback } from 'react';
import cartService from '../api/cartService';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { ROLES } from '../utils/constants';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // ✅ الحل: استخدام ROLES.CUSTOMER بدل 'customer'
  const isCustomer = isAuthenticated && user?.role === ROLES.CUSTOMER;

  const fetchCart = useCallback(async () => {
    if (!isCustomer) {
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      return;
    }

    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCartItems(data.items || []);
      setCartCount(data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
      setCartTotal(data.totalPrice || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isCustomer]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isCustomer) {
      toast.error('يجب تسجيل الدخول كعميل أولاً');
      return;
    }
    try {
      await cartService.addToCart(productId, quantity);
      await fetchCart();
      toast.success('تم إضافة المنتج للسلة');
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إضافة المنتج');
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await cartService.updateQuantity(cartItemId, quantity);
      await fetchCart();
    } catch (error) {
      toast.error('فشل تحديث الكمية');
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId);
      await fetchCart();
      toast.success('تم حذف المنتج من السلة');
    } catch (error) {
      toast.error('فشل حذف المنتج');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      toast.success('تم مسح السلة');
    } catch (error) {
      toast.error('فشل مسح السلة');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};