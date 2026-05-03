import { FiEye, FiInbox } from 'react-icons/fi';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';
import { getStatusInfo } from '../../../utils/orderStatusMap';
import {
  transactionTypeMap,
  transactionStatusMap,
} from '../../../utils/transactionStatusMap';
import SortableHeader from './SortableHeader';

const TransactionsTable = ({
  transactions,
  onViewDetails,
  sortBy,
  sortOrder,
  onSort,
}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-12 text-center">
        <FiInbox size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-gray-400">لا توجد معاملات</p>
        <p className="text-xs text-gray-300 mt-1">
          جرب تعديل الفلاتر أو البحث
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <SortableHeader
                label="#"
                field="id"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
              <SortableHeader
                label="النوع"
                field="type"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
              <SortableHeader
                label="الوصف"
                field="description"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
                sortable={false}
              />
              <SortableHeader
                label="المبلغ"
                field="amount"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
              <SortableHeader
                label="الحالة"
                field="status"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
              <SortableHeader
                label="التاريخ"
                field="createdAt"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
              <SortableHeader
                label="إجراء"
                field="actions"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
                sortable={false}
              />
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((tx) => {
              const typeInfo = getStatusInfo(transactionTypeMap, tx.type);
              const statusInfo = getStatusInfo(transactionStatusMap, tx.status);
              const isPositive = tx.amount >= 0;

              return (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    #{tx.id}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${typeInfo.color}`}
                    >
                      {typeInfo.icon} {typeInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                    {tx.description}
                    {tx.referenceType && tx.referenceId && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        {tx.referenceType} #{tx.referenceId}
                      </div>
                    )}
                  </td>
                  <td
                    className={`px-4 py-3 font-bold ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {formatPrice(tx.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}
                    >
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {formatDate(tx.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewDetails(tx)}
                      className="text-green-600 hover:text-green-700 transition-colors p-1 hover:bg-green-50 rounded"
                      title="عرض التفاصيل"
                    >
                      <FiEye size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;