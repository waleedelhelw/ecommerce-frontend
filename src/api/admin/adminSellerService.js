import API from '../axiosInstance';

const BASE = '/superadmin/sellers';

// ============ كل البائعين ============
export const getAllSellers = async (params) => {
  const response = await API.get(BASE, { params });
  // response.data = { success, message, data: { items, totalPages, ... } }
  return response.data.data;
};

// ✅ الـ Backend بيستخدم userId في كل الـ endpoints
// ============ بائع بالمعرّف ============
export const getSellerById = async (userId) => {
  const response = await API.get(`${BASE}/${userId}`);
  return response.data.data;
};

// ============ قبول بائع ============
export const approveSeller = async (userId) => {
  const response = await API.put(`${BASE}/${userId}/approve`);
  return response.data;
};

// ============ رفض بائع ============
export const rejectSeller = async (userId, reason) => {
  const response = await API.put(`${BASE}/${userId}/reject`, { reason });
  return response.data;
};

// ============ إيقاف بائع ============
export const suspendSeller = async (userId, reason = '') => {
  const response = await API.put(`${BASE}/${userId}/suspend`, { reason });
  return response.data;
};

// ============ تعديل نسبة العمولة ============
export const updateCommissionRate = async (userId, commissionRate) => {
  const response = await API.put(`${BASE}/${userId}/commission`, { commissionRate });
  return response.data;
};

// ============ تفعيل/تعطيل الدفع المباشر ============
export const toggleSelfPayment = async (userId, disabled) => {
  const response = await API.put(`${BASE}/${userId}/toggle-self-payment`, { disabled });
  return response.data;
};

const adminSellerService = {
  getSellers: getAllSellers,
  getSellerById,
  approveSeller,
  rejectSeller,
  suspendSeller,
  updateCommissionRate,
  toggleSelfPayment,
};

export default adminSellerService;