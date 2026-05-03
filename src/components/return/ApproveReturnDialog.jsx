import { useState, useEffect } from 'react';
import { FiCheck, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import {
  shippingCostPaidByMap,
  suggestShippingCostPaidBy,
  getShippingCostExplanation,
  getReturnReasonInfo,
} from '../../utils/returnStatusMap';

const ApproveReturnDialog = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  returnReason = null, // 🆕 سبب الإرجاع
}) => {
  // ✅ Auto-suggest based on reason
  const suggestedPaidBy = suggestShippingCostPaidBy(returnReason);

  const [shippingCostPaidBy, setShippingCostPaidBy] = useState(suggestedPaidBy);
  const [notes, setNotes] = useState('');

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setShippingCostPaidBy(suggestShippingCostPaidBy(returnReason));
      setNotes('');
    }
  }, [isOpen, returnReason]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shippingCostPaidBy) {
      toast.error('يرجى اختيار من يدفع تكلفة الشحن');
      return;
    }

    // ⚠️ لو القرار غير عادى ومفيش ملاحظات → نطلب توضيح
    const explanation = getShippingCostExplanation(returnReason, shippingCostPaidBy);
    if (!explanation.isStandard && !notes.trim()) {
      toast.error('يرجى ذكر سبب اختيار قرار شحن مختلف فى الملاحظات');
      return;
    }

    await onConfirm({
      shippingCostPaidBy,
      notes: notes.trim() || null,
    });
  };

  const reasonInfo = getReturnReasonInfo(returnReason);
  const explanation = getShippingCostExplanation(returnReason, shippingCostPaidBy);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✅ الموافقة على طلب الإرجاع"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 🆕 ✅ معلومة عن السبب والمقترح */}
        {returnReason && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <FiInfo className="text-blue-500 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-blue-900">
                  <strong>سبب الإرجاع:</strong> {reasonInfo.icon}{' '}
                  {reasonInfo.label}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  💡 المقترح حسب السبب:{' '}
                  <strong>
                    {shippingCostPaidByMap[suggestedPaidBy]?.icon}{' '}
                    {shippingCostPaidByMap[suggestedPaidBy]?.label}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <p className="text-blue-900">
            ✅ بالموافقة، سيُطلب من العميل شحن المنتج إليك خلال{' '}
            <strong>3 أيام</strong>.
          </p>
        </div>

        {/* مين يدفع الشحن */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            من يدفع تكلفة شحن الإرجاع؟ <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {Object.entries(shippingCostPaidByMap).map(([key, info]) => {
              const isSuggested = suggestedPaidBy === key;
              const isSelected = shippingCostPaidBy === key;

              return (
                <label
                  key={key}
                  className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors relative ${
                    isSelected
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingCostPaidBy"
                    value={key}
                    checked={isSelected}
                    onChange={(e) => setShippingCostPaidBy(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-1.5 flex-wrap">
                      <span>{info.icon}</span>
                      <span>{info.label}</span>
                      {/* 🆕 شارة "مقترح" */}
                      {isSuggested && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                          ⭐ مقترح
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {info.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* 🆕 ⚠️ تحذير لو القرار مش standard */}
          {returnReason && !explanation.isStandard && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <FiAlertTriangle
                className="text-yellow-600 shrink-0 mt-0.5"
                size={16}
              />
              <div className="text-xs text-yellow-800">
                <p className="font-bold mb-1">قرار غير اعتيادى</p>
                <p>{explanation.message}</p>
              </div>
            </div>
          )}

          {/* ✅ تأكيد لو القرار standard */}
          {returnReason && explanation.isStandard && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800">
              {explanation.message}
            </div>
          )}
        </div>

        {/* ملاحظات */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ملاحظات{' '}
            {!explanation.isStandard ? (
              <span className="text-red-500">*</span>
            ) : (
              <span className="text-gray-400 text-xs">(اختيارى)</span>
            )}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder={
              !explanation.isStandard
                ? 'مطلوب: اشرح سبب اختيار قرار شحن مختلف عن المقترح...'
                : 'مثلاً: عنوان مخصص للإرجاع، تعليمات خاصة...'
            }
            required={!explanation.isStandard}
          />
          <p className="text-xs text-gray-500 mt-1">{notes.length}/500 حرف</p>
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
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                جارى الموافقة...
              </>
            ) : (
              <>
                <FiCheck size={18} />
                تأكيد الموافقة
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ApproveReturnDialog;