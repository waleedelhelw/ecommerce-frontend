import { orderStatusMap } from '../../utils/orderStatusMap';

const OrderStatusBadge = ({ status }) => {
  const statusInfo = orderStatusMap[status] || orderStatusMap.Pending;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
      {statusInfo.icon} {statusInfo.label}
    </span>
  );
};

export default OrderStatusBadge;