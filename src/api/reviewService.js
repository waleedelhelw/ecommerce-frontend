import API from './axiosInstance';

const reviewService = {
  getProductReviews: async (productId, params = {}) => {
    const response = await API.get(`/customer/reviews/product/${productId}`, { params });
    return response.data.data;
  },

  addReview: async (reviewData) => {
    const response = await API.post('/customer/reviews', reviewData);
    return response.data.data;
  },

  updateReview: async (id, reviewData) => {
    const response = await API.put(`/customer/reviews/${id}`, reviewData);
    return response.data.data;
  },

  deleteReview: async (id) => {
    const response = await API.delete(`/customer/reviews/${id}`);
    return response.data.data;
  },
};

export default reviewService;