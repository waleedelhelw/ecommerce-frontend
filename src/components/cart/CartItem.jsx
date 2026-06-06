import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { formatPrice } from '../../utils/formatPrice';
import useCart from '../../hooks/useCart';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 bg-white rounded-lg border p-4 mb-3">
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.imageUrl || item.productImageUrl || '/placeholder-product.png'}
          alt={item.productName}
          width={80}
          height={80}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-product.png';
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{item.productName}</h3>
        {item.variantAttributes && (
          <p className="text-xs text-gray-500 mt-0.5">{item.variantAttributes}</p>
        )}
        <p className="text-blue-600 font-medium">{formatPrice(item.price || item.unitPrice)}</p>
      </div>

      {/* ✅ كله item.id (cartItemId) */}
      <div className="flex items-center border rounded-lg">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="p-1.5 hover:bg-gray-100 disabled:opacity-50"
        >
          <FiMinus size={16} />
        </button>
        <span className="px-3 py-1 font-medium text-sm min-w-[40px] text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="p-1.5 hover:bg-gray-100"
        >
          <FiPlus size={16} />
        </button>
      </div>

      <div className="text-left min-w-[80px]">
        <p className="font-bold text-gray-900">
          {formatPrice((item.price || item.unitPrice) * item.quantity)}
        </p>
      </div>

      {/* ✅ item.id مش item.productId */}
      <button
        onClick={() => removeFromCart(item.id)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;