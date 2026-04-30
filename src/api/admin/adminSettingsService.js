import API from '../axiosInstance';

const BASE = '/admin/settings';

// ✅ جلب كل الإعدادات
export const getSettings = async () => {
  const response = await API.get(BASE);
  return response.data.data;
};

// ✅ تعديل إعداد واحد
export const updateSetting = async (key, value) => {
  const response = await API.put(BASE, { key, value });
  return response.data.data;
};

// ✅ تعديل مجموعة إعدادات مرة واحدة
export const updateSettings = async (settings) => {
  const response = await API.put(`${BASE}/batch`, { settings });
  return response.data.data;
};

const adminSettingsService = {
  getSettings,
  updateSetting,
  updateSettings,
};

export default adminSettingsService;