import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiShare2, FiCopy, FiSend, FiFacebook, FiCheck } from 'react-icons/fi';
import StarRating from '../common/StarRating';
import Badge from '../common/Badge';
import OfferCountdown from '../common/OfferCountdown';
import { formatPrice } from '../../utils/formatPrice';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import toast from 'react-hot-toast';

const findMatchingVariant = (variants, selectedValues) => {
  const selectedValueIds = Object.values(selectedValues).filter(Boolean);
  if (selectedValueIds.length === 0) return null;
  return variants.find((variant) => {
    const attrs = variant.attributes || [];
    const variantValueIds = attrs.map((a) => a.valueId ?? a.id);
    return selectedValueIds.every((id) => variantValueIds.includes(id));
  });
};

const ProductInfo = ({ product, onVariantChange }) => {
  const [quantity, setQuantity] = useState(1);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState({});
  const { isAuthenticated, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const hasVariants = product.hasVariants && Array.isArray(product.variants) && product.variants.length > 0;
  const attributes = product.attributes || [];

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return findMatchingVariant(product.variants, selectedValues);
  }, [hasVariants, product.variants, selectedValues]);

  const handleAttributeSelect = (attributeId, valueId) => {
    setSelectedValues((prev) => {
      const isSame = prev[attributeId] === valueId;
      const next = { ...prev };
      if (isSame) {
        delete next[attributeId];
      } else {
        next[attributeId] = valueId;
      }
      if (onVariantChange) {
        const match = findMatchingVariant(product.variants || [], next);
        onVariantChange(match);
      }
      return next;
    });
  };

  const hasOffer = product.hasActiveOffer && product.offerType;
  const isDiscountOffer = hasOffer && product.offerType === 'Discount';
  const isBogoOffer = hasOffer && product.offerType === 'BuyOneGetOne';

  const basePrice = selectedVariant?.price != null ? selectedVariant.price : product.price;
  const displayPrice = isDiscountOffer && product.offerPrice != null ? product.offerPrice : basePrice;
  const hasOfferPrice = isDiscountOffer && product.offerPrice != null;

  const variantStock = selectedVariant?.stockQuantity ?? product.stockQuantity;
  const inStock = variantStock > 0;

  const allAttributesSelected = attributes.every((attr) => selectedValues[attr.id] != null);
  const canAddToCart = hasVariants ? (inStock && allAttributesSelected) : inStock;

  const handleAddToCart = () => {
    if (isAuthenticated && !isAdmin) {
      addToCart(product.id, quantity, selectedVariant?.id || null);
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

  const inWishlist = isInWishlist(product.id);

  return (
    <article className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
        {product.name}
      </h1>

      <div className="flex items-center gap-4">
        <StarRating rating={product.averageRating || 0} size={18} />
        <span className="text-sm text-gray-500" aria-label={`${product.reviewCount || 0} تقييم`}>
          ({product.reviewCount || 0} تقييم)
        </span>
      </div>

      <div className="flex items-end gap-3 flex-wrap" aria-label={`السعر ${formatPrice(displayPrice)}`}>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {formatPrice(displayPrice)}
          </span>
          <span className="text-sm text-gray-400 mb-1">ج.م</span>
        </div>
        {hasOfferPrice && (
          <span className="text-lg text-gray-400 line-through mb-1">{formatPrice(product.price)}</span>
        )}
      </div>

      {isDiscountOffer && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-l from-orange-500 to-red-500 text-white text-xs font-bold rounded-lg shadow-sm">
            <span>🔥</span> خصم {product.discountPercentage}%
          </span>
          {product.offerEndDate && <OfferCountdown endDate={product.offerEndDate} />}
        </div>
      )}

      {isBogoOffer && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-l from-purple-500 to-pink-500 text-white text-xs font-bold rounded-lg shadow-sm">
            <span>🎁</span> عرض اشتري واحصل على مجاني
          </span>
          {product.offerEndDate && <OfferCountdown endDate={product.offerEndDate} />}
        </div>
      )}

      <section aria-labelledby="product-description-title">
        <h2 id="product-description-title" className="sr-only">وصف المنتج</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </section>

      {/* ✅ اختيار الخصائص (للمنتجات ذات المتغيرات) */}
      {hasVariants && attributes.length > 0 && (
        <div className="space-y-3">
          {attributes.map((attr) => {
            const values = Array.isArray(attr.values) ? attr.values : [];
            const selectedValueId = selectedValues[attr.id];
            return (
              <div key={attr.id}>
                <span className="block text-sm font-medium text-gray-700 mb-2">{attr.name}:</span>
                <div className="flex flex-wrap gap-2">
                  {values.map((val) => {
                    const valueId = val.id || val.valueId || val;
                    const valueLabel = val.value || val.name || val;
                    const isSelected = selectedValueId === valueId;
                    return (
                      <button
                        key={valueId}
                        type="button"
                        onClick={() => handleAttributeSelect(attr.id, valueId)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {valueLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* المخزون */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">المخزون:</span>
        {inStock ? (
          <Badge variant="success">متوفر ({variantStock})</Badge>
        ) : (
          <Badge variant="danger">{hasVariants && !allAttributesSelected ? 'اختر الخصائص' : 'نفذ المخزون'}</Badge>
        )}
      </div>

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

      {product.categoryName && !product.categoryId && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">التصنيف:</span>
          <Badge variant="primary">{product.categoryName}</Badge>
        </div>
      )}

      {isAuthenticated && !isAdmin && canAddToCart && (
        <>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-medium" id="quantity-label">الكمية:</span>
            <div
              className="flex items-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
              role="group"
              aria-labelledby="quantity-label"
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                aria-label="تقليل الكمية"
                disabled={quantity <= 1}
              >
                <FiMinus size={16} aria-hidden="true" />
              </button>
              <span
                className="px-5 py-2 font-bold text-gray-900 min-w-[50px] text-center bg-white border-x border-gray-200"
                aria-live="polite"
                aria-label={`الكمية ${quantity}`}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(variantStock, quantity + 1))}
                className="p-2.5 hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                aria-label="زيادة الكمية"
                disabled={quantity >= variantStock}
              >
                <FiPlus size={16} aria-hidden="true" />
              </button>
            </div>
            <span className="text-xs text-gray-400">الحد الأقصى: {variantStock}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all text-sm font-bold shadow-sm"
              aria-label={`إضافة ${quantity} من ${product.name} إلى السلة`}
            >
              <FiShoppingCart size={20} aria-hidden="true" />
              أضف للسلة
            </button>

            <button
              onClick={handleAddToWishlist}
              disabled={wishlistLoading || inWishlist}
              aria-label={inWishlist ? 'المنتج في المفضلة' : `إضافة ${product.name} للمفضلة`}
              className={`flex items-center justify-center gap-2 px-4 rounded-xl border-2 transition-all text-sm font-medium
                ${inWishlist
                  ? 'bg-red-50 border-red-200 text-red-500 cursor-default'
                  : 'border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50'
                }`}
            >
              <FiHeart size={18} className={inWishlist ? 'fill-red-500' : ''} aria-hidden="true" />
              {inWishlist && <span className="hidden sm:inline">في المفضلة</span>}
            </button>
          </div>
        </>
      )}

      {isAuthenticated && !isAdmin && !canAddToCart && hasVariants && !allAttributesSelected && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100/60 rounded-2xl p-4 text-sm text-amber-700">
          يرجى اختيار جميع الخصائص لعرض السعر وإتاحة الشراء
        </div>
      )}

      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/60 rounded-2xl p-4 flex items-center gap-3" role="status">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <FiCheck size={16} className="text-white" />
          </div>
          <div className="text-sm text-gray-600">
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-bold">سجل دخولك</Link>
            {' '}لتتمكن من الشراء وإضافة المنتج للمفضلة
          </div>
        </div>
      )}

      <ShareButtons product={product} selectedVariant={selectedVariant} />
    </article>
  );
};

const ShareButtons = ({ product, selectedVariant }) => {
  const productUrl = `${window.location.origin}/products/${product.id}`;
  const shareText = `${product.name}${selectedVariant ? ` (${selectedVariant.attributes?.map((a) => a.value).join(' - ')})` : ''} - ${product.description?.substring(0, 100) || 'منتج مميز'} | تسوّق`;

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
    <div className="pt-5 border-t border-gray-100">
      <div className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-lg bg-gray-100 flex items-center justify-center">
          <FiShare2 size={10} className="text-gray-400" />
        </div>
        شارك المنتج
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={handleNativeShare} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs text-gray-600 transition-all font-medium" aria-label="مشاركة">
          <FiShare2 size={13} /> مشاركة
        </button>
        <a href={`https://wa.me/?text=${encodeURIComponent(shareText + '\n\nاطلب دلوقتي 🛒\n' + productUrl)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-xs text-emerald-600 transition-all font-medium" aria-label="مشاركة على واتساب">
          <FiSend size={13} /> واتساب
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs text-blue-600 transition-all font-medium" aria-label="مشاركة على فيسبوك">
          <FiFacebook size={13} /> فيسبوك
        </a>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs text-gray-500 transition-all font-medium" aria-label="مشاركة على تويتر">
          <svg size={13} className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X
        </a>
        <button onClick={handleCopyLink} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs text-gray-600 transition-all font-medium" aria-label="نسخ الرابط">
          <FiCopy size={13} /> نسخ
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
