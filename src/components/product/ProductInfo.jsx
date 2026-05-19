import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiShare2, FiCopy, FiSend, FiFacebook } from 'react-icons/fi';
import StarRating from '../common/StarRating';
import Badge from '../common/Badge';
import { formatPrice } from '../../utils/formatPrice';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import toast from 'react-hot-toast';

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = () => {
    if (isAuthenticated && !isAdmin) {
      addToCart(product.id, quantity);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated || isAdmin) return;
    try {
      setWishlistLoading(true);
      await addToWishlist(product.id);
      toast.success('تم إضافة المنتج للمفضلة ❤️');
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إضافة المنتج للمفضلة');
    } finally {
      setWishlistLoading(false);
    }
  };

  const inStock = product.stockQuantity > 0;
  const inWishlist = isInWishlist(product.id);

  return (
    <article className="space-y-4">
      {/* ✅ H1 - عنوان المنتج (الـ H1 الوحيد في الصفحة) */}
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
        {product.name}
      </h1>

      {/* التقييمات */}
      <div className="flex items-center gap-4">
        <StarRating rating={product.averageRating || 0} size={18} />
        <span
          className="text-sm text-gray-500"
          aria-label={`${product.reviewCount || 0} تقييم`}
        >
          ({product.reviewCount || 0} تقييم)
        </span>
      </div>

      {/* السعر */}
      <div
        className="text-3xl font-bold text-blue-600"
        aria-label={`السعر ${formatPrice(product.price)}`}
      >
        {formatPrice(product.price)}
      </div>

      {/* الوصف */}
      <section aria-labelledby="product-description-title">
        <h2 id="product-description-title" className="sr-only">
          وصف المنتج
        </h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </section>

      {/* المخزون */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">المخزون:</span>
        {inStock ? (
          <Badge variant="success">متوفر ({product.stockQuantity})</Badge>
        ) : (
          <Badge variant="danger">نفذ المخزون</Badge>
        )}
      </div>

      {/* ✅ التصنيف كـ Link (Internal Linking) */}
      {product.categoryName && product.categoryId && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">التصنيف:</span>
          <Link
            to={`/categories/${product.categoryId}/products`}
            aria-label={`تصفح كل منتجات تصنيف ${product.categoryName}`}
            className="hover:opacity-80 transition-opacity"
          >
            <Badge variant="primary">{product.categoryName}</Badge>
          </Link>
        </div>
      )}

      {/* ✅ Fallback: لو التصنيف موجود بس بدون ID */}
      {product.categoryName && !product.categoryId && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">التصنيف:</span>
          <Badge variant="primary">{product.categoryName}</Badge>
        </div>
      )}

      {/* أزرار الشراء */}
      {isAuthenticated && !isAdmin && inStock && (
        <>
          {/* الكمية */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500" id="quantity-label">
              الكمية:
            </span>
            <div
              className="flex items-center border rounded-lg"
              role="group"
              aria-labelledby="quantity-label"
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100"
                aria-label="تقليل الكمية"
                disabled={quantity <= 1}
              >
                <FiMinus size={18} aria-hidden="true" />
              </button>
              <span
                className="px-4 py-2 font-medium min-w-[50px] text-center"
                aria-live="polite"
                aria-label={`الكمية ${quantity}`}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="p-2 hover:bg-gray-100"
                aria-label="زيادة الكمية"
                disabled={quantity >= product.stockQuantity}
              >
                <FiPlus size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              aria-label={`إضافة ${quantity} من ${product.name} إلى السلة`}
            >
              <FiShoppingCart size={20} aria-hidden="true" />
              أضف للسلة
            </button>

            {/* زرار المفضلة */}
            <button
              onClick={handleAddToWishlist}
              disabled={wishlistLoading || inWishlist}
              aria-label={inWishlist ? 'المنتج في المفضلة' : `إضافة ${product.name} للمفضلة`}
              className={`flex items-center justify-center gap-2 px-4 rounded-lg border transition-colors
                ${inWishlist
                  ? 'bg-red-50 border-red-300 text-red-500 cursor-default'
                  : 'btn-outline hover:text-red-500 hover:border-red-300'
                }`}
            >
              <FiHeart
                size={20}
                className={inWishlist ? 'fill-red-500' : ''}
                aria-hidden="true"
              />
              {inWishlist && <span>في المفضلة</span>}
            </button>
          </div>
        </>
      )}

      {/* رسالة للزائرين */}
      {!isAuthenticated && (
        <div
          className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg flex items-center gap-2"
          role="status"
        >
          <span aria-hidden="true">💡</span>
          <span>
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              سجل دخولك
            </Link>
            {' '}لتتمكن من الشراء وإضافة المنتج للمفضلة
          </span>
        </div>
      )}

      {/* أزرار المشاركة */}
      <ShareButtons product={product} />
    </article>
  );
};

const ShareButtons = ({ product }) => {
  const productUrl = `${window.location.origin}/products/${product.id}`;
  const shareText = `${product.name} - ${product.description?.substring(0, 100) || 'منتج مميز'} | تسوّق`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: shareText, url: productUrl });
      } catch {}
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(productUrl).then(() => toast.success('تم نسخ الرابط'));
  };

  return (
    <div className="pt-4 border-t border-gray-100">
      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
        <FiShare2 size={12} />
        شارك المنتج
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-600 transition-colors"
          aria-label="مشاركة"
        >
          <FiShare2 size={14} />
          مشاركة
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + productUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-xs text-green-600 transition-colors"
          aria-label="مشاركة على واتساب"
        >
          <FiSend size={14} />
          واتساب
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs text-blue-600 transition-colors"
          aria-label="مشاركة على فيسبوك"
        >
          <FiFacebook size={14} />
          فيسبوك
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs text-gray-500 transition-colors"
          aria-label="مشاركة على تويتر"
        >
          <svg size={14} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X
        </a>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-600 transition-colors"
          aria-label="نسخ الرابط"
        >
          <FiCopy size={14} />
          نسخ
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;