import API from '../axiosInstance';

const BASE = '/superadmin/dashboard';

// ============ إحصائيات الداشبورد ============
export const getDashboardStats = async () => {
  const response = await API.get(BASE);
  return response.data;
};

// ============ تقرير المبيعات 🆕 ============
export const getSalesReport = async (params) => {
  const response = await API.get(`${BASE}/sales-report`, { params });
  return response.data.data;
};

// ============ الأكثر مبيعاً 🆕 ============
export const getTopSelling = async (params) => {
  const response = await API.get(`${BASE}/top-selling`, { params });
  return response.data.data;
};

// ============ الأعلى تقييماً 🆕 ============
export const getTopRated = async (params) => {
  const response = await API.get(`${BASE}/top-rated`, { params });
  return response.data.data;
};

// ✅ Default export للتوافق
const adminDashboardService = {
  getDashboard: getDashboardStats,
  getDashboardStats,
  getSalesReport,
  getTopSelling,
  getTopRated,
};

export default adminDashboardService;