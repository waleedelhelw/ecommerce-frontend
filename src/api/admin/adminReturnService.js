import API from '../axiosInstance';

const BASE = '/admin/returns';

// ============ جلب كل طلبات الإرجاع ============
export const getAllReturns = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

// ============ جلب تفاصيل طلب إرجاع ============
export const getReturnById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data;
};

// ============ الموافقة على الإرجاع (الأدمن) ============
export const approveReturn = async (id, data) => {
  const response = await API.put(`${BASE}/${id}/approve`, data);
  return response.data.data;
};

// ============ رفض الإرجاع (الأدمن) ============
export const rejectReturn = async (id, data) => {
  const response = await API.put(`${BASE}/${id}/reject`, data);
  return response.data.data;
};

// ============ معالجة الإرجاع وإرجاع المبلغ (الأدمن) ============
export const processRefund = async (id) => {
  const response = await API.put(`${BASE}/${id}/process-refund`);
  return response.data.data;
};

const adminReturnService = {
  getAllReturns,
  getReturns: getAllReturns,
  getReturnById,
  getReturn: getReturnById,
  approveReturn,
  rejectReturn,
  processRefund,
};

export default adminReturnService;