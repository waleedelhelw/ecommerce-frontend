import API from '../axiosInstance';

// ✅ جلب مناطق الشحن الخاصة ببائع معين (للمراقبة فقط)
export const getSellerZones = async (sellerId) => {
  const response = await API.get(`/admin/shipping/sellers/${sellerId}/zones`);
  return response.data.data;
};

const adminShippingService = {
  getSellerZones,
};

export default adminShippingService;