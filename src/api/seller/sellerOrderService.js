import API from '../axiosInstance';

// ✅ Seller endpoint
const BASE = '/seller/orders';

// ============ طلبات البائع ============
export const getMyOrders = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

// ============ تفاصيل طلب ============
export const getOrderById = async (orderId) => {
  const response = await API.get(`${BASE}/${orderId}`);
  return response.data.data;
};

// ============ تحديث حالة الطلب ============
export const updateOrderStatus = async (orderId, status) => {
  const response = await API.put(`${BASE}/${orderId}/status`, { status });
  return response.data.data;
};

const sellerOrderService = {
  getMyOrders,
  getOrders: getMyOrders,
  getOrderById,
  updateOrderStatus,
};

export default sellerOrderService;