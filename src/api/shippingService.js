import API from './axiosInstance';

// ✅ جلب المناطق المتاحة لكل البائعين في السلة (للـ Checkout)
export const getCartAvailableZones = async () => {
  const response = await API.get('/shipping/cart/available-zones');
  return response.data.data;
};

// ✅ جلب المحافظات المتاحة لبائع معين
export const getSellerGovernorates = async (sellerId) => {
  const response = await API.get(`/shipping/${sellerId}/governorates`);
  return response.data.data;
};

// ✅ جلب المدن في محافظة معينة لبائع معين
export const getSellerCities = async (sellerId, governorate) => {
  const response = await API.get(`/shipping/${sellerId}/cities/${governorate}`);
  return response.data.data;
};

// ✅ حساب سعر الشحن لبائع معين في منطقة معينة
export const getShippingCost = async (sellerId, governorate, city) => {
  const response = await API.get(`/shipping/${sellerId}/cost`, {
    params: { governorate, city },
  });
  return response.data.data;
};

const shippingService = {
  getCartAvailableZones,
  getSellerGovernorates,
  getSellerCities,
  getShippingCost,
};

export default shippingService;