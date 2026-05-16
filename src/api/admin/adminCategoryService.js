import API from '../axiosInstance';

const BASE = '/superadmin/categories';

// ============ كل الفئات ============
export const getAllCategories = async (params) => {
  const response = await API.get(BASE, { params });
  const result = response.data;

  return result;
};

// ============ فئة واحدة ============
export const getCategoryById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data || response.data;
};

// ============ إنشاء فئة ============
export const createCategory = async (data) => {
  const response = await API.post(BASE, data);
  return response.data.data || response.data;
};

// ============ تحديث فئة ============
export const updateCategory = async (id, data) => {
  const response = await API.put(`${BASE}/${id}`, data);
  return response.data.data || response.data;
};

// ============ حذف فئة ============
export const deleteCategory = async (id) => {
  const response = await API.delete(`${BASE}/${id}`);
  return response.data;
};

const adminCategoryService = {
  getCategories: getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default adminCategoryService;