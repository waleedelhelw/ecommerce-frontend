import API from '../axiosInstance';

const BASE = '/seller/finance';

// ============ ملخص المركز المالي ============
export const getFinanceSummary = async () => {
  const response = await API.get(`${BASE}/summary`);
  return response.data.data;
};

// ============ قائمة الحركات (Paginated + Filters + Sorting + Search) ============
export const getTransactions = async (params) => {
  // params: { type, status, fromDate, toDate, search, sortBy, sortOrder, pageNumber, pageSize }
  const response = await API.get(`${BASE}/transactions`, { params });
  return response.data.data;
};

// ============ تفاصيل حركة واحدة ============
export const getTransactionById = async (id) => {
  const response = await API.get(`${BASE}/transactions/${id}`);
  return response.data.data;
};

// ============ تقرير سنوي (12 شهر) ============
export const getYearlyReport = async (year) => {
  const response = await API.get(`${BASE}/report/yearly`, {
    params: { year },
  });
  return response.data.data;
};

// ============ تفصيل الأرباح (Pie Chart) ============
export const getEarningsBreakdown = async (fromDate, toDate) => {
  const params = {};
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;

  const response = await API.get(`${BASE}/breakdown`, { params });
  return response.data.data;
};