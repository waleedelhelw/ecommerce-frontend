import API from './axiosInstance';

const BASE = '/customer/orders';

export const createOrder = async (data) => {
  const response = await API.post(BASE, data);
  return response.data.data;
};

export const getMyOrders = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

export const getOrderById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data;
};

export const cancelOrder = async (id) => {
  const response = await API.put(`${BASE}/${id}/cancel`);
  return response.data.data;
};

// ✅ 🆕 رفع إيصال الدفع - لكل paymentId
export const uploadPaymentReceipt = async (orderId, paymentId, data) => {
  const response = await API.post(`${BASE}/${orderId}/payments/${paymentId}/upload-receipt`, data);
  return response.data.data;
};

// ✅ 🆕 جلب مدفوعات الطلب
export const getOrderPayments = async (orderId) => {
  const response = await API.get(`${BASE}/${orderId}/payments`);
  return response.data.data;
};

// ✅ تأكيد الاستلام
export const confirmDelivery = async (orderId) => {
  const response = await API.put(`${BASE}/${orderId}/confirm-delivery`);
  return response.data.data;
};

// ✅ جلب Timeline الطلب
export const getOrderTimeline = async (orderId) => {
  const response = await API.get(`${BASE}/${orderId}/timeline`);
  return response.data.data;
};

// ============ دوال قديمة - محفوظة للتوافق مع الكود القديم ============
// ❌ مستخدم قديم - استبدل بـ uploadPaymentReceipt(orderId, paymentId, data)
export const uploadReceipt = async (orderId, data) => {
  const response = await API.post(`${BASE}/${orderId}/upload-receipt`, data);
  return response.data.data;
};

const orderService = {
  createOrder,
  getOrders: getMyOrders,
  getMyOrders,
  getOrder: getOrderById,
  getOrderById,
  cancelOrder,
  uploadReceipt,
  uploadPaymentReceipt,
  getOrderPayments,
  confirmDelivery,
  getOrderTimeline,
};

export default orderService;