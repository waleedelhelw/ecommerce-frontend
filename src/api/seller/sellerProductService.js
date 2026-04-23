import API from '../axiosInstance';

const BASE = '/seller/products';

// ============ منتجاتي ============
export const getMyProducts = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

// ============ منتج بالمعرّف ============
export const getMyProductById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data;
};

// ============ إنشاء منتج (مع صور متعددة) ============
export const createProduct = async (data) => {
  const response = await API.post(BASE, data);
  return response.data.data;
};

// ============ تحديث منتج ============
export const updateProduct = async (id, data) => {
  const response = await API.put(`${BASE}/${id}`, data);
  return response.data.data;
};

// ============ حذف منتج ============
export const deleteProduct = async (id) => {
  const response = await API.delete(`${BASE}/${id}`);
  return response.data.data;
};