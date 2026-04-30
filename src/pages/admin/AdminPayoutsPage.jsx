import { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/common/Pagination';
import { getAllPayouts, processPayout, uploadPayoutReceipt } from '../../api/admin/adminPayoutService';
import { uploadImage } from '../../utils/cloudinary';
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

  const [receiptDialog, setReceiptDialog] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [receiptUploading, setReceiptUploading] = useState(false);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const data = await getAllPayouts({
        pageNumber: currentPage,
        pageSize: 10,
      });
      console.log('Payouts Data:', JSON.stringify(data, null, 2));
      setPayouts(data?.items || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
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
      toast.success(processForm.approve ? 'تم قبول طلب السحب ✅' : 'تم رفض طلب السحب ❌');
      setProcessDialog(null);
      setProcessForm({ approve: true, adminNotes: '', transactionId: '' });
      fetchPayouts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل معالجة الطلب');
    } finally {
      setProcessLoading(false);
    }
  };

  const handleReceiptFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('اختر صورة فقط'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('الحد الأقصى 5MB'); return; }
    setReceiptFile(file);
    setReceiptPreview(URL.createObjectURL(file));
  };

  const handleUploadReceipt = async () => {
    if (!receiptFile || !receiptDialog) return;
    try {
      setReceiptUploading(true);
      const imageUrl = await uploadImage(receiptFile);
      await uploadPayoutReceipt(receiptDialog.id, { adminReceiptImageUrl: imageUrl });
      toast.success('تم رفع إيصال التحويل ✅');
      setReceiptDialog(null);
      setReceiptFile(null);
      setReceiptPreview(null);
      fetchPayouts();
    } catch (err) {
      toast.error('فشل رفع الإيصال');
    } finally {
      setReceiptUploading(false);
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
          <p className="font-semibold text-gray-800">{row.storeName || row.sellerName || '—'}</p>
          {row.sellerName && row.storeName && (
            <p className="text-xs text-gray-500">{row.sellerName}</p>
          )}
          <p className="text-xs text-gray-400">ID: {row.sellerId}</p>
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
        <div>
          <p className="text-sm text-gray-700">{formatDate(row.createdAt)}</p>
          {row.processedAt && (
            <p className="text-xs text-gray-400">معالجة: {formatDate(row.processedAt)}</p>
          )}
        </div>
      ),
    },
    {
      header: 'إجراءات',
      render: (row) => (
        <div className="flex gap-2">
          {row.status === 'Pending' && (
            <button
              onClick={() => setProcessDialog(row)}
              className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg"
            >
              ⚙️ معالجة
            </button>
          )}
          {row.status === 'Completed' && !row.adminReceiptImageUrl && (
            <button
              onClick={() => setReceiptDialog(row)}
              className="text-sm font-medium text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg"
            >
              📤 رفع إيصال
            </button>
          )}
          {row.adminReceiptImageUrl && (
            <a
              href={row.adminReceiptImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg"
            >
              🧾 الإيصال
            </a>
          )}
          {row.status !== 'Pending' && !row.adminReceiptImageUrl && row.status !== 'Completed' && (
            <span className="text-xs text-gray-400">تمت المعالجة</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">💰 إدارة طلبات السحب</h1>

      <DataTable columns={columns} data={payouts} loading={loading} emptyMessage="لا توجد طلبات سحب" />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Process Dialog */}
      {processDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">معالجة طلب السحب</h3>
            <div className="text-sm text-gray-500 mb-4 space-y-1">
              <p>
                البائع: <span className="font-medium text-gray-800">
                  {processDialog.storeName || processDialog.sellerName}
                </span>
                <span className="text-xs text-gray-400 mr-1">(ID: {processDialog.sellerId})</span>
              </p>
              <p>
                المبلغ: <span className="font-bold text-green-600">{formatPrice(processDialog.amount)}</span>
              </p>
              <p>طريقة الدفع: {processDialog.paymentMethod}</p>
              {processDialog.notes && (
                <p>ملاحظات البائع: {processDialog.notes}</p>
              )}
            </div>

            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setProcessForm({ ...processForm, approve: true })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  processForm.approve ? 'bg-green-600 text-white border-green-600' : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                ✅ قبول
              </button>
              <button
                onClick={() => setProcessForm({ ...processForm, approve: false })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  !processForm.approve ? 'bg-red-600 text-white border-red-600' : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                ❌ رفض
              </button>
            </div>

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
                className={`flex-1 py-2.5 rounded-lg font-medium disabled:opacity-50 ${
                  processForm.approve ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {processLoading ? 'جاري المعالجة...' : processForm.approve ? 'تأكيد القبول' : 'تأكيد الرفض'}
              </button>
              <button
                onClick={() => { setProcessDialog(null); setProcessForm({ approve: true, adminNotes: '', transactionId: '' }); }}
                className="flex-1 border py-2.5 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Upload Dialog */}
      {receiptDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">📤 رفع إيصال التحويل</h3>
            <div className="text-sm text-gray-500 mb-4">
              <p>طلب سحب #{receiptDialog.id}</p>
              <p>البائع: <span className="font-medium">{receiptDialog.storeName || receiptDialog.sellerName}</span></p>
              <p>المبلغ: <span className="font-bold text-green-600">{formatPrice(receiptDialog.amount)}</span></p>
            </div>

            {!receiptPreview ? (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
                <span className="text-3xl">📤</span>
                <p className="mt-2 text-sm text-gray-600">اضغط لاختيار صورة الإيصال</p>
                <input type="file" accept="image/*" onChange={handleReceiptFileChange} className="hidden" />
              </label>
            ) : (
              <div className="relative mb-4">
                <img src={receiptPreview} alt="إيصال" className="w-full rounded-xl border" />
                <button
                  onClick={() => { setReceiptFile(null); setReceiptPreview(null); }}
                  className="absolute top-2 left-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUploadReceipt}
                disabled={!receiptFile || receiptUploading}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                {receiptUploading ? 'جاري الرفع...' : '✅ رفع الإيصال'}
              </button>
              <button
                onClick={() => { setReceiptDialog(null); setReceiptFile(null); setReceiptPreview(null); }}
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