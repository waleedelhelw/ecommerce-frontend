// ============ Transaction Type Map ============
export const transactionTypeMap = {
  Sale: {
    label: 'بيع',
    color: 'bg-green-100 text-green-800',
    icon: '💰',
  },
  Commission: {
    label: 'عمولة المنصة',
    color: 'bg-orange-100 text-orange-800',
    icon: '🏛️',
  },
  Refund: {
    label: 'استرجاع',
    color: 'bg-red-100 text-red-800',
    icon: '↩️',
  },
  Payout: {
    label: 'سحب أرباح',
    color: 'bg-blue-100 text-blue-800',
    icon: '💸',
  },
  Adjustment: {
    label: 'تعديل إداري',
    color: 'bg-purple-100 text-purple-800',
    icon: '⚙️',
  },
  Bonus: {
    label: 'مكافأة',
    color: 'bg-emerald-100 text-emerald-800',
    icon: '🎁',
  },
};

// ============ Transaction Status Map ============
export const transactionStatusMap = {
  Pending: {
    label: 'معلق',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
  },
  Available: {
    label: 'متاح',
    color: 'bg-blue-100 text-blue-800',
    icon: '✅',
  },
  Completed: {
    label: 'مكتمل',
    color: 'bg-green-100 text-green-800',
    icon: '🎉',
  },
  Cancelled: {
    label: 'ملغي',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
  },
};