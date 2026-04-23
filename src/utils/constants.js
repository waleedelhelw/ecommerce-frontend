// ============ Roles ============
export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  SELLER: 'Seller',
  CUSTOMER: 'Customer',
};

// ============ Seller Status ============
export const SELLER_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SUSPENDED: 'Suspended',
};

// ============ Order Status ============
export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

// ============ Payout Status ============
export const PAYOUT_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
};

// ============ Auth Providers ============
export const AUTH_PROVIDER = {
  LOCAL: 'Local',
  GOOGLE: 'Google',
};

// ============ Pagination Defaults ============
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};

// ============ Sort Options ============
export const SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'price', label: 'السعر' },
  { value: 'rating', label: 'التقييم' },
  { value: 'name', label: 'الاسم' },
];

// ============ Payment Methods ============
export const PAYMENT_METHODS = [
  { value: 'CashOnDelivery', label: '💵 الدفع عند الاستلام' },
  { value: 'CreditCard', label: '💳 بطاقة ائتمان' },
];

// ============ Routes ============
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_SELLER: '/register-seller',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  SELLERS: '/sellers',

  // Customer
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  WISHLIST: '/wishlist',
  PROFILE: '/profile',

  // Seller
  SELLER_DASHBOARD: '/seller/dashboard',
  SELLER_PRODUCTS: '/seller/products',
  SELLER_ORDERS: '/seller/orders',
  SELLER_PAYOUTS: '/seller/payouts',
  SELLER_PROFILE: '/seller/profile',
  SELLER_PENDING: '/seller/pending-approval',
  SELLER_SUSPENDED: '/seller/suspended',
  SELLER_REJECTED: '/seller/rejected',

  // SuperAdmin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_SELLERS: '/admin/sellers',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_PAYOUTS: '/admin/payouts',
  ADMIN_LOGS: '/admin/logs',

  // Errors
  UNAUTHORIZED: '/unauthorized',
  FORBIDDEN: '/forbidden',
};

// ============ للتوافق مع الملفات القديمة ============
export const ITEMS_PER_PAGE = PAGINATION.DEFAULT_PAGE_SIZE;