import API from '../axiosInstance';

const BASE = '/superadmin/reviews';

// ============ كل التقييمات ============
export const getAllReviews = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

// ============ موافقة على تقييم 🆕 ============
export const approveReview = async (id) => {
  const response = await API.put(`${BASE}/${id}/approve`);
  return response.data.data;
};

// ============ حذف تقييم ============
export const deleteReview = async (id) => {
  const response = await API.delete(`${BASE}/${id}`);
  return response.data.data;
};


// ✅ Default export للتوافق
const adminReviewService = {
  getReviews: getAllReviews,
  getAllReviews,
  approveReview,
  deleteReview,
};

export default adminReviewService;