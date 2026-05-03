import { useState, useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';

const EscalateReturnDialog = ({ isOpen, onClose, onConfirm, loading = false }) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!isOpen) setReason('');
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 20) {
      toast.error('سبب التصعيد مطلوب ولا يقل عن 20 حرف');
      return;
    }
    await onConfirm({ reason: reason.trim() });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚠️ تصعيد للإدارة" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
          <p className="text-orange-900 mb-2 font-bold">
            ⚠️ متى تستخدم التصعيد؟
          </p>
          <ul className="list-disc list-inside text-orange-800 space-y-1 text-xs">
            <li>وجود نزاع مع العميل لا يمكن حله</li>
            <li>المنتج المرتجع لا يطابق الموصوف فى طلب الإرجاع</li>
            <li>اشتباه فى محاولة احتيال</li>
            <li>حالات استثنائية تحتاج تدخل الإدارة</li>
          </ul>
        </div>

        {/* السبب */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            سبب التصعيد <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={5}
            maxLength={1000}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="اشرح بالتفصيل سبب التصعيد للإدارة (أرفق أى تفاصيل أو أدلة مهمة)..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {reason.length}/1000 حرف (الحد الأدنى: 20 حرف)
          </p>
        </div>

        {/* تنبيه */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
          💡 ستقوم الإدارة بمراجعة الطلب والتواصل معك خلال 24-48 ساعة لاتخاذ
          القرار المناسب.
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
            disabled={loading || reason.trim().length < 20}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                جارى التصعيد...
              </>
            ) : (
              <>
                <FiAlertTriangle size={18} />
                تأكيد التصعيد
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EscalateReturnDialog;