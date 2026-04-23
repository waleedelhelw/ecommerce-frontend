import API from '../axiosInstance';

const BASE = '/superadmin/categories';

// ============ كل الفئات ============
export const getAllCategories = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data;
};

// ============ إنشاء فئة ============
export const createCategory = async (data) => {
  const response = await API.post(BASE, data);
  return response.data.data;
};

// ============ تحديث فئة ============
export const updateCategory = async (id, data) => {
  const response = await API.put(`${BASE}/${id}`, data);
  return response.data.data;
};

// ============ حذف فئة ============
export const deleteCategory = async (id) => {
  const response = await API.delete(`${BASE}/${id}`);
  return response.data.data;
};

// ✅ ضيف ده
const adminCategoryService = {
  getCategories: getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default adminCategoryService;