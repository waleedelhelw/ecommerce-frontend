import API from '../axiosInstance';

const BASE = '/superadmin/orders';

// ============ كل الطلبات ============
export const getAllOrders = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

// ============ تفاصيل طلب ============
export const getOrderById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data;
};

// ✅ 🆕 تحديث حالة الطلب
export const updateOrderStatus = async (id, status) => {
  const response = await API.put(`${BASE}/${id}/status`, { status });
  return response.data.data;
};

const adminOrderService = {
  getOrders: getAllOrders,
  getAllOrders,
  getOrder: getOrderById,
  getOrderById,
  updateOrderStatus,
};

export default adminOrderService;