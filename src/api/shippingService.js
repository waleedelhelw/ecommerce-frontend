import API from './axiosInstance';

// ✅ جلب خيارات الشحن المتاحة (للعميل)
export const getShippingOptions = async () => {
  const response = await API.get('/shipping-options');
  return response.data.data;
};

const shippingService = {
  getShippingOptions,
};

export default shippingService;