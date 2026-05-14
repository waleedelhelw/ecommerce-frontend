import API from '../axiosInstance';

const BASE = '/superadmin/payments';

// ✅ جلب الإيصالات المعلقة
export const getPendingPayments = async (params) => {
  const response = await API.get(`${BASE}/pending`, { params });
  return response.data.data;
};

// ✅ تأكيد الدفع — مع ملاحظة اختيارية
export const confirmPayment = async (paymentId, note) => {
  const body = {};
  if (note) body.note = note;
  const response = await API.put(`${BASE}/${paymentId}/confirm`, body);
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