import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';
import { orderStatusMap } from '../../utils/orderStatusMap';

const OrderCard = ({ order }) => {
  const status = orderStatusMap[order.status] || orderStatusMap.Pending;

  return (
    <div className="bg-white rounded-xl border p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg">طلب #{order.id}</h3>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt || order.orderDate)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
          {status.icon} {status.label}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span>{order.itemCount || order.orderItems?.length || 0} منتجات</span>
          <span className="mx-2">|</span>
          <span className="font-bold text-gray-900">{formatPrice(order.totalAmount || order.totalPrice)}</span>
        </div>
        <Link
          to={`/orders/${order.id}`}
          className="btn-outline text-sm px-4 py-1.5"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;