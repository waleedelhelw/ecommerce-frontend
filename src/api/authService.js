import API from './axiosInstance';

// ============ تسجيل عميل جديد ============
export const register = async (data) => {
  const response = await API.post('/auth/register', {
    name: data.name,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
    phone: data.phone,
  });
  return response.data;
};

// ============ تسجيل بائع جديد 🆕 ============
export const registerSeller = async (data) => {
  const response = await API.post('/auth/register-seller', {
    name: data.name,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
    phone: data.phone,
    storeName: data.storeName,
    storeDescription: data.storeDescription,
    businessEmail: data.businessEmail,
    businessPhone: data.businessPhone,
  });
  return response.data;
};

// ============ تسجيل الدخول ============
export const login = async (email, password) => {
  const response = await API.post('/auth/login', {
    email,
    password,
  });
  return response.data;
};

// ============ تسجيل دخول بـ Google 🆕 ============
export const googleLogin = async (idToken) => {
  const response = await API.post('/auth/google-login', {
    idToken,
  });
  return response.data;
};

// ============ تحديث التوكن ============
export const refreshToken = async (token, refreshToken) => {
  const response = await API.post('/auth/refresh-token', {
    token,
    refreshToken,
  });
  return response.data;
};

// ============ تغيير كلمة المرور ============
export const changePassword = async (data) => {
  const response = await API.post('/auth/change-password', {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
    confirmNewPassword: data.confirmNewPassword,
  });
  return response.data.data;
};

// ============ تسجيل الخروج ============
export const logoutApi = async () => {
  const response = await API.post('/auth/logout');
  return response.data.data;
};
// ✅ Default export للتوافق مع الملفات القديمة
const authService = {
  register,
  registerSeller,
  login,
  googleLogin,
  refreshToken,
  changePassword,
  logout: logoutApi,
};

export default authService;