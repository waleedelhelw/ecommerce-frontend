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

  // ✅ Alt Text وصفي للـ SEO
  const altText = product.categoryName
    ? `${product.name} - ${product.categoryName}${product.storeName ? ` من ${product.storeName}` : ''}`
    : product.name;

  return (
    <Link
      to={`/products/${product.id}`}
      className="card overflow-hidden group"
      aria-label={`عرض تفاصيل ${product.name} - السعر ${formatPrice(product.price)}`}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.imageUrl || '/placeholder-product.png'}
          alt={altText}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-product.png';
          }}
        />
        {product.stockQuantity === 0 && (
          <div
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            role="status"
          >
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              نفذ المخزون
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {/* ✅ H3 لاسم المنتج (مهم للـ SEO) */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {product.name}
        </h3>

        {product.categoryName && (
          <p className="text-xs text-blue-600 mb-1">{product.categoryName}</p>
        )}

        {/* اسم المتجر */}
        {(product.storeName || product.sellerName) && (
          <p className="text-xs text-gray-400 mb-2">
            <span aria-hidden="true">🏪</span> {product.storeName || product.sellerName}
          </p>
        )}

        <StarRating rating={product.averageRating || product.rating || 0} size={14} />

        <div className="flex items-center justify-between mt-3">
          <span
            className="text-lg font-bold text-blue-600"
            aria-label={`السعر ${formatPrice(product.price)}`}
          >
            {formatPrice(product.price)}
          </span>

          {isAuthenticated && isCustomer && product.stockQuantity > 0 && (
            <button
              onClick={handleAddToCart}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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