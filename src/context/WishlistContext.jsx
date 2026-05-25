import { createContext, useState, useEffect } from 'react';
import wishlistService from '../api/wishlistService';
import useAuth from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);
  const { isAuthenticated, user } = useAuth();

  // ✅ الحل: استخدام ROLES.CUSTOMER بدل 'customer'
  const isCustomer = isAuthenticated && user?.role === ROLES.CUSTOMER;

  const fetchWishlist = async () => {
    if (!isCustomer) {
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
  }, [isAuthenticated, user?.role]);

  const addToWishlist = async (productId) => {
    try {
      await wishlistService.addToWishlist(productId);
      await fetchWishlist();
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      await wishlistService.removeFromWishlist(wishlistId);
      await fetchWishlist();
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

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