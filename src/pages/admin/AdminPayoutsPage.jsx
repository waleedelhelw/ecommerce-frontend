import { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/common/Pagination';
import { getAllPayouts, processPayout } from '../../api/admin/adminPayoutService';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { payoutStatusMap, getStatusInfo } from '../../utils/orderStatusMap';
import toast from 'react-hot-toast';

const AdminPayoutsPage = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [processDialog, setProcessDialog] = useState(null);
  const [processForm, setProcessForm] = useState({
    approve: true,
    adminNotes: '',
    transactionId: '',
  });
  const [processLoading, setProcessLoading] = useState(false);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const data = await getAllPayouts({
        pageNumber: currentPage,
        pageSize: 10,
      });
      setPayouts(data?.items || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching payouts:', error);
      toast.error('فشل في تحميل طلبات السحب');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [currentPage]);

  const handleProcess = async () => {
    if (!processDialog) return;
    try {
      setProcessLoading(true);
      await processPayout(processDialog.id, processForm);
      toast.success(processForm.approve ? 'تم قبول طلب السحب' : 'تم رفض طلب السحب');
      setProcessDialog(null);
      setProcessForm({ approve: true, adminNotes: '', transactionId: '' });
      fetchPayouts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل معالجة الطلب');
    } finally {
      setProcessLoading(false);
    }
  };

  const columns = [
    {
      header: '#',
      render: (row) => <span className="font-medium">{row.id}</span>,
    },
    {
      header: 'البائع',
      render: (row) => (
        <div>
          <p className="font-medium">{row.sellerName || row.storeName || '—'}</p>
        </div>
      ),
    },
    {
      header: 'المبلغ',
      render: (row) => (
        <span className="font-bold text-green-600">{formatPrice(row.amount)}</span>
      ),
    },
    {
      header: 'طريقة الدفع',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.paymentMethod || '—'}</span>
      ),
    },
    {
      header: 'الحالة',
      render: (row) => {
        const status = getStatusInfo(payoutStatusMap, row.status);
        return (
          <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
            {status.icon} {status.label}
          </span>
        );
      },
    },
    {
      header: 'التاريخ',
      render: (row) => (
        <span className="text-sm text-gray-500">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: 'إجراءات',
      render: (row) =>
        row.status === 'Pending' ? (
          <button
            onClick={() => setProcessDialog(row)}
            className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg"
          >
            معالجة
          </button>
        ) : (
          <span className="text-xs text-gray-400">تمت المعالجة</span>
        ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">💰 إدارة طلبات السحب</h1>

      <DataTable columns={columns} data={payouts} loading={loading} emptyMessage="لا توجد طلبات سحب" />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Process Dialog */}
      {processDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">معالجة طلب السحب</h3>
            <p className="text-sm text-gray-500 mb-4">
              المبلغ: <span className="font-bold text-green-600">{formatPrice(processDialog.amount)}</span>
              <br />
              طريقة الدفع: {processDialog.paymentMethod}
              {processDialog.notes && (
                <>
                  <br />
                  ملاحظات البائع: {processDialog.notes}
                </>
              )}
            </p>

            {/* اختيار قبول / رفض */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setProcessForm({ ...processForm, approve: true })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors
                  ${processForm.approve
                    ? 'bg-green-600 text-white border-green-600'
                    : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                ✅ قبول
              </button>
              <button
                onClick={() => setProcessForm({ ...processForm, approve: false })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors
                  ${!processForm.approve
                    ? 'bg-red-600 text-white border-red-600'
                    : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                ❌ رفض
              </button>
            </div>

            {/* رقم العملية (للقبول) */}
            {processForm.approve && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم العملية</label>
                <input
                  type="text"
                  value={processForm.transactionId}
                  onChange={(e) => setProcessForm({ ...processForm, transactionId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="TXN123456"
                />
              </div>
            )}

            {/* ملاحظات الإدارة */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات الإدارة</label>
              <textarea
                value={processForm.adminNotes}
                onChange={(e) => setProcessForm({ ...processForm, adminNotes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder={processForm.approve ? 'تم التحويل بنجاح...' : 'سبب الرفض...'}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleProcess}
                disabled={processLoading}
                className={`flex-1 py-2.5 rounded-lg font-medium disabled:opacity-50
                  ${processForm.approve
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
              >
                {processLoading ? 'جاري المعالجة...' : processForm.approve ? 'تأكيد القبول' : 'تأكيد الرفض'}
              </button>
              <button
                onClick={() => {
                  setProcessDialog(null);
                  setProcessForm({ approve: true, adminNotes: '', transactionId: '' });
                }}
                className="flex-1 border py-2.5 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayoutsPage;