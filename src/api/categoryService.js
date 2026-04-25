import API from './axiosInstance';

const BASE = '/customer/categories';

export const getCategories = async (params) => {
  const response = await API.get(BASE, { params });
  const result = response.data.data;

  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.items)) return result.items;
  return [];
};

export const getCategoryById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data;
};

const categoryService = {
  getCategories,
  getCategoryById,
  // ✅ ضيف الأسماء البديلة للتوافق
  getCategory: getCategoryById,
};

export default categoryService;