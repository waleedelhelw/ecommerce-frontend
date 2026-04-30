import API from '../axiosInstance';

const BASE = '/superadmin/payments';

// ✅ جلب الإيصالات المعلقة
export const getPendingPayments = async (params) => {
  const response = await API.get(`${BASE}/pending`, { params });
  return response.data.data;
};

// ✅ تأكيد الدفع — لازم نبعت body فاضي عالأقل
export const confirmPayment = async (paymentId) => {
  const response = await API.put(`${BASE}/${paymentId}/confirm`, {});
  return response.data.data;
};

// ✅ رفض الدفع
export const rejectPayment = async (paymentId, reason) => {
  const response = await API.put(`${BASE}/${paymentId}/reject`, { reason });
  return response.data.data;
};

const adminPaymentService = {
  getPendingPayments,
  confirmPayment,
  rejectPayment,
};

export default adminPaymentService;