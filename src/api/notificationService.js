import API from './axiosInstance';

export const registerFcmToken = async (token) => {
  const response = await API.post('/notifications/register-token', {
    token,
    deviceType: 'web',
  });
  return response.data;
};

export const unregisterFcmToken = async (token) => {
  const response = await API.delete('/notifications/unregister-token', {
    data: { token },
  });
  return response.data;
};
