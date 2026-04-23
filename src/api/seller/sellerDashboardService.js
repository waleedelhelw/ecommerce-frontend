import API from '../axiosInstance';

export const getSellerDashboard = async () => {
  const response = await API.get('/seller/dashboard');
  return response.data.data;
};
