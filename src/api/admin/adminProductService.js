import API from '../axiosInstance';

const BASE = '/superadmin/products';

export const getAllProducts = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

export const getProductById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data;
};

export const deleteProduct = async (id) => {
  const response = await API.delete(`${BASE}/${id}`);
  return response.data.data;
};

// ✅ Default export للتوافق
const adminProductService = {
  getProducts: getAllProducts,
  getAllProducts,
  getProduct: getProductById,
  getProductById,
  deleteProduct,
};

export default adminProductService;