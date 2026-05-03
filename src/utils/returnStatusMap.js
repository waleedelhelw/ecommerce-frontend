// ============ ✅ Return Status Map ============
export const returnStatusMap = {
  Pending: {
    label: 'فى انتظار البائع',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
    step: 1,
  },
  Approved: {
    label: 'تمت الموافقة',
    color: 'bg-green-100 text-green-800',
    icon: '✅',
    step: 2,
  },
  Shipped: {
    label: 'العميل شحن المنتج',
    color: 'bg-purple-100 text-purple-800',
    icon: '📦',
    step: 3,
  },
  Received: {
    label: 'البائع استلم المنتج',
    color: 'bg-blue-100 text-blue-800',
    icon: '📥',
    step: 4,
  },
  Refunded: {
    label: 'تم الإرجاع ✅',
    color: 'bg-emerald-100 text-emerald-800',
    icon: '💰',
    step: 5,
  },
  Rejected: {
    label: 'مرفوض',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
    step: 0,
  },
  Cancelled: {
    label: 'ملغى',
    color: 'bg-gray-100 text-gray-800',
    icon: '🚫',
    step: 0,
  },
  Escalated: {
    label: 'مصعّد للأدمن',
    color: 'bg-orange-100 text-orange-800',
    icon: '⚠️',
    step: 0,
  },
};

// ============ ✅ Return Reason Map ============
export const returnReasonMap = {
  Defective: {
    label: 'المنتج تالف/معطوب',
    icon: '🔧',
    description: 'المنتج وصل تالف أو فيه عيب صناعى',
    fault: 'Seller', // 🆕 المسؤول عن الخطأ
  },
  WrongItem: {
    label: 'منتج خاطئ',
    icon: '❓',
    description: 'وصلنى منتج مختلف عن اللى طلبته',
    fault: 'Seller', // 🆕
  },
  NotAsDescribed: {
    label: 'مش زى الوصف',
    icon: '📝',
    description: 'المنتج مختلف عن الوصف فى الإعلان',
    fault: 'Seller', // 🆕
  },
  DamagedInShipping: {
    label: 'تلف فى الشحن',
    icon: '📦',
    description: 'المنتج اتلف أثناء عملية الشحن',
    fault: 'Platform', // 🆕 شركة الشحن / المنصة
  },
  MissingParts: {
    label: 'ناقص أجزاء',
    icon: '🧩',
    description: 'المنتج وصل بدون بعض الأجزاء',
    fault: 'Seller', // 🆕
  },
  ChangedMind: {
    label: 'غيّرت رأيى',
    icon: '🤔',
    description: 'مش عايز المنتج (تكلفة الشحن على العميل)',
    fault: 'Customer', // 🆕
  },
  Other: {
    label: 'أخرى',
    icon: '💬',
    description: 'سبب آخر (اشرح فى التفاصيل)',
    fault: 'Customer', // 🆕 افتراضى - البائع يقدر يغيّر
  },
};

// ============ ✅ Shipping Cost Paid By Map ============
export const shippingCostPaidByMap = {
  Customer: {
    label: 'العميل يدفع',
    color: 'bg-orange-100 text-orange-800',
    icon: '👤',
    description: 'العميل يتحمل تكلفة شحن المنتج إليك',
  },
  Seller: {
    label: 'البائع يدفع',
    color: 'bg-green-100 text-green-800',
    icon: '🏪',
    description: 'تتحمل أنت تكلفة شحن المنتج (يُخصم من الحساب)',
  },
  Platform: {
    label: 'المنصة تدفع',
    color: 'bg-blue-100 text-blue-800',
    icon: '🏢',
    description: 'المنصة تتحمل تكلفة الشحن (حالات استثنائية)',
  },
};

// ============ Helpers ============
export const getReturnStatusInfo = (status) => {
  return returnStatusMap[status] || {
    label: status || 'غير معروف',
    color: 'bg-gray-100 text-gray-800',
    icon: '❓',
    step: 0,
  };
};

export const getReturnReasonInfo = (reason) => {
  return returnReasonMap[reason] || {
    label: reason || 'غير معروف',
    icon: '❓',
    description: '',
    fault: 'Customer',
  };
};

export const getShippingCostInfo = (paidBy) => {
  return shippingCostPaidByMap[paidBy] || {
    label: paidBy || 'غير محدد',
    color: 'bg-gray-100 text-gray-800',
    icon: '❓',
    description: '',
  };
};

// ============ ✅ 🆕 Auto-Suggest Shipping Cost Paid By ============
/**
 * يقترح مين يدفع شحن الإرجاع بناءً على سبب الإرجاع
 * @param {string} reason - سبب الإرجاع (Defective, WrongItem, ...)
 * @returns {string} - Customer / Seller / Platform
 */
export const suggestShippingCostPaidBy = (reason) => {
  const reasonInfo = returnReasonMap[reason];
  if (!reasonInfo) return 'Customer'; // افتراضى

  // الـ fault بيتحدد فى الـ map نفسه
  return reasonInfo.fault || 'Customer';
};

// ============ ✅ 🆕 تفسير قرار الشحن (للعرض فى الـ UI) ============
/**
 * يرجع تفسير لو القرار طبيعى ولا استثنائى
 * @param {string} reason - سبب الإرجاع
 * @param {string} paidBy - من اللى هيدفع (Customer/Seller/Platform)
 * @returns {Object} { isStandard, message, suggested }
 */
export const getShippingCostExplanation = (reason, paidBy) => {
  const suggested = suggestShippingCostPaidBy(reason);
  const isStandard = suggested === paidBy;

  if (isStandard) {
    const explanations = {
      Seller: '✅ السبب يخص البائع، فمن المنطقى أن يتحمل تكلفة الشحن',
      Platform: '✅ التلف حدث أثناء الشحن، فالمنصة تتحمل التكلفة',
      Customer: '✅ العميل غيّر رأيه، فيتحمل تكلفة الشحن',
    };
    return {
      isStandard: true,
      message: explanations[paidBy] || '✅ القرار يتوافق مع سبب الإرجاع',
      suggested,
    };
  }

  // القرار غير عادى (override)
  const sellerName = shippingCostPaidByMap[suggested]?.label || suggested;
  return {
    isStandard: false,
    message: `⚠️ المقترح حسب السبب: "${sellerName}". تأكد من ذكر سبب التغيير فى الملاحظات.`,
    suggested,
  };
};

// ============ ✅ Check if Order is Returnable ============
/**
 * هل الأوردر قابل للإرجاع؟
 * @param {Object} order - بيانات الأوردر
 * @returns {Object} { canReturn: boolean, reason: string, daysLeft: number }
 */
export const checkOrderReturnable = (order) => {
  if (!order) {
    return { canReturn: false, reason: 'الأوردر غير موجود', daysLeft: 0 };
  }

  // لازم الأوردر يكون Delivered أو Completed
  if (order.status !== 'Delivered' && order.status !== 'Completed') {
    return {
      canReturn: false,
      reason: 'يمكن طلب الإرجاع بعد استلام الطلب فقط',
      daysLeft: 0,
    };
  }

  // لازم يكون فى تاريخ تسليم
  if (!order.deliveredAt) {
    return {
      canReturn: false,
      reason: 'لا يوجد تاريخ تسليم للطلب',
      daysLeft: 0,
    };
  }

  // التحقق من فترة الـ 14 يوم
  const RETURN_WINDOW_DAYS = 14;
  const deliveredDate = new Date(order.deliveredAt);
  const now = new Date();
  const daysSinceDelivery = Math.floor(
    (now - deliveredDate) / (1000 * 60 * 60 * 24)
  );
  const daysLeft = RETURN_WINDOW_DAYS - daysSinceDelivery;

  if (daysSinceDelivery > RETURN_WINDOW_DAYS) {
    return {
      canReturn: false,
      reason: `انتهت فترة الإرجاع (${RETURN_WINDOW_DAYS} يوم). مر ${daysSinceDelivery} يوم على الاستلام`,
      daysLeft: 0,
    };
  }

  return {
    canReturn: true,
    reason: `يمكنك طلب الإرجاع. متبقى ${daysLeft} يوم`,
    daysLeft,
  };
};