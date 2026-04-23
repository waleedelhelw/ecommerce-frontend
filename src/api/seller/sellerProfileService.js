import API from '../axiosInstance';

const BASE = '/seller/profile';

// ============ بيانات المتجر ============
export const getSellerProfile = async () => {
  const response = await API.get(BASE);
  return response.data.data;
};

// ============ تحديث بيانات المتجر ============
export const updateSellerProfile = async (data) => {
  const response = await API.put(BASE, data);
  return response.data.data;
};