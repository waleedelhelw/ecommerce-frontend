import API from './axiosInstance';

const BASE = '/customer/orders';

export const createOrder = async (data) => {
  const response = await API.post(BASE, data);
  return response.data;
};

export const getMyOrders = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await API.put(`${BASE}/${id}/cancel`);
  return response.data;
};

// ✅ Default export للتوافق مع الملفات القديمة
const orderService = {
  createOrder,
  getOrders: getMyOrders,
  getMyOrders,
  getOrder: getOrderById,
  getOrderById,
  cancelOrder,
};

export default orderService;