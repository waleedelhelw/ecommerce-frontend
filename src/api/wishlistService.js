import API from './axiosInstance';

const wishlistService = {
  // جلب المفضلة
  getWishlist: async () => {
    const response = await API.get('/customer/wishlist');
    return response.data.data;
  },

  // إضافة للمفضلة
  addToWishlist: async (productId) => {
    const response = await API.post(`/customer/wishlist/${productId}`);
    return response.data.data;
  },

  // ✅ حذف من المفضلة - بالـ wishlistId مش productId
  removeFromWishlist: async (wishlistId) => {
    const response = await API.delete(`/customer/wishlist/${wishlistId}`);
    return response.data.data;
  },
};

export default wishlistService;