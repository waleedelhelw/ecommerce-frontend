import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { INSTALLMENT_STATUS_LABELS } from '../../utils/constants';

const InstallmentTimeline = ({ installments = [], onPayClick, showPayButton = false, showConfirmButton = false, onConfirmClick }) => {
  if (!installments || installments.length === 0) return null;

  const getStatusInfo = (status) => {
    return INSTALLMENT_STATUS_LABELS[status] || {
      label: status,
      color: 'text-gray-600',
      bg: 'bg-gray-50 border-gray-200',
    };
  };

  const getStepIcon = (status, number) => {
    switch (status) {
      case 'Paid':
        return '✅';
      case 'WaitingConfirmation':
        return '🧾';
      case 'Overdue':
        return '🚨';
      case 'Cancelled':
        return '❌';
      default:
        return `${number}`;
    }
  };

  // حساب الإجمالي المدفوع والمتبقي
  const totalPaid = installments
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amount, 0);
  const totalAmount = installments.reduce((sum, i) => sum + i.amount, 0);
  const remaining = totalAmount - totalPaid;
  const progressPercentage = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">📋 خطة التقسيط</h3>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {installments.filter((i) => i.status === 'Paid').length} / {installments.length} مدفوع
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span>المدفوع: {formatPrice(totalPaid)}</span>
            <span>المتبقي: {formatPrice(remaining)}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div
              className="bg-green-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Installments List */}
      <div className="p-4 space-y-3">
        {installments
          .sort((a, b) => a.installmentNumber - b.installmentNumber)
          .map((installment, index) => {
            const statusInfo = getStatusInfo(installment.status);
            const isPayable = installment.status === 'Pending' || installment.status === 'Overdue';
            const isConfirmable = installment.status === 'WaitingConfirmation';

            return (
              <div
                key={installment.id || index}
                className={`relative border rounded-xl p-4 transition-all ${statusInfo.bg}`}
              >
                {/* الخط الرابط */}
                {index < installments.length - 1 && (
                  <div className="absolute right-7 top-full w-0.5 h-3 bg-gray-200 z-0" />
                )}

                <div className="flex items-start gap-3">
                  {/* أيقونة الخطوة */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${
                      installment.status === 'Paid'
                        ? 'bg-green-500 text-white'
                        : installment.status === 'WaitingConfirmation'
                        ? 'bg-blue-500 text-white'
                        : installment.status === 'Overdue'
                        ? 'bg-red-500 text-white'
                        : installment.status === 'Cancelled'
                        ? 'bg-gray-400 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {getStepIcon(installment.status, installment.installmentNumber)}
                  </div>

                  {/* المحتوى */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-800">
                        الدفعة {installment.installmentNumber}
                      </h4>
                      <span className={`text-sm font-bold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xl font-bold text-blue-700">
                        {formatPrice(installment.amount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      {installment.dueDate && (
                        <span>📅 الاستحقاق: {formatDate(installment.dueDate)}</span>
                      )}
                      {installment.paidAt && (
                        <span className="text-green-600">✅ دُفعت: {formatDate(installment.paidAt)}</span>
                      )}
                    </div>

                    {/* صورة الإيصال */}
                    {installment.paymentProofUrl && (
                      <div className="mt-2">
                        <a
                          href={installment.paymentProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          📎 عرض إيصال الدفع
                        </a>
                      </div>
                    )}

                    {/* زر الدفع (للعميل) */}
                    {showPayButton && isPayable && (
                      <button
                        onClick={() => onPayClick(installment)}
                        className={`mt-3 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all ${
                          installment.status === 'Overdue'
                            ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {installment.status === 'Overdue' ? '🚨 ادفع الآن (متأخرة!)' : '💳 ادفع هذه الدفعة'}
                      </button>
                    )}

                    {/* زر التأكيد (للأدمن) */}
                    {showConfirmButton && isConfirmable && (
                      <button
                        onClick={() => onConfirmClick(installment)}
                        className="mt-3 px-4 py-2 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-all"
                      >
                        ✅ تأكيد الدفع
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default InstallmentTimeline;