import { createContext, useState, useEffect, useCallback } from 'react';
import cartService from '../api/cartService';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

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
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartService.addToCart(productId, quantity);
      await fetchCart();
      toast.success('تم إضافة المنتج للسلة');
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إضافة المنتج');
    }
  };

  // ✅ cartItemId
  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await cartService.updateQuantity(cartItemId, quantity);
      await fetchCart();
    } catch (error) {
      toast.error('فشل تحديث الكمية');
    }
  };

  // ✅ cartItemId مش productId
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