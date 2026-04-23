import API from './axiosInstance';

const profileService = {
  // جلب الملف الشخصي
  getProfile: async () => {
    const response = await API.get('/customer/profile');
    return response.data.data;
  },

  // تحديث الملف الشخصي
  updateProfile: async (data) => {
    const response = await API.put('/customer/profile', data);
    return response.data.data;
  },
};

export default profileService;