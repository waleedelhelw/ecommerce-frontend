import { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/admin/adminDashboardService';
import adminPaymentService from '../api/admin/adminPaymentService';

const useAdminNotificationCounts = () => {
  const [counts, setCounts] = useState({
    pendingPayments: 0,
    total: 0,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchCounts() {
      try {
        const [payments] = await Promise.all([
          adminPaymentService.getPendingPayments().catch(() => null),
        ]);

        if (cancelled) return;

        const paymentsList = payments?.items || payments?.data || payments || [];
        const pendingPayments = Array.isArray(paymentsList) ? paymentsList.length : 0;

        setCounts({
          pendingPayments,
          total: pendingPayments,
        });
      } catch {
        // silent
      }
    }

    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return counts;
};

export default useAdminNotificationCounts;
