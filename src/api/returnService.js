import API from './axiosInstance';

const BASE = '/customer/returns';

// ============ إنشاء طلب إرجاع ============
export const createReturnRequest = async (data) => {
  const response = await API.post(BASE, data);
  return response.data.data;
};

// ============ جلب طلبات الإرجاع الخاصة بى ============
export const getMyReturns = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

// ============ جلب تفاصيل طلب إرجاع ============
export const getReturnById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data;
};

// ============ إلغاء طلب إرجاع ============
export const cancelReturnRequest = async (id) => {
  const response = await API.put(`${BASE}/${id}/cancel`);
  return response.data.data;
};

// ============ تسجيل بيانات الشحن (بعد موافقة البائع) ============
export const shipReturn = async (id, data) => {
  const response = await API.put(`${BASE}/${id}/ship`, data);
  return response.data.data;
};

// ============ 🆕 جلب طلبات الإرجاع الخاصة بأوردر معين ============
/**
 * يجيب كل الـ returns الخاصة بأوردر معين
 * @param {number} orderId - رقم الأوردر
 * @returns {Array} - قائمة الـ returns (active فقط)
 */
export const getReturnsByOrderId = async (orderId) => {
  try {
    // نجيب كل الـ returns ونعمل filter
    const data = await getMyReturns({ pageSize: 100 });
    const items = data?.items || data || [];
    return items.filter((r) => r.orderId === orderId);
  } catch (err) {
    console.error('Failed to fetch returns by order:', err);
    return [];
  }
};

// ============ 🆕 Helper: هل فيه return نشط لأوردر معين؟ ============
/**
 * يشيك لو فيه return request نشط (مش Cancelled أو Rejected)
 * @param {number} orderId
 * @returns {Object|null} - الـ return النشط أو null
 */
export const getActiveReturnForOrder = async (orderId) => {
  const returns = await getReturnsByOrderId(orderId);
  // Cancelled & Rejected = خلاص، يقدر يطلب return جديد
  const activeReturn = returns.find(
    (r) => !['Cancelled', 'Rejected'].includes(r.status)
  );
  return activeReturn || null;
};

const returnService = {
  createReturnRequest,
  getMyReturns,
  getReturns: getMyReturns,
  getReturnById,
  getReturn: getReturnById,
  cancelReturnRequest,
  cancelReturn: cancelReturnRequest,
  shipReturn,
  getReturnsByOrderId, // 🆕
  getActiveReturnForOrder, // 🆕
};

export default returnService;