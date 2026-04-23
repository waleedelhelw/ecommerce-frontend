import API from './axiosInstance';

const BASE = '/customer/categories';

export const getCategories = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data;
};

// ✅ Default export للتوافق مع الملفات القديمة
const categoryService = {
  getCategories,
  getCategoryById,
};

export default categoryService;