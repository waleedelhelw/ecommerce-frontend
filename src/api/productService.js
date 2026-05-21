import API from './axiosInstance';

const BASE = '/customer/products';

let offersCache = null;
let offersCacheTime = 0;
const CACHE_TTL = 30000;

const fetchOffersMap = async () => {
  const now = Date.now();
  if (offersCache && now - offersCacheTime < CACHE_TTL) return offersCache;
  try {
    const response = await API.get('/offers', { params: { pageSize: 200 } });
    const items = response.data.data?.items || [];
    const map = {};
    items.forEach((o) => {
      if (!o.isActive || (o.endDate && new Date(o.endDate) < new Date())) return;
      map[o.productId] = {
        hasActiveOffer: true,
        offerPrice: o.offerPrice,
        discountPercentage: o.discountPercentage,
        offerEndDate: o.endDate,
        offerType: o.offerType,
        buyQuantity: o.buyQuantity,
        freeQuantity: o.freeQuantity,
      };
    });
    offersCache = map;
    offersCacheTime = now;
    return map;
  } catch {
    return {};
  }
};

const injectOffers = async (items) => {
  if (!items) return items;
  const map = await fetchOffersMap();
  return items.map((item) => {
    const offer = map[item.id];
    return offer ? { ...item, ...offer } : item;
  });
};

const injectSingleOffer = async (item) => {
  if (!item) return item;
  const map = await fetchOffersMap();
  const offer = map[item.id];
  return offer ? { ...item, ...offer } : item;
};

export const getProducts = async (params) => {
  const response = await API.get(BASE, { params });
  response.data.data.items = await injectOffers(response.data.data?.items || response.data.data?.products || []);
  return response.data.data;
};

export const getProductById = async (id) => {
  const response = await API.get(`${BASE}/${id}`);
  return await injectSingleOffer(response.data.data);
};

export const getProductsByCategory = async (categoryId, params) => {
  const response = await API.get(`${BASE}/category/${categoryId}`, { params });
  response.data.data.items = await injectOffers(response.data.data?.items || response.data.data?.products || []);
  return response.data.data;
};

export const getFeaturedProducts = async () => {
  const response = await API.get(`${BASE}/featured`);
  return await injectOffers(response.data.data);
};

export const getNewProducts = async () => {
  const response = await API.get(`${BASE}/new`);
  return await injectOffers(response.data.data);
};

export const getRelatedProducts = async (id) => {
  const response = await API.get(`${BASE}/${id}/related`);
  return await injectOffers(response.data.data);
};

const productService = {
  getProducts,
  getProduct: getProductById,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getNewProducts,
  getRelatedProducts,
  getFeatured: getFeaturedProducts,
  getNew: getNewProducts,
  getRelated: getRelatedProducts,
};

export default productService;
