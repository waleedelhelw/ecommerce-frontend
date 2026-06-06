import API from '../axiosInstance';

const BASE = '/superadmin/attributes';

export const getAllAttributes = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data;
};

export const getAttributeById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data || response.data;
};

export const createAttribute = async (data) => {
  const response = await API.post(BASE, data);
  return response.data.data || response.data;
};

export const updateAttribute = async (id, data) => {
  const response = await API.put(`${BASE}/${id}`, data);
  return response.data.data || response.data;
};

export const deleteAttribute = async (id) => {
  const response = await API.delete(`${BASE}/${id}`);
  return response.data;
};

const adminAttributeService = {
  getAttributes: getAllAttributes,
  getAttributeById,
  createAttribute,
  updateAttribute,
  deleteAttribute,
};

export default adminAttributeService;
