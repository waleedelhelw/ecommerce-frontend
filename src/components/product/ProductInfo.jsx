import { useState } from 'react';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import StarRating from '../common/StarRating';
import Badge from '../common/Badge';
import { formatPrice } from '../../utils/formatPrice';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';  // ✅ جديد
import toast from 'react-hot-toast';

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();  // ✅ جديد

  const handleAddToCart = () => {
    if (isAuthenticated && !isAdmin) {
      addToCart(product.id, quantity);
    }
  };

  // ✅ تعديل - يستخدم الـ Context
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
  const inWishlist = isInWishlist(product.id);  // ✅ جديد

  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{product.name}</h1>

      <div className="flex items-center gap-4">
        <StarRating rating={product.averageRating || 0} size={18} />
        <span className="text-sm text-gray-500">({product.reviewCount || 0} تقييم)</span>
      </div>

      <div className="text-3xl font-bold text-blue-600">
        {formatPrice(product.price)}
      </div>

      <p className="text-gray-600 leading-relaxed">{product.description}</p>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">المخزون:</span>
        {inStock ? (
          <Badge variant="success">متوفر ({product.stockQuantity})</Badge>
        ) : (
          <Badge variant="danger">نفذ المخزون</Badge>
        )}
      </div>

      {product.categoryName && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">التصنيف:</span>
          <Badge variant="primary">{product.categoryName}</Badge>
        </div>
      )}

      {isAuthenticated && !isAdmin && inStock && (
        <>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">الكمية:</span>
            <div className="flex items-center border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100">
                <FiMinus size={18} />
              </button>
              <span className="px-4 py-2 font-medium min-w-[50px] text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} className="p-2 hover:bg-gray-100">
                <FiPlus size={18} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <FiShoppingCart size={20} />
              أضف للسلة
            </button>
            {/* ✅ زرار المفضلة مع حالة لو موجود */}
            <button
              onClick={handleAddToWishlist}
              disabled={wishlistLoading || inWishlist}
              className={`flex items-center justify-center gap-2 px-4 rounded-lg border transition-colors
                ${inWishlist
                  ? 'bg-red-50 border-red-300 text-red-500 cursor-default'
                  : 'btn-outline hover:text-red-500 hover:border-red-300'
                }`}
            >
              <FiHeart size={20} className={inWishlist ? 'fill-red-500' : ''} />
              {inWishlist ? 'في المفضلة' : ''}
            </button>
          </div>
        </>
      )}

      {!isAuthenticated && (
        <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          💡 سجل دخولك لتتمكن من الشراء
        </p>
      )}
    </div>
  );
};

export default ProductInfo;