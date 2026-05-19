import { Link } from 'react-router-dom';
import { FiPackage, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';
import ReturnStatusBadge from './ReturnStatusBadge';

const ReturnCard = ({
  returnRequest,
  basePath = '/returns', // /returns | /seller/returns | /admin/returns
}) => {
  if (!returnRequest) return null;

  const itemsCount = returnRequest.items?.length || 0;
  const imagesCount = returnRequest.images?.length || 0;
  const firstImage = returnRequest.images?.[0]?.imageUrl;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-gray-900">
              {returnRequest.returnNumber}
            </h3>
            <span className="text-xs text-gray-400">
              #طلب {returnRequest.orderId}
            </span>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <FiCalendar size={14} />
            {formatDate(returnRequest.createdAt)}
          </p>
        </div>
        <ReturnStatusBadge status={returnRequest.status} size="sm" />
      </div>

      {/* Body */}
      <div className="flex gap-4 mb-4">
        {/* Image Preview */}
        {firstImage && (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border bg-gray-50 flex-shrink-0">
            <img
              src={firstImage}
              alt="صورة الإرجاع"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
            {imagesCount > 1 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">
                +{imagesCount - 1} صورة
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 space-y-1.5">
          <p className="text-sm text-gray-700 line-clamp-2">
            <span className="font-medium">السبب: </span>
            <span className="text-gray-600">
              {returnRequest.reasonDisplay || returnRequest.reason}
            </span>
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FiPackage size={14} />
              {itemsCount} منتج
            </span>
            <span className="flex items-center gap-1 font-bold text-emerald-600">
              <FiDollarSign size={14} />
              {formatPrice(returnRequest.totalRefundAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {basePath === '/seller/returns' && returnRequest.customerName && (
            <span>العميل: {returnRequest.customerName}</span>
          )}
          {basePath === '/returns' && returnRequest.storeName && (
            <span>المتجر: {returnRequest.storeName}</span>
          )}
          {basePath === '/admin/returns' && (
            <span>
              {returnRequest.customerName} → {returnRequest.storeName || returnRequest.sellerName}
            </span>
          )}
        </div>
        <Link
          to={`${basePath}/${returnRequest.id}`}
          className="btn-outline text-sm px-4 py-1.5"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
};

export default ReturnCard;