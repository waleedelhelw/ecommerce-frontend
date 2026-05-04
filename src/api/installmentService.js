import API from './axiosInstance';

const BASE = '/installments';

// جلب الخطط المتاحة
export const getAvailablePlans = async () => {
  const response = await API.get(`${BASE}/plans`);
  return response.data.data;
};

// معاينة خطة تقسيط على مبلغ معين
export const previewPlan = async (planId) => {
  const response = await API.get(`${BASE}/plans/${planId}/preview`);
  return response.data.data;
};

// جلب دفعات طلب معين
export const getOrderInstallments = async (orderId) => {
  const response = await API.get(`${BASE}/orders/${orderId}`);
  return response.data.data;
};

// دفع دفعة
export const payInstallment = async (installmentId, data) => {
  const response = await API.post(`${BASE}/${installmentId}/pay`, data);
  return response.data.data;
};

const installmentService = {
  getAvailablePlans,
  previewPlan,
  getOrderInstallments,
  payInstallment,
};

export default installmentService;