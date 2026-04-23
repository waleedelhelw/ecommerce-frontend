import { createContext, useState, useEffect } from 'react';
import wishlistService from '../api/wishlistService';
import useAuth from '../hooks/useAuth';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);
  const { isAuthenticated, isAdmin } = useAuth();

  // ✅ جلب المفضلة عند تسجيل الدخول
  const fetchWishlist = async () => {
    if (!isAuthenticated || isAdmin) {
      setWishlistCount(0);
      setWishlistItems([]);
      return;
    }
    try {
      const data = await wishlistService.getWishlist();
      const items = data.items || data || [];
      setWishlistItems(items);
      setWishlistCount(items.length);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  // ✅ إضافة للمفضلة
  const addToWishlist = async (productId) => {
    await wishlistService.addToWishlist(productId);
    await fetchWishlist(); // refresh
  };

  // ✅ حذف من المفضلة
  const removeFromWishlist = async (wishlistId) => {
    await wishlistService.removeFromWishlist(wishlistId);
    await fetchWishlist(); // refresh
  };

  // ✅ تحقق هل المنتج في المفضلة
  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => item.productId === productId || item.id === productId
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};