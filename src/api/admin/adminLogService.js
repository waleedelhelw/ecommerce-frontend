import API from '../axiosInstance';

const BASE = '/superadmin/logs';

// ============ سجلات النظام ============
export const getLogs = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};


// ✅ Default export للتوافق
const adminLogService = {
  getLogs,
};

export default adminLogService;
