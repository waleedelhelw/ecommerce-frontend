import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
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
  if (error) return (
    <>
      <SEO title="خطأ في تحميل المنتج" noindex={true} />
      <ErrorMessage message={error} onRetry={fetchProduct} />
    </>
  );
  if (!product) return (
    <>
      <SEO title="المنتج غير موجود" noindex={true} />
      <ErrorMessage message="المنتج غير موجود" />
    </>
  );

  // ✅ تجهيز بيانات الـ SEO
  const productImages = product.images && product.images.length > 0
    ? product.images.map(img => img.imageUrl || img)
    : [product.imageUrl].filter(Boolean);

  const seoDescription = product.description
    ? product.description.substring(0, 160).trim() + (product.description.length > 160 ? '...' : '')
    : `اشترِ ${product.name} من ${product.storeName || product.sellerName || 'تسوّق'} بسعر ${product.price} ج.م. توصيل سريع لكل مصر.`;

  const seoKeywords = [
    product.name,
    product.categoryName,
    product.storeName,
    product.sellerName,
    'تسوق',
    'شراء اونلاين',
    'متجر الكتروني',
  ].filter(Boolean).join(', ');

  // ✅ Structured Data للمنتج (Product Schema)
  const productStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.name,
    image: productImages.length > 0 ? productImages : undefined,
    sku: product.sku || `PROD-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: product.storeName || product.sellerName || 'تسوّق',
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.tasawwaq.store/products/${product.id}`,
      priceCurrency: 'EGP',
      price: product.price,
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.storeName || product.sellerName || 'تسوّق',
      },
    },
    ...(product.rating > 0 && product.reviewsCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewsCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(product.categoryName && {
      category: product.categoryName,
    }),
  };

  // ✅ Breadcrumb Items (يدعم التصنيف لو موجود)
  const breadcrumbItems = [
    { label: 'المنتجات', link: '/products' },
    ...(product.categoryName && product.categoryId
      ? [{
          label: product.categoryName,
          link: `/categories/${product.categoryId}/products`
        }]
      : []),
    { label: product.name },
  ];

  // ✅ Breadcrumb Structured Data (ديناميكي حسب وجود التصنيف)
  const breadcrumbListItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'الرئيسية',
      item: 'https://www.tasawwaq.store',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'المنتجات',
      item: 'https://www.tasawwaq.store/products',
    },
  ];

  if (product.categoryName && product.categoryId) {
    breadcrumbListItems.push({
      '@type': 'ListItem',
      position: 3,
      name: product.categoryName,
      item: `https://www.tasawwaq.store/categories/${product.categoryId}/products`,
    });
    breadcrumbListItems.push({
      '@type': 'ListItem',
      position: 4,
      name: product.name,
      item: `https://www.tasawwaq.store/products/${product.id}`,
    });
  } else {
    breadcrumbListItems.push({
      '@type': 'ListItem',
      position: 3,
      name: product.name,
      item: `https://www.tasawwaq.store/products/${product.id}`,
    });
  }

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbListItems,
  };

  // ✅ دمج الـ Structured Data
  const combinedStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [productStructuredData, breadcrumbStructuredData],
  };

  return (
    <>
      <SEO
        title={product.name}
        description={seoDescription}
        keywords={seoKeywords}
        image={productImages[0] || '/og-image.jpg'}
        url={`/products/${product.id}`}
        type="product"
        structuredData={combinedStructuredData}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ProductImageGallery
            imageUrl={product.imageUrl}
            productName={product.name}
            images={product.images || []}
          />
          <ProductInfo product={product} />
        </div>

        {/* معلومات البائع */}
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
                  className="font-semibold text-gray-800 hover:text-purple-600 transition-colors"
                >
                  {product.storeName || product.sellerName}
                </Link>
                <p className="text-sm text-gray-500">
                  عرض جميع منتجات هذا المتجر
                </p>
              </div>
              <Link
                to={`/sellers/${product.sellerId}`}
                className="mr-auto bg-purple-50 text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
              >
                زيارة المتجر
              </Link>
            </div>
          </div>
        )}

        <ProductReviews productId={id} />
        <RelatedProducts productId={id} />
      </div>
    </>
  );
};

export default ProductDetailsPage;