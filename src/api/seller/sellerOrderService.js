import API from '../axiosInstance';

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

// ============ تحديث حالة الطلب (قديم - للتوافق) ============
export const updateOrderStatus = async (orderId, status) => {
  const response = await API.put(`${BASE}/${orderId}/status`, { status });
  return response.data.data;
};

// ✅ 🆕 بدء التجهيز
export const startProcessing = async (orderId) => {
  const response = await API.put(`${BASE}/${orderId}/start-processing`);
  return response.data.data;
};

// ✅ 🆕 جاهز للشحن
export const readyToShip = async (orderId) => {
  const response = await API.put(`${BASE}/${orderId}/ready-to-ship`);
  return response.data.data;
};

// ✅ 🆕 شحن الطلب
export const shipOrder = async (orderId, data) => {
  const response = await API.put(`${BASE}/${orderId}/ship`, data);
  return response.data.data;
};

const sellerOrderService = {
  getMyOrders,
  getOrders: getMyOrders,
  getOrderById,
  updateOrderStatus,
  startProcessing,
  readyToShip,
  shipOrder,
};

export default sellerOrderService;