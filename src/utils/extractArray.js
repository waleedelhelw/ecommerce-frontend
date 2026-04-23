/**
 * استخراج الـ array من أي شكل response
 */
export const extractArray = (data, possibleKeys = ['items', 'products', 'categories', 'orders', 'users', 'reviews', 'logs', 'data']) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    for (const key of possibleKeys) {
      if (Array.isArray(data[key])) return data[key];
    }
  }
  return [];
};
