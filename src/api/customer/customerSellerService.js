import API from '../axiosInstance';

const BASE = '/customer/sellers';

// ============ كل البائعين المعتمدين ============
export const getAllSellers = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

// ============ صفحة بائع ============
export const getSellerById = async (sellerId) => {
  const response = await API.get(`${BASE}/${sellerId}`);
  return response.data.data;
};

export const getSellerBySlug = async (slug) => {
  const response = await API.get(`${BASE}/by-slug/${slug}`);
  return response.data.data;
};

// ============ منتجات بائع ============
export const getSellerProducts = async (sellerId, params) => {
  const response = await API.get(`${BASE}/${sellerId}/products`, { params });
  return response.data.data;
};

export const getSellerProductsBySlug = async (slug, params) => {
  const response = await API.get(`${BASE}/by-slug/${slug}/products`, { params });
  return response.data.data;
};
