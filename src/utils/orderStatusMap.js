// ============ ✅ Order Status Map - محدّث بالحالات الجديدة ============
export const orderStatusMap = {
  PendingPayment: {
    label: 'في انتظار الدفع',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
    step: 1,
  },
  WaitingConfirmation: {
    label: 'في انتظار تأكيد الدفع',
    color: 'bg-orange-100 text-orange-800',
    icon: '🧾',
    step: 2,
  },
  PaymentConfirmed: {
    label: 'تم تأكيد الدفع',
    color: 'bg-teal-100 text-teal-800',
    icon: '✅',
    step: 3,
  },
  PaymentFailed: {
    label: 'فشل الدفع',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
    step: 2,
  },
  Processing: {
    label: 'قيد التجهيز',
    color: 'bg-blue-100 text-blue-800',
    icon: '🔄',
    step: 4,
  },
  ReadyToShip: {
    label: 'جاهز للشحن',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '📦',
    step: 5,
  },
  Shipped: {
    label: 'تم الشحن',
    color: 'bg-purple-100 text-purple-800',
    icon: '🚚',
    step: 6,
  },
  Delivered: {
    label: 'تم التسليم',
    color: 'bg-green-100 text-green-800',
    icon: '✅',
    step: 7,
  },
  Completed: {
    label: 'مكتمل',
    color: 'bg-emerald-100 text-emerald-800',
    icon: '🎉',
    step: 8,
  },
  Cancelled: {
    label: 'ملغي',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
    step: 0,
  },
  Refunded: {
    label: 'تم الاسترجاع',
    color: 'bg-amber-100 text-amber-800',
    icon: '🔄',
    step: 0,
  },
  // للتوافق مع القديم
  Pending: {
    label: 'في الانتظار',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
    step: 1,
  },
};

// ============ Seller Status Map ============
export const sellerStatusMap = {
  Pending: {
    label: 'في انتظار الموافقة',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
  },
  Approved: {
    label: 'معتمد',
    color: 'bg-green-100 text-green-800',
    icon: '✅',
  },
  Rejected: {
    label: 'مرفوض',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
  },
  Suspended: {
    label: 'موقوف',
    color: 'bg-gray-100 text-gray-800',
    icon: '🚫',
  },
};

// ============ Payout Status Map ============
export const payoutStatusMap = {
  Pending: {
    label: 'في الانتظار',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
  },
  Processing: {
    label: 'قيد المعالجة',
    color: 'bg-blue-100 text-blue-800',
    icon: '🔄',
  },
  Completed: {
    label: 'مكتمل',
    color: 'bg-green-100 text-green-800',
    icon: '✅',
  },
  Failed: {
    label: 'فشل',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
  },
  Cancelled: {
    label: 'ملغي',
    color: 'bg-gray-100 text-gray-800',
    icon: '🚫',
  },
};

// ============ ✅ Payment Status Map - جديد ============
export const paymentStatusMap = {
  Pending: {
    label: 'في الانتظار',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
  },
  WaitingConfirmation: {
    label: 'في انتظار المراجعة',
    color: 'bg-orange-100 text-orange-800',
    icon: '🧾',
  },
  Confirmed: {
    label: 'مؤكد',
    color: 'bg-green-100 text-green-800',
    icon: '✅',
  },
  Completed: {
    label: 'مكتمل',
    color: 'bg-emerald-100 text-emerald-800',
    icon: '🎉',
  },
  Failed: {
    label: 'فشل',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
  },
  Refunded: {
    label: 'مسترجع',
    color: 'bg-amber-100 text-amber-800',
    icon: '🔄',
  },
};

// ============ Helper Function ============
export const getStatusInfo = (statusMap, status) => {
  return statusMap[status] || {
    label: status || 'غير معروف',
    color: 'bg-gray-100 text-gray-800',
    icon: '❓',
  };
};