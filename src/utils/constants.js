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

// ============ ✅ Order Status - محدّث ============
export const ORDER_STATUS = {
  PENDING_PAYMENT: 'PendingPayment',
  WAITING_CONFIRMATION: 'WaitingConfirmation',
  PAYMENT_CONFIRMED: 'PaymentConfirmed',
  PAYMENT_FAILED: 'PaymentFailed',
  PROCESSING: 'Processing',
  READY_TO_SHIP: 'ReadyToShip',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
};

// ============ ✅ Return Status - 🆕 جديد ============
export const RETURN_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SHIPPED: 'Shipped',
  RECEIVED: 'Received',
  REFUNDED: 'Refunded',
  CANCELLED: 'Cancelled',
  ESCALATED: 'Escalated',
};

// ============ ✅ Return Reasons - 🆕 جديد ============
export const RETURN_REASONS = {
  DEFECTIVE: 'Defective',
  WRONG_ITEM: 'WrongItem',
  NOT_AS_DESCRIBED: 'NotAsDescribed',
  DAMAGED_IN_SHIPPING: 'DamagedInShipping',
  MISSING_PARTS: 'MissingParts',
  CHANGED_MIND: 'ChangedMind',
  OTHER: 'Other',
};

// ============ ✅ Shipping Cost Paid By - 🆕 جديد ============
export const SHIPPING_COST_PAID_BY = {
  CUSTOMER: 'Customer',
  SELLER: 'Seller',
  PLATFORM: 'Platform',
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

// ============ ✅ Payment Methods - محدّث (متوافق مع الباك إند) ============
export const PAYMENT_METHODS = [
  { value: 'CashOnDelivery', label: '💵 الدفع عند الاستلام', icon: '💵', hasFee: true },
  { value: 'VodafoneCash', label: '📱 فودافون كاش', icon: '📱', settingKey: 'PlatformWalletVodafone' },
  { value: 'EtisalatCash', label: '📱 إتصالات كاش', icon: '📱', settingKey: 'PlatformWalletEtisalat' },
  { value: 'OrangeCash', label: '📱 أورانج كاش', icon: '📱', settingKey: 'PlatformWalletOrange' },
  { value: 'InstaPay', label: '🏦 إنستاباي', icon: '🏦', settingKey: 'PlatformInstaPay' },
  { value: 'BankTransfer', label: '🏦 تحويل بنكي', icon: '🏦', settingKey: 'PlatformBankAccount' },
];

// ✅ لعرض اسم طريقة الدفع في صفحة التفاصيل
export const PAYMENT_LABELS = {
  CashOnDelivery: '💵 الدفع عند الاستلام',
  VodafoneCash: '📱 فودافون كاش',
  EtisalatCash: '📱 إتصالات كاش',
  OrangeCash: '📱 أورانج كاش',
  InstaPay: '🏦 إنستاباي',
  BankTransfer: '🏦 تحويل بنكي',
};

// ============ ✅ Payment Status ============
export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  WAITING_CONFIRMATION: 'WaitingConfirmation',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

// ============ ✅ Return Window (بالأيام) - 🆕 جديد ============
export const RETURN_WINDOW_DAYS = 14;
export const RETURN_SHIPPING_DEADLINE_DAYS = 3;

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
  PAYMENT: '/orders/:id/payment',

  // ✅ Customer Returns System
  RETURNS: '/returns',
  RETURN_DETAILS: '/returns/:id',
  CREATE_RETURN: '/returns/new/:orderId',
  RETURN_POLICY: '/return-policy', // Static

  // Seller
  SELLER_DASHBOARD: '/seller/dashboard',
  SELLER_PRODUCTS: '/seller/products',
  SELLER_ORDERS: '/seller/orders',
  SELLER_ORDER_DETAILS: '/seller/orders/:id',
  SELLER_PAYOUTS: '/seller/payouts',
  SELLER_PROFILE: '/seller/profile',
  SELLER_PENDING: '/seller/pending-approval',
  SELLER_SUSPENDED: '/seller/suspended',
  SELLER_REJECTED: '/seller/rejected',

  // 🆕 ✅ Seller Returns
  SELLER_RETURNS: '/seller/returns',
  SELLER_RETURN_DETAILS: '/seller/returns/:id',

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
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_SHIPPING: '/admin/shipping',

  // 🆕 ✅ Admin Returns (هنحتاجهم فى Phase 5B)
  ADMIN_RETURNS: '/admin/returns',
  ADMIN_RETURN_DETAILS: '/admin/returns/:id',

  // Errors
  UNAUTHORIZED: '/unauthorized',
  FORBIDDEN: '/forbidden',
};

// ============ للتوافق مع الملفات القديمة ============
export const ITEMS_PER_PAGE = PAGINATION.DEFAULT_PAGE_SIZE;