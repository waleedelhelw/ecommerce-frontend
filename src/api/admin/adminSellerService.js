import API from '../axiosInstance';

const BASE = '/superadmin/sellers';

// ============ كل البائعين ============
export const getAllSellers = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

// ============ بائع بالمعرّف ============
export const getSellerById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data;
};

// ============ قبول بائع ============
export const approveSeller = async (id) => {
  const response = await API.put(`${BASE}/${id}/approve`);
  return response.data.data;
};

// ============ رفض بائع ============
export const rejectSeller = async (id, reason) => {
  const response = await API.put(`${BASE}/${id}/reject`, { reason });
  return response.data.data;
};

// ============ إيقاف بائع ============
export const suspendSeller = async (id) => {
  const response = await API.put(`${BASE}/${id}/suspend`);
  return response.data.data;
};

// ============ تعديل نسبة العمولة ============
export const updateCommissionRate = async (id, commissionRate) => {
  const response = await API.put(`${BASE}/${id}/commission`, { commissionRate });
  return response.data.data;
};

// ✅ Default export
const adminSellerService = {
  getSellers: getAllSellers,
  getSellerById,
  approveSeller,
  rejectSeller,
  suspendSeller,
  updateCommissionRate,
};

export default adminSellerService;