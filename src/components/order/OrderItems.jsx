import { formatPrice } from '../../utils/formatPrice';

const OrderItems = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h3 className="font-bold">المنتجات</h3>
      </div>

      <div className="divide-y">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4 p-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.imageUrl || item.productImageUrl || '/placeholder-product.png'}
                alt={item.productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-product.png';
                }}
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{item.productName}</h4>
              <p className="text-sm text-gray-500">
                {formatPrice(item.unitPrice || item.price)} × {item.quantity}
              </p>
            </div>
            <div className="font-bold">
              {formatPrice((item.unitPrice || item.price) * item.quantity)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;