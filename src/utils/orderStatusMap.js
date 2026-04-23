// ============ Order Status Map ============
export const orderStatusMap = {
  Pending: {
    label: 'في الانتظار',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
  },
  Processing: {
    label: 'قيد التجهيز',
    color: 'bg-blue-100 text-blue-800',
    icon: '🔄',
  },
  Shipped: {
    label: 'تم الشحن',
    color: 'bg-purple-100 text-purple-800',
    icon: '🚚',
  },
  Delivered: {
    label: 'تم التسليم',
    color: 'bg-green-100 text-green-800',
    icon: '✅',
  },
  Cancelled: {
    label: 'ملغي',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
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

// ============ Helper Function ============
export const getStatusInfo = (statusMap, status) => {
  return statusMap[status] || {
    label: status || 'غير معروف',
    color: 'bg-gray-100 text-gray-800',
    icon: '❓',
  };
};