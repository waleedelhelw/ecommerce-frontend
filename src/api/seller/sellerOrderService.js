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

// ✅ 🆕 تسجيل فشل التسليم
export const markDeliveryFailed = async (orderId, data) => {
  const response = await API.put(`${BASE}/${orderId}/delivery-failed`, data);
  return response.data.data;
};

// ✅ 🆕 تسجيل رجوع الشحنة للبائع
export const markReturnedToSeller = async (orderId, data) => {
  const response = await API.put(`${BASE}/${orderId}/returned-to-seller`, data);
  return response.data.data;
};

// ✅ 🆕 جلب مدفوعات الطلب
export const getOrderPayments = async (orderId) => {
  const response = await API.get(`${BASE}/${orderId}/payments`);
  return response.data.data;
};

// ✅ 🆕 تأكيد دفع Self Mode
export const confirmSellerPayment = async (orderId, paymentId, data = {}) => {
  const response = await API.put(`${BASE}/${orderId}/payments/${paymentId}/confirm`, data);
  return response.data.data;
};

// ✅ 🆕 رفض دفع Self Mode
export const rejectSellerPayment = async (orderId, paymentId, reason) => {
  const response = await API.put(`${BASE}/${orderId}/payments/${paymentId}/reject`, { reason });
  return response.data.data;
};

// ✅ 🆕 تأكيد تسليم الطلب الخارجي
export const confirmDelivery = async (orderId) => {
  const response = await API.put(`${BASE}/${orderId}/confirm-delivery`);
  return response.data.data;
};

// ✅ 🆕 إنشاء طلب خارجي (Guest Order)
export const createGuestOrder = async (data) => {
  const response = await API.post(`${BASE}/create-guest`, data);
  return response.data.data;
};

const sellerOrderService = {
  getMyOrders,
  getOrders: getMyOrders,
  getOrderById,
  createGuestOrder,
  updateOrderStatus,
  startProcessing,
  readyToShip,
  shipOrder,
  markDeliveryFailed,
  markReturnedToSeller,
  getOrderPayments,
  confirmSellerPayment,
  rejectSellerPayment,
  confirmDelivery,
};

export default sellerOrderService;