import API from '../axiosInstance';

const BASE = '/seller/payouts';

// ============ سحوباتي ============
export const getMyPayouts = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

// ============ طلب سحب جديد ============
export const requestPayout = async (data) => {
  // data: { amount, paymentMethod, notes }
  const response = await API.post(`${BASE}/request`, data);
  return response.data.data;
};
