import API from './axiosInstance';

export const getPublicTracking = async (token) => {
  const response = await API.get(`/public/track/${token}`);
  return response.data.data;
};

const trackingService = { getPublicTracking };
export default trackingService;
