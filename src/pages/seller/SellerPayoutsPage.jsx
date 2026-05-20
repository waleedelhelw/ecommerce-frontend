import { useState, useEffect } from 'react';
import { FiDollarSign, FiChevronLeft } from 'react-icons/fi';
import { getMyPayouts, requestPayout } from '../../api/seller/sellerPayoutService';
import { getSellerDashboard } from '../../api/seller/sellerDashboardService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { payoutStatusMap, getStatusInfo } from '../../utils/orderStatusMap';

const statusGradients = {
  Pending: 'from-amber-400 to-orange-500',
  Processing: 'from-blue-400 to-indigo-500',
  Completed: 'from-emerald-400 to-green-500',
  Failed: 'from-red-400 to-rose-500',
  Cancelled: 'from-gray-400 to-gray-500',
};

const StatusBadge = ({ status }) => {
  const info = getStatusInfo(payoutStatusMap, status);
  const gradient = statusGradients[status] || 'from-gray-400 to-gray-500';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r ${gradient} shadow-sm`}>
      <span>{info.icon}</span>
      <span>{info.label}</span>
    </span>
  );
};

const SellerPayoutsPage = () => {
  const [payouts, setPayouts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    amount: '',
    paymentMethod: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payoutsData, dashboardData] = await Promise.all([
        getMyPayouts(),
        getSellerDashboard(),
      ]);
      setPayouts(payoutsData?.items || payoutsData || []);
      setBalance(dashboardData?.balance || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');

    if (!form.amount || parseFloat(form.amount) <= 0) {
      setError('يرجى إدخال مبلغ صحيح');
      return;
    }

    if (parseFloat(form.amount) > balance) {
      setError('المبلغ المطلوب أكبر من الرصيد المتاح');
      return;
    }

    if (!form.paymentMethod) {
      setError('يرجى إدخال طريقة الدفع');
      return;
    }

    try {
      setSubmitting(true);
      await requestPayout({
        amount: parseFloat(form.amount),
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      });
      setSuccessMsg('تم إرسال طلب السحب بنجاح');
      setShowForm(false);
      setForm({ amount: '', paymentMethod: '', notes: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في إرسال الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">الأرباح</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">سحب الأرباح</h1>
          <p className="text-sm text-gray-500 mt-1">إدارة طلبات سحب أرباحك ومتابعة رصيدك</p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-emerald-100 text-sm mb-1 font-medium">الرصيد المتاح للسحب</p>
            <p className="text-3xl sm:text-4xl font-bold tracking-tight">{formatPrice(balance)}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-sm"
          >
            <FiDollarSign size={16} />
            {showForm ? 'إلغاء' : 'طلب سحب جديد'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && <ErrorMessage message={error} />}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {successMsg}
        </div>
      )}

      {/* Request Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/60 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">طلب سحب جديد</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">المبلغ *</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="0.00"
                min="1"
                max={balance}
                step="0.01"
                required
              />
              <p className="text-xs text-gray-400 mt-1.5">الحد الأقصى: {formatPrice(balance)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">طريقة الدفع *</label>
              <input
                type="text"
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="مثال: بنك مصر - حساب رقم ..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">ملاحظات</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="أي ملاحظات إضافية..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2.5 rounded-xl hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 transition-all text-sm font-medium shadow-sm"
              >
                {submitting ? 'جاري الإرسال...' : 'إرسال طلب السحب'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ amount: '', paymentMethod: '', notes: '' });
                }}
                className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all text-sm"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payouts History */}
      {payouts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiDollarSign size={32} className="text-emerald-300" />
          </div>
          <p className="text-gray-400 font-medium">لا توجد طلبات سحب سابقة</p>
          <p className="text-gray-300 text-sm mt-1">جميع طلبات السحب الخاصة بك ستظهر هنا</p>
        </div>
      ) : (
        <>
          {/* Mobile: Card layout */}
          <div className="md:hidden space-y-3">
            {payouts.map((payout) => {
              const status = getStatusInfo(payoutStatusMap, payout.status);
              return (
                <div
                  key={payout.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-sm font-bold text-gray-900">طلب #{payout.id}</span>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(payout.createdAt)}</p>
                    </div>
                    <StatusBadge status={payout.status} />
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">المبلغ</p>
                      <p className="text-lg font-bold text-gray-900">{formatPrice(payout.amount)}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-500 mb-0.5">طريقة الدفع</p>
                      <p className="text-sm font-medium text-gray-700">{payout.paymentMethod}</p>
                    </div>
                  </div>

                  {payout.adminNotes && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <p className="text-xs text-gray-400 mb-0.5">ملاحظات الإدارة:</p>
                      <p className="text-xs text-gray-600">{payout.adminNotes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop: Table layout */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="text-lg font-bold text-gray-900">سجل السحوبات</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">#</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">المبلغ</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">طريقة الدفع</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">الحالة</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">التاريخ</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {payouts.map((payout) => {
                    const status = getStatusInfo(payoutStatusMap, payout.status);
                    return (
                      <tr key={payout.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-gray-900">#{payout.id}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-emerald-600">{formatPrice(payout.amount)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-600">{payout.paymentMethod}</span>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={payout.status} />
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs text-gray-400">{formatDate(payout.createdAt)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs text-gray-400">{payout.adminNotes || '-'}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SellerPayoutsPage;
