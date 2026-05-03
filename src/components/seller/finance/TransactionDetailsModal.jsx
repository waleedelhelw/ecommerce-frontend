import { FiX } from 'react-icons/fi';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';
import { getStatusInfo } from '../../../utils/orderStatusMap';
import {
  transactionTypeMap,
  transactionStatusMap,
} from '../../../utils/transactionStatusMap';

const Row = ({ label, value, valueColor = 'text-gray-800' }) => (
  <div className="flex justify-between items-center py-3 border-b last:border-b-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className={`font-medium text-sm ${valueColor}`}>{value}</span>
  </div>
);

const TransactionDetailsModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const typeInfo = getStatusInfo(transactionTypeMap, transaction.type);
  const statusInfo = getStatusInfo(transactionStatusMap, transaction.status);
  const isPositive = transaction.amount >= 0;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-800">
            تفاصيل الحركة المالية
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* المبلغ - بشكل بارز */}
          <div className="text-center mb-5 py-5 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">المبلغ</p>
            <p
              className={`text-3xl font-bold ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? '+' : ''}
              {formatPrice(transaction.amount)}
            </p>
          </div>

          {/* التفاصيل */}
          <div className="space-y-1">
            <Row label="رقم الحركة" value={`#${transaction.id}`} />

            <Row
              label="النوع"
              value={
                <span
                  className={`text-xs px-2 py-1 rounded-full ${typeInfo.color}`}
                >
                  {typeInfo.icon} {typeInfo.label}
                </span>
              }
            />

            <Row
              label="الحالة"
              value={
                <span
                  className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}
                >
                  {statusInfo.icon} {statusInfo.label}
                </span>
              }
            />

            <Row
              label="الرصيد بعد الحركة"
              value={formatPrice(transaction.balanceAfter)}
              valueColor="text-blue-600"
            />

            {transaction.referenceType && (
              <Row
                label="المرجع"
                value={`${transaction.referenceType} #${transaction.referenceId}`}
              />
            )}

            <Row
              label="تاريخ الإنشاء"
              value={formatDate(transaction.createdAt)}
            />

            {transaction.availableAt && (
              <Row
                label="متاح في"
                value={formatDate(transaction.availableAt)}
              />
            )}

            {transaction.processedAt && (
              <Row
                label="تاريخ المعالجة"
                value={formatDate(transaction.processedAt)}
              />
            )}
          </div>

          {/* الوصف */}
          {transaction.description && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">الوصف</p>
              <p className="text-sm text-gray-700">{transaction.description}</p>
            </div>
          )}

          {/* ملاحظات */}
          {transaction.notes && (
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">ملاحظات</p>
              <p className="text-sm text-gray-700">{transaction.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;