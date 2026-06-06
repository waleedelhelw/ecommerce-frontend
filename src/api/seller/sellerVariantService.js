import API from '../axiosInstance';

const VARIANTS_BASE = '/seller/variants';
const PRODUCT_VARIANTS_BASE = '/seller/products';

export const generateVariants = async (productId, attributeValueIds) => {
  const response = await API.post(`${PRODUCT_VARIANTS_BASE}/${productId}/variants/generate`, { attributeValueIds });
  return response.data.data || response.data;
};

export const syncVariants = async (productId, attributeValueIds) => {
  const response = await API.post(`${PRODUCT_VARIANTS_BASE}/${productId}/variants/sync`, { attributeValueIds });
  return response.data.data || response.data;
};

export const getProductVariants = async (productId) => {
  const response = await API.get(`${PRODUCT_VARIANTS_BASE}/${productId}/variants`);
  return response.data.data || response.data;
};

export const getVariant = async (variantId) => {
  const response = await API.get(`${VARIANTS_BASE}/${variantId}`);
  return response.data.data || response.data;
};

export const updateVariant = async (variantId, data) => {
  const response = await API.put(`${VARIANTS_BASE}/${variantId}`, data);
  return response.data.data || response.data;
};

export const deleteVariant = async (variantId) => {
  const response = await API.delete(`${VARIANTS_BASE}/${variantId}`);
  return response.data.data || response.data;
};

const sellerVariantService = {
  generateVariants,
  syncVariants,
  getProductVariants,
  getVariant,
  updateVariant,
  deleteVariant,
};

export default sellerVariantService;
