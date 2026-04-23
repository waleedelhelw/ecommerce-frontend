import { useState, useEffect } from 'react';
import { FiDollarSign } from 'react-icons/fi';
import { getMyPayouts, requestPayout } from '../../api/seller/sellerPayoutService';
import { getSellerDashboard } from '../../api/seller/sellerDashboardService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { payoutStatusMap, getStatusInfo } from '../../utils/orderStatusMap';

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">سحب الأرباح</h1>
        <p className="text-gray-500 mt-1">إدارة طلبات سحب أرباحك</p>
      </div>

      {/* كارت الرصيد */}
      <div className="bg-gradient-to-l from-green-500 to-green-600 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm mb-1">الرصيد المتاح</p>
            <p className="text-3xl font-bold">{formatPrice(balance)}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-green-600 px-4 py-2.5 rounded-lg font-medium hover:bg-green-50 transition-colors"
          >
            <FiDollarSign className="inline ml-1" size={18} />
            طلب سحب
          </button>
        </div>
      </div>

      {/* رسائل */}
      {error && <ErrorMessage message={error} />}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          ✅ {successMsg}
        </div>
      )}

      {/* نموذج طلب سحب */}
      {showForm && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">طلب سحب جديد</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ *</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
                min="1"
                max={balance}
                step="0.01"
                required
              />
              <p className="text-xs text-gray-400 mt-1">الحد الأقصى: {formatPrice(balance)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">طريقة الدفع *</label>
              <input
                type="text"
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                placeholder="مثال: بنك مصر - حساب رقم ..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                placeholder="أي ملاحظات إضافية..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                {submitting ? 'جاري الإرسال...' : 'إرسال طلب السحب'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ amount: '', paymentMethod: '', notes: '' });
                }}
                className="px-6 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* جدول السحوبات السابقة */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">سجل السحوبات</h2>
        </div>

        {payouts.length === 0 ? (
          <div className="p-12 text-center">
            <FiDollarSign size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-400">لا توجد طلبات سحب سابقة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">#</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">المبلغ</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">طريقة الدفع</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">الحالة</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">التاريخ</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">ملاحظات الإدارة</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payouts.map((payout) => {
                  const status = getStatusInfo(payoutStatusMap, payout.status);
                  return (
                    <tr key={payout.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">#{payout.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {formatPrice(payout.amount)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{payout.paymentMethod}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {formatDate(payout.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {payout.adminNotes || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPayoutsPage;