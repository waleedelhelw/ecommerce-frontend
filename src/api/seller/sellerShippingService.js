import API from '../axiosInstance';

const BASE = '/seller/shipping/zones';

// ✅ جلب مناطق الشحن الخاصة بالبائع
export const getMyZones = async () => {
  const response = await API.get(BASE);
  return response.data.data;
};

// ✅ إضافة منطقة شحن واحدة
export const createZone = async (data) => {
  const response = await API.post(BASE, data);
  return response.data.data;
};

// ✅ إضافة مناطق شحن متعددة دفعة واحدة
export const createZonesBulk = async (zones) => {
  const response = await API.post(`${BASE}/bulk`, { zones });
  return response.data.data;
};

// ✅ تعديل منطقة شحن
export const updateZone = async (zoneId, data) => {
  const response = await API.put(`${BASE}/${zoneId}`, data);
  return response.data.data;
};

// ✅ حذف منطقة شحن
export const deleteZone = async (zoneId) => {
  const response = await API.delete(`${BASE}/${zoneId}`);
  return response.data;
};

const sellerShippingService = {
  getMyZones,
  createZone,
  createZonesBulk,
  updateZone,
  deleteZone,
};

export default sellerShippingService;