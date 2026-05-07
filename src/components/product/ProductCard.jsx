import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import StarRating from '../common/StarRating';
import { formatPrice } from '../../utils/formatPrice';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';

const ProductCard = ({ product }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated && isCustomer) {
      addToCart(product.id, 1);
    }
  };

  const altText = product.categoryName
    ? `${product.name} - ${product.categoryName}${product.storeName ? ` من ${product.storeName}` : ''}`
    : product.name;

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-md hover:border-blue-200 active:scale-[0.99]"
      aria-label={`عرض تفاصيل ${product.name} - السعر ${formatPrice(product.price)}`}
    >
      {/* Image */}
      <div className="relative bg-gray-50 border-b">
        <div className="h-40 sm:h-48 md:h-52 w-full flex items-center justify-center p-3 sm:p-4">
          <img
            src={product.imageUrl || '/placeholder-product.png'}
            alt={altText}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-product.png';
            }}
          />
        </div>

        {product.stockQuantity === 0 && (
          <div
            className="absolute inset-0 bg-black/45 flex items-center justify-center"
            role="status"
          >
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              نفذ المخزون
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        {product.categoryName && (
          <p className="text-[11px] sm:text-xs text-blue-600 mb-1 line-clamp-1">
            {product.categoryName}
          </p>
        )}

        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1.5 line-clamp-2 min-h-[40px] sm:min-h-[48px] leading-5">
          {product.name}
        </h3>

        {(product.storeName || product.sellerName) && (
          <p className="text-[11px] sm:text-xs text-gray-400 mb-2 line-clamp-1">
            <span aria-hidden="true">🏪</span> {product.storeName || product.sellerName}
          </p>
        )}

        <div className="mb-3">
          <StarRating rating={product.averageRating || product.rating || 0} size={14} />
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <span
              className="text-base sm:text-lg font-bold text-blue-600 block"
              aria-label={`السعر ${formatPrice(product.price)}`}
            >
              {formatPrice(product.price)}
            </span>
          </div>

          {isAuthenticated && isCustomer && product.stockQuantity > 0 && (
            <button
              onClick={handleAddToCart}
              className="shrink-0 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              aria-label={`إضافة ${product.name} إلى السلة`}
              title="إضافة إلى السلة"
            >
              <FiShoppingCart size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;