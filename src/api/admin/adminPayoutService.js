import API from '../axiosInstance';

const BASE = '/superadmin/payouts';

// ============ كل طلبات السحب ============
export const getAllPayouts = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

// ============ معالجة طلب سحب (قبول / رفض) ============
export const processPayout = async (payoutId, data) => {
  const response = await API.put(`${BASE}/${payoutId}/process`, data);
  return response.data.data;
};

// ✅ 🆕 رفع إيصال التحويل
export const uploadPayoutReceipt = async (payoutId, data) => {
  const response = await API.put(`${BASE}/${payoutId}/upload-receipt`, data);
  return response.data.data;
};

const adminPayoutService = {
  getPayouts: getAllPayouts,
  getAllPayouts,
  processPayout,
  uploadPayoutReceipt,
};

export default adminPayoutService;