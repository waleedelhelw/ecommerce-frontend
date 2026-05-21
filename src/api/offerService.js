import API from './axiosInstance';

const BASE = '/offers';

export const getOffers = async (params = {}) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

const offerService = { getOffers };

export default offerService;
