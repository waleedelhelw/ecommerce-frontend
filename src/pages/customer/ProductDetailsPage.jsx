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
      availability: (product.stockQuantity || product.stock || 0) > 0
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
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 lg:p-8 shadow-sm">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* ملخص المنتج */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {product.categoryName && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-[11px] text-gray-400 mb-0.5">التصنيف</p>
              <p className="text-sm font-bold text-gray-800 line-clamp-1">{product.categoryName}</p>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm ${
              product.stockQuantity > 0
                ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                : 'bg-gradient-to-br from-red-500 to-rose-600'
            }`}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {product.stockQuantity > 0 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </div>
            <p className="text-[11px] text-gray-400 mb-0.5">المخزون</p>
            <p className="text-sm font-bold text-gray-800">
              {product.stockQuantity > 0 ? `${product.stockQuantity} متوفر` : 'نفذ'}
            </p>
          </div>
          {(product.averageRating || product.rating) > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <p className="text-[11px] text-gray-400 mb-0.5">التقييم</p>
              <p className="text-sm font-bold text-gray-800">
                {(product.averageRating || product.rating).toFixed(1)}
                <span className="text-xs text-gray-400 font-normal"> / 5</span>
              </p>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[11px] text-gray-400 mb-0.5">الضمان</p>
            <p className="text-sm font-bold text-gray-800">14 يوم</p>
          </div>

          {product.hasActiveOffer && product.offerType && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm ${
                product.offerType === 'Discount'
                  ? 'bg-gradient-to-br from-orange-500 to-red-500'
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
              }`}>
                <span className="text-lg">{product.offerType === 'Discount' ? '🔥' : '🎁'}</span>
              </div>
              <p className="text-[11px] text-gray-400 mb-0.5">العرض</p>
              <p className="text-sm font-bold text-gray-800">
                {product.offerType === 'Discount'
                  ? `خصم ${product.discountPercentage}%`
                  : 'اشتري واحصل على مجاني'
                }
              </p>
            </div>
          )}
        </div>

        {/* البائع */}
        {(product.storeName || product.sellerName) && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100/60 rounded-2xl p-5 mb-8 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-purple-500 font-bold mb-0.5">البائع</p>
                  <Link
                    to={`/sellers/${product.sellerId}`}
                    className="text-base font-bold text-gray-900 hover:text-purple-600 transition-colors line-clamp-1"
                  >
                    {product.storeName || product.sellerName}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">عرض جميع منتجات هذا المتجر</p>
                </div>
              </div>
              <Link
                to={`/sellers/${product.sellerId}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all text-sm font-medium shadow-sm shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
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