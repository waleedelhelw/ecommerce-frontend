import { useState, useEffect } from 'react';
import { getSellerDashboard } from '../api/seller/sellerDashboardService';
import { getFinanceSummary } from '../api/seller/sellerFinanceService';

const useSellerNotificationCounts = () => {
  const [counts, setCounts] = useState({
    pendingOrders: 0,
    pendingPayments: 0,
    total: 0,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchCounts() {
      try {
        const [dashboard, finance] = await Promise.all([
          getSellerDashboard().catch(() => null),
          getFinanceSummary().catch(() => null),
        ]);

        if (cancelled) return;

        const pendingOrders = dashboard?.pendingOrders || 0;
        const pendingPayments = finance?.pendingSelfPayments || 0;

        setCounts({
          pendingOrders,
          pendingPayments,
          total: pendingOrders + pendingPayments,
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

export default useSellerNotificationCounts;
