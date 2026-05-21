import API from '../axiosInstance';

const BASE = '/seller/offers';

export const getMyOffers = async (params = {}) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

export const getOfferById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data;
};

export const createOffer = async (data) => {
  const response = await API.post(BASE, data);
  return response.data.data;
};

export const updateOffer = async (id, data) => {
  const response = await API.put(`${BASE}/${id}`, data);
  return response.data.data;
};

export const deleteOffer = async (id) => {
  const response = await API.delete(`${BASE}/${id}`);
  return response.data.data;
};

const sellerOfferService = {
  getMyOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
};

export default sellerOfferService;
