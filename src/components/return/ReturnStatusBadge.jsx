import { getReturnStatusInfo } from '../../utils/returnStatusMap';

const ReturnStatusBadge = ({ status, size = 'md' }) => {
  const statusInfo = getReturnStatusInfo(status);

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${statusInfo.color} ${sizes[size]}`}
    >
      <span>{statusInfo.icon}</span>
      <span>{statusInfo.label}</span>
    </span>
  );
};

export default ReturnStatusBadge;