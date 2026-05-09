import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductCard from '../../components/product/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import useWishlist from '../../hooks/useWishlist';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';

const WishlistPage = () => {
  const { wishlistItems, wishlistCount, removeFromWishlist, fetchWishlist } = useWishlist();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchWishlist();
      } catch (err) {
        setError('فشل في تحميل المفضلة');
      } finally {
        setLoading(false);
      }
    };
    loadWishlist();
  }, []);

  const handleRemove = async (wishlistId) => {
    try {
      await removeFromWishlist(wishlistId);
      toast.success('تم حذف المنتج من المفضلة');
    } catch (error) {
      toast.error('فشل حذف المنتج من المفضلة');
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchWishlist} />;

  return (
    <>
      <SEO
        title="المفضلة"
        description="منتجاتك المفضلة في مكان واحد على تسوّق. احفظ المنتجات اللي بتحبها وارجعلها وقت ما تحب."
        url="/wishlist"
        noindex={true}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'المفضلة' }]} />

        <h1 className="text-2xl font-bold mb-6">❤️ المفضلة ({wishlistCount})</h1>

        {wishlistItems.length === 0 ? (
          <EmptyState
            icon="❤️"
            title="المفضلة فارغة"
            message="لم تضف أي منتجات للمفضلة بعد"
            action={
              <Link to="/products" className="btn-primary">
                تصفح المنتجات
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="relative">
                <ProductCard
                  product={{
                    id: item.productId || item.id,
                    name: item.productName || item.name,
                    price: item.price,
                    imageUrl: item.imageUrl || item.productImageUrl,
                    averageRating: item.averageRating || 0,
                    stockQuantity: item.stockQuantity,
                    categoryName: item.categoryName,
                    storeName: item.storeName,
                  }}
                  variant="simple"
                />
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
                  aria-label="حذف من المفضلة"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPage;