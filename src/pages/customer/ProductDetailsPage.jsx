import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorMessage from '../../components/common/ErrorMessage';
import ProductImageGallery from '../../components/product/ProductImageGallery';
import ProductInfo from '../../components/product/ProductInfo';
import ProductReviews from '../../components/product/ProductReviews';
import RelatedProducts from '../../components/product/RelatedProducts';
import productService from '../../api/productService';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProduct(id);
      setProduct(data);
    } catch (err) {
      setError('فشل في تحميل المنتج');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProduct} />;
  if (!product) return <ErrorMessage message="المنتج غير موجود" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'الرئيسية', link: '/' },
          { label: 'المنتجات', link: '/products' },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 🆕 تمرير الصور المتعددة */}
        <ProductImageGallery
          imageUrl={product.imageUrl}
          productName={product.name}
          images={product.images || []}
        />
        <ProductInfo product={product} />
      </div>

      {/* 🆕 معلومات البائع */}
      {(product.storeName || product.sellerName) && (
        <div className="bg-white rounded-xl border p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">🏪 البائع</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🏪</span>
            </div>
            <div>
              <Link
                to={`/sellers/${product.sellerId}`}
                className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
              >
                {product.storeName || product.sellerName}
              </Link>
              <p className="text-sm text-gray-500">
                عرض جميع منتجات هذا المتجر
              </p>
            </div>
            <Link
              to={`/sellers/${product.sellerId}`}
              className="mr-auto bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              زيارة المتجر
            </Link>
          </div>
        </div>
      )}

      <ProductReviews productId={id} />
      <RelatedProducts productId={id} />
    </div>
  );
};

export default ProductDetailsPage;