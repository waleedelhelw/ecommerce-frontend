import API from './axiosInstance';

const BASE = '/customer/products';

export const getProducts = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

export const getProductById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data;
};

export const getProductsByCategory = async (categoryId, params) => {
  const response = await API.get(`${BASE}/category/${categoryId}`, { params });
  return response.data.data;
};

export const getFeaturedProducts = async () => {
  const response = await API.get(`${BASE}/featured`);
  return response.data.data;
};

export const getNewProducts = async () => {
  const response = await API.get(`${BASE}/new`);
  return response.data.data;
};

export const getRelatedProducts = async (id) => {
  const response = await API.get(`${BASE}/${id}/related`);
  return response.data.data;
};

// ✅ Default export مع كل الأسماء المحتملة
const productService = {
  getProducts,
  getProduct: getProductById,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getNewProducts,
  getRelatedProducts,
  // ✅ أسماء مختصرة للتوافق مع الـ components
  getFeatured: getFeaturedProducts,
  getNew: getNewProducts,
  getRelated: getRelatedProducts,
};

export default productService;