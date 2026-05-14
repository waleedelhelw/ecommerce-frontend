import API from '../axiosInstance';

const BASE = '/seller/payment-methods';

export const getPaymentMethods = async () => {
  const response = await API.get(BASE);
  return response.data.data;
};

export const createPaymentMethod = async (data) => {
  const response = await API.post(BASE, data);
  return response.data.data;
};

export const updatePaymentMethod = async (id, data) => {
  const response = await API.put(`${BASE}/${id}`, data);
  return response.data.data;
};

export const deletePaymentMethod = async (id) => {
  const response = await API.delete(`${BASE}/${id}`);
  return response.data.data;
};

const sellerPaymentMethodService = {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};

export default sellerPaymentMethodService;
