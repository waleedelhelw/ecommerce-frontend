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

// ============ ✅ Return Status ============
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

// ============ ✅ Return Reasons ============
export const RETURN_REASONS = {
  DEFECTIVE: 'Defective',
  WRONG_ITEM: 'WrongItem',
  NOT_AS_DESCRIBED: 'NotAsDescribed',
  DAMAGED_IN_SHIPPING: 'DamagedInShipping',
  MISSING_PARTS: 'MissingParts',
  CHANGED_MIND: 'ChangedMind',
  OTHER: 'Other',
};

// ============ ✅ Shipping Cost Paid By ============
export const SHIPPING_COST_PAID_BY = {
  CUSTOMER: 'Customer',
  SELLER: 'Seller',
  PLATFORM: 'Platform',
};

// ============ ✅ Installment Status - 🆕 جديد ============
export const INSTALLMENT_STATUS = {
  PENDING: 'Pending',
  PAID: 'Paid',
  WAITING_CONFIRMATION: 'WaitingConfirmation',
  OVERDUE: 'Overdue',
  CANCELLED: 'Cancelled',
};

export const INSTALLMENT_STATUS_LABELS = {
  Pending: { label: '⏳ في انتظار الدفع', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
  WaitingConfirmation: { label: '🧾 مراجعة الإيصال', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  Paid: { label: '✅ مدفوعة', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  Overdue: { label: '🚨 متأخرة', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  Cancelled: { label: '❌ ملغية', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
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

// ============ ✅ Payment Target - جديد ============
export const PAYMENT_TARGET = {
  PLATFORM: 'Platform',
  SELLER: 'Seller',
};

export const PAYMENT_TARGET_LABELS = {
  Platform: { label: 'محفظة المنصة', icon: '🏛️', shortLabel: 'المنصة' },
  Seller: { label: 'حساب التاجر', icon: '🏪', shortLabel: 'التاجر' },
};

// ============ ✅ Payment Status Labels - جديد ============
export const PAYMENT_STATUS_LABELS = {
  Pending: { label: 'بانتظار الدفع', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  WaitingConfirmation: { label: 'بانتظار التأكيد', color: 'bg-blue-100 text-blue-800', icon: '🧾' },
  Confirmed: { label: 'تم التأكيد', color: 'bg-green-100 text-green-800', icon: '✅' },
  Completed: { label: 'مكتمل', color: 'bg-emerald-100 text-emerald-800', icon: '🎉' },
  Failed: { label: 'فاشل', color: 'bg-red-100 text-red-800', icon: '❌' },
  Refunded: { label: 'مسترجع', color: 'bg-amber-100 text-amber-800', icon: '🔄' },
};

// ============ ✅ Payment Label Values - جديد ============
export const PAYMENT_LABEL_VALUES = {
  FULL: 'الدفعة كاملة',
  FIRST: 'الدفعة الأولى',
  REMAINING: 'الدفعة المتبقية',
  COD: 'دفعة COD',
};

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

// ============ ✅ Return Window (بالأيام) ============
export const RETURN_WINDOW_DAYS = 3;
export const RETURN_SHIPPING_DEADLINE_DAYS = 5;

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
  RETURN_POLICY: '/return-policy',

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

  // ✅ Seller Returns
  SELLER_RETURNS: '/seller/returns',
  SELLER_RETURN_DETAILS: '/seller/returns/:id',

  // SuperAdmin / Admin
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

  // ✅ Admin Returns
  ADMIN_RETURNS: '/admin/returns',
  ADMIN_RETURN_DETAILS: '/admin/returns/:id',

  // 🆕 ✅ Admin Installments
  ADMIN_INSTALLMENTS: '/admin/installments',

  // Errors
  UNAUTHORIZED: '/unauthorized',
  FORBIDDEN: '/forbidden',
};

// ============ للتوافق مع الملفات القديمة ============
export const ITEMS_PER_PAGE = PAGINATION.DEFAULT_PAGE_SIZE;