import API from '../axiosInstance';

const BASE = '/superadmin/users';

// ============ كل المستخدمين ============
export const getAllUsers = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data;
};

// ============ مستخدم بالمعرّف ============
export const getUserById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data;
};

// ============ تفعيل / حظر مستخدم 🆕 ============
export const toggleUserStatus = async (id) => {
  const response = await API.put(`${BASE}/${id}/toggle-status`);
  return response.data.data;
};

// ============ حذف مستخدم ============
export const deleteUser = async (id) => {
  const response = await API.delete(`${BASE}/${id}`);
  return response.data.data;
};

// ✅ Default export للتوافق
const adminUserService = {
  getUsers: getAllUsers,
  getAllUsers,
  getUser: getUserById,
  getUserById,
  toggleUserStatus,
  deleteUser,
};

export default adminUserService;