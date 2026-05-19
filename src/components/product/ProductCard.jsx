import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import StarRating from '../common/StarRating';
import { formatPrice } from '../../utils/formatPrice';
import { getOptimizedImage } from '../../utils/cloudinary';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';

const ProductCard = ({ product, variant }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const wishlistItem = inWishlist
    ? wishlistItems.find((item) => item.productId === product.id || item.id === product.id)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { addToCart: product.id } });
      return;
    }
    if (isCustomer) {
      addToCart(product.id, 1);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    if (inWishlist && wishlistItem) {
      removeFromWishlist(wishlistItem.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const hasDiscount = product.discountPercentage > 0;
  const discountPrice = hasDiscount
    ? product.price - (product.price * product.discountPercentage) / 100
    : null;

  const altText = product.categoryName
    ? `${product.name} - ${product.categoryName}${product.storeName ? ` من ${product.storeName}` : ''}`
    : product.name;

  if (variant === 'simple') {
    return (
      <Link
        to={`/products/${product.id}`}
        className="group bg-white rounded-xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97] flex flex-col"
        aria-label={`عرض تفاصيل ${product.name} - ${formatPrice(product.price)}`}
      >
        <div className="relative overflow-hidden">
          <div className="aspect-square w-full relative overflow-hidden">
            {!imageError ? (
              <>
                {!imageLoaded && <div className="absolute inset-0 skeleton-shimmer z-10" />}

                {imageLoaded && !imageError && (
                  <div
                    className="absolute inset-0 scale-110 blur-2xl opacity-60"
                    style={{
                      backgroundImage: `url(${getOptimizedImage(product.imageUrl)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}

                <img
                  src={getOptimizedImage(product.imageUrl) || '/placeholder-product.png'}
                  alt={altText}
                  loading="lazy"
                  width={400}
                  height={400}
                  className={`relative z-10 w-full h-full object-contain p-1.5 transition-all duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => { setImageError(true); setImageLoaded(true); }}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {hasDiscount && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              -{product.discountPercentage}%
            </span>
          )}

          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold">نفذ المخزون</span>
            </div>
          )}
        </div>

        <div className="p-3 flex flex-col gap-1.5 flex-1">
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {product.storeName && (
            <p className="text-[11px] text-gray-400 line-clamp-1">{product.storeName}</p>
          )}

          {(product.reviewCount || product.reviewsCount || 0) > 0 && (
            <StarRating rating={product.averageRating || product.rating || 0} size={11} />
          )}

          <div className="flex items-center gap-1 mt-0.5">
            {hasDiscount ? (
              <>
                <span className="text-base font-extrabold text-green-700">{formatPrice(discountPrice)}</span>
                <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-base font-extrabold text-green-700">{formatPrice(product.price)}</span>
            )}
          </div>

          {product.stockQuantity > 0 && (
            <button
              onClick={handleAddToCart}
              className="w-full mt-1 flex items-center justify-center gap-1.5 border-2 border-gray-800 text-gray-800 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 hover:text-white active:bg-gray-900 transition-colors"
              aria-label={`إضافة ${product.name} إلى السلة`}
            >
              <FiShoppingCart size={15} />
              أضف للسلة
            </button>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg hover:border-blue-200 active:scale-[0.99] flex flex-col"
      aria-label={`عرض تفاصيل ${product.name} - السعر ${formatPrice(product.price)}`}
    >
      <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
        <div className="aspect-square w-full flex items-center justify-center">
          {!imageError ? (
            <>
              {!imageLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
              <img
                src={getOptimizedImage(product.imageUrl) || '/placeholder-product.png'}
                alt={altText}
                loading="lazy"
                width={400}
                height={400}
                className={`w-full h-full object-contain p-1.5 transition-all duration-500 group-hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => { setImageError(true); setImageLoaded(true); }}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-300">
              <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-gray-400 mt-1">لا توجد صورة</span>
            </div>
          )}
        </div>

        <div className="absolute top-2 right-2 left-2 flex items-start justify-between gap-1">
          <div className="flex flex-col gap-1">
            {hasDiscount && (
              <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                -{product.discountPercentage}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-green-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                جديد
              </span>
            )}
          </div>
          {isAuthenticated && (
            <button
              onClick={handleWishlistToggle}
              className={`p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all ${
                inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
              }`}
              aria-label={inWishlist ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              title={inWishlist ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            >
              <FiHeart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {product.stockQuantity === 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg">
              نفذ المخزون
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {product.categoryName && (
          <p className="text-[11px] sm:text-xs text-blue-600 mb-1 line-clamp-1 font-medium">
            {product.categoryName}
          </p>
        )}

        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1.5 line-clamp-2 min-h-[40px] sm:min-h-[48px] leading-5 flex-1">
          {product.name}
        </h3>

        {(product.storeName || product.sellerName) && (
          <p className="text-[11px] sm:text-xs text-gray-400 mb-2 line-clamp-1">
            🏪 {product.storeName || product.sellerName}
          </p>
        )}

        {(product.reviewCount || product.reviewsCount || 0) > 0 && (
          <div className="mb-2.5">
            <StarRating rating={product.averageRating || product.rating || 0} size={13} />
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="min-w-0">
            {hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-green-700 block leading-none">
                  {formatPrice(discountPrice)}
                </span>
                <span className="text-[11px] text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-base sm:text-lg font-bold text-green-700 block" aria-label={`السعر ${formatPrice(product.price)}`}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {isAuthenticated && isCustomer && product.stockQuantity > 0 && (
            <button
              onClick={handleAddToCart}
              className="shrink-0 p-2 border-2 border-gray-300 text-gray-500 rounded-xl hover:border-gray-800 hover:text-gray-800 active:bg-gray-100 transition-colors"
              aria-label={`إضافة ${product.name} إلى السلة`}
              title="إضافة إلى السلة"
            >
              <FiShoppingCart size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
