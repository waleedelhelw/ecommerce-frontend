import API from '../axiosInstance';

const BASE = '/seller/returns';

// ============ جلب طلبات الإرجاع للبائع ============
export const getSellerReturns = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

// ============ جلب تفاصيل طلب إرجاع ============
export const getReturnById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data;
};

// ============ الموافقة على الإرجاع ============
export const approveReturn = async (id, data) => {
  const response = await API.put(`${BASE}/${id}/approve`, data);
  return response.data.data;
};

// ============ رفض الإرجاع ============
export const rejectReturn = async (id, data) => {
  const response = await API.put(`${BASE}/${id}/reject`, data);
  return response.data.data;
};

// ============ تأكيد استلام المنتج المرتجع ============
export const confirmReceived = async (id, notes = '') => {
  const response = await API.put(`${BASE}/${id}/confirm-received`, { notes });
  return response.data.data;
};

// ============ معالجة الإرجاع وإرجاع المبلغ ============
export const processRefund = async (id) => {
  const response = await API.put(`${BASE}/${id}/process-refund`);
  return response.data.data;
};

// ============ تصعيد للأدمن ============
export const escalateToAdmin = async (id, reason = '') => {
  const response = await API.put(`${BASE}/${id}/escalate`, { reason });
  return response.data.data;
};

const sellerReturnService = {
  getSellerReturns,
  getReturns: getSellerReturns,
  getReturnById,
  getReturn: getReturnById,
  approveReturn,
  rejectReturn,
  confirmReceived,
  processRefund,
  escalateToAdmin,
};

export default sellerReturnService;