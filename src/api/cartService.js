import API from './axiosInstance';

const cartService = {
  getCart: async () => {
    const response = await API.get('/customer/cart');
    console.log("🔍 Cart Response:", response.data);
    return response.data.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await API.post('/customer/cart', { productId, quantity });
    return response.data.data;
  },

  // ✅ cartItemId في الـ URL
  updateQuantity: async (cartItemId, quantity) => {
    const response = await API.put(`/customer/cart/${cartItemId}`, { quantity });
    return response.data.data;
  },

  // ✅ cartItemId مش productId
  removeFromCart: async (cartItemId) => {
    const response = await API.delete(`/customer/cart/${cartItemId}`);
    return response.data.data;
  },

  // ✅ مسار مختلف للمسح الكامل
  clearCart: async () => {
    const response = await API.delete('/customer/cart/clear');
    return response.data.data;
  },
};

export default cartService;