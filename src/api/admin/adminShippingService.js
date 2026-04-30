import API from '../axiosInstance';

const BASE = '/admin/shipping-options';

export const getAll = async () => {
  const response = await API.get(BASE);
  return response.data.data;
};

export const create = async (data) => {
  const response = await API.post(BASE, data);
  return response.data.data;
};

export const update = async (id, data) => {
  const response = await API.put(`${BASE}/${id}`, data);
  return response.data.data;
};

export const remove = async (id) => {
  const response = await API.delete(`${BASE}/${id}`);
  return response.data;
};

const adminShippingService = { getAll, create, update, remove };
export default adminShippingService;