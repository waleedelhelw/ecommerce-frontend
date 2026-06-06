import API from '../axiosInstance';

const BASE = '/seller/products';

// ============ منتجاتي ============
export const getMyProducts = async (params) => {
  const response = await API.get(BASE, { params });
  return response.data.data;
};

// ============ منتج بالمعرّف ============
export const getMyProductById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return response.data.data;
};

// ============ إنشاء منتج (مع صور متعددة) ============
export const createProduct = async (data) => {
  // ✅ تنظيف الـ payload قبل الإرسال
  const cleanData = {
    ...data,
    price: typeof data.price === 'string'
      ? parseFloat(data.price.replace(/[,\s]/g, ''))
      : data.price,
    stockQuantity: typeof data.stockQuantity === 'string'
      ? parseInt(data.stockQuantity.replace(/[,\s]/g, '')) || 0
      : data.stockQuantity || 0,
  };

  const response = await API.post(BASE, cleanData);
  return response.data.data;
};

// ============ تحديث منتج ============
export const updateProduct = async (id, data) => {
  const cleanData = {
    ...data,
    price: typeof data.price === 'string'
      ? parseFloat(data.price.replace(/[,\s]/g, ''))
      : data.price,
    stockQuantity: typeof data.stockQuantity === 'string'
      ? parseInt(data.stockQuantity.replace(/[,\s]/g, '')) || 0
      : data.stockQuantity || 0,
  };

  const response = await API.put(`${BASE}/${id}`, cleanData);
  return response.data.data;
};

// ============ حذف منتج ============
export const deleteProduct = async (id) => {
  const response = await API.delete(`${BASE}/${id}`);
  return response.data.data;
};

// ============ ربط الخصائص بالمنتج ============
export const attachAttributesToProduct = async (productId, attributeIds) => {
  const response = await API.post(`${BASE}/${productId}/attributes`, attributeIds);
  return response.data.data || response.data;
};

// ============ الخصائص المرتبطة بمنتج ============
export const getProductAttributes = async (productId) => {
  const response = await API.get(`${BASE}/${productId}/attributes`);
  return response.data.data || response.data;
};