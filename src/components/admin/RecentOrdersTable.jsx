import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';
import { orderStatusMap } from '../../utils/orderStatusMap';

const RecentOrdersTable = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-bold mb-4">📋 آخر الطلبات</h3>
        <p className="text-gray-500 text-center py-8">لا توجد طلبات</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="font-bold">📋 آخر الطلبات</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="text-right px-6 py-3 font-semibold">#</th>
              <th className="text-right px-6 py-3 font-semibold">العميل</th>
              <th className="text-right px-6 py-3 font-semibold">المبلغ</th>
              <th className="text-right px-6 py-3 font-semibold">الحالة</th>
              <th className="text-right px-6 py-3 font-semibold">التاريخ</th>
              <th className="text-right px-6 py-3 font-semibold">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = orderStatusMap[order.status] || orderStatusMap.Pending;
              return (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4 text-sm">
                    {order.customerName || order.userName || `${order.userFirstName || ''} ${order.userLastName || ''}`.trim() || 'غير معروف'}
                  </td>
                  <td className="px-6 py-4 font-bold text-sm">
                    {formatPrice(order.totalAmount || order.totalPrice)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(order.createdAt || order.orderDate)}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      عرض
                    </Link>
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

export default RecentOrdersTable;