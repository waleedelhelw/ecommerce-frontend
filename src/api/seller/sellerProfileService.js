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


// ✅ 🆕 تعديل بيانات السحب البنكية
export const updatePayoutInfo = async (data) => {
  const response = await API.put(`${BASE}/payout-info`, data);
  return response.data.data;
};

const sellerProfileService = {
  getSellerProfile,
  updateSellerProfile,
  updatePayoutInfo,
};

export default sellerProfileService;
