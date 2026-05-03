import { useState, useEffect } from 'react';
import { FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';

const RejectReturnDialog = ({ isOpen, onClose, onConfirm, loading = false }) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!isOpen) setReason('');
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 10) {
      toast.error('سبب الرفض مطلوب ولا يقل عن 10 أحرف');
      return;
    }
    await onConfirm({ reason: reason.trim() });
  };

  const quickReasons = [
    'المنتج خارج فترة الإرجاع المسموح بها',
    'المنتج تم استخدامه ولا يصلح للإرجاع',
    'الصور المرفقة لا توضح وجود مشكلة فعلية',
    'سبب الإرجاع غير مقبول حسب سياسة المتجر',
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="❌ رفض طلب الإرجاع" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
          <p className="text-red-900">
            ⚠️ بالرفض، سيتم إخطار العميل برفض طلب الإرجاع. تأكد من توضيح السبب
            بشكل واضح.
          </p>
        </div>

        {/* أسباب جاهزة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            أسباب شائعة (اضغط لاستخدامها)
          </label>
          <div className="space-y-1.5">
            {quickReasons.map((qr, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setReason(qr)}
                className="w-full text-right text-xs px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200"
              >
                {qr}
              </button>
            ))}
          </div>
        </div>

        {/* السبب */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            سبب الرفض <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="اشرح للعميل سبب رفض طلب الإرجاع..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {reason.length}/500 حرف (الحد الأدنى: 10 أحرف)
          </p>
        </div>

        {/* الأزرار */}
        <div className="flex gap-3 justify-end pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading || reason.trim().length < 10}
            className="btn-danger flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                جارى الرفض...
              </>
            ) : (
              <>
                <FiXCircle size={18} />
                تأكيد الرفض
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RejectReturnDialog;