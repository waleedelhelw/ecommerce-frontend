import API from '../axiosInstance';

const BASE = '/seller/orders';

// ============ طلباتي ============
export const getMyOrders = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data;
};

// ============ تفاصيل طلب ============
export const getOrderById = async (orderId) => {
  const response = await API.get(`${BASE}/${orderId}`);
  return response.data;
};

// ============ تحديث حالة الطلب ============
export const updateOrderStatus = async (orderId, status) => {
  const response = await API.put(`${BASE}/${orderId}/status`, { status });
  return response.data;
};