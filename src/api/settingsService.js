import API from './axiosInstance';

// ✅ جلب معلومات الدفع (أرقام المحافظ) - للعميل
export const getPaymentInfo = async () => {
  const response = await API.get('/settings/payment-info');
  return response.data.data;
};

const settingsService = {
  getPaymentInfo,
};

export default settingsService;