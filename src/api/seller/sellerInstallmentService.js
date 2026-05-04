import API from '../axiosInstance';

const BASE = '/seller/installments';

// جلب دفعات طلب معين (للبائع)
export const getOrderInstallments = async (orderId) => {
  const response = await API.get(`${BASE}/orders/${orderId}`);
  return response.data.data;
};

const sellerInstallmentService = {
  getOrderInstallments,
};

export default sellerInstallmentService;