import API from '../axiosInstance';

const BASE = '/admin/installments';

// جلب كل الخطط
export const getAllPlans = async () => {
  const response = await API.get(`${BASE}/plans`);
  return response.data.data;
};

// إنشاء خطة جديدة
export const createPlan = async (data) => {
  const response = await API.post(`${BASE}/plans`, data);
  return response.data.data;
};

// تعديل خطة
export const updatePlan = async (id, data) => {
  const response = await API.put(`${BASE}/plans/${id}`, data);
  return response.data.data;
};

// حذف خطة
export const deletePlan = async (id) => {
  const response = await API.delete(`${BASE}/plans/${id}`);
  return response.data.data;
};

// تفعيل / تعطيل خطة
export const togglePlan = async (id) => {
  const response = await API.patch(`${BASE}/plans/${id}/toggle`);
  return response.data.data;
};

// جلب دفعات طلب معين
export const getOrderInstallments = async (orderId) => {
  const response = await API.get(`${BASE}/orders/${orderId}`);
  return response.data.data;
};

// تأكيد دفع دفعة
export const confirmInstallment = async (installmentId, data) => {
  const response = await API.post(`${BASE}/${installmentId}/confirm`, data);
  return response.data.data;
};

// جلب الدفعات المتأخرة
export const getOverdueInstallments = async () => {
  const response = await API.get(`${BASE}/overdue`);
  return response.data.data;
};

const adminInstallmentService = {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlan,
  getOrderInstallments,
  confirmInstallment,
  getOverdueInstallments,
};

export default adminInstallmentService;