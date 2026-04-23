export const formatPrice = (price) => {
  if (price === null || price === undefined) return '0 ج.م';
  return `${Number(price).toLocaleString('ar-EG')} ج.م`;
};
