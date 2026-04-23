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

// ✅ Default export
const adminPayoutService = {
  getPayouts: getAllPayouts,
  processPayout,
};

export default adminPayoutService;