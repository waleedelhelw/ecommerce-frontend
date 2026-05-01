import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiStar, FiPackage, FiCalendar } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import { getSellerById, getSellerProducts } from '../../api/customer/customerSellerService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductGrid from '../../components/product/ProductGrid';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatDate';

const SellerStorePage = () => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSeller();
  }, [sellerId]);

  useEffect(() => {
    if (seller) {
      fetchProducts();
    }
  }, [seller, currentPage]);

  const fetchSeller = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSellerById(sellerId);
      setSeller(data);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل بيانات المتجر');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const data = await getSellerProducts(sellerId, {
        pageNumber: currentPage,
        pageSize: 12,
      });
      setProducts(data?.items || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error('Error fetching seller products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <>
      <SEO title="خطأ في تحميل المتجر" noindex={true} />
      <ErrorMessage message={error} onRetry={fetchSeller} />
    </>
  );
  if (!seller) return (
    <>
      <SEO title="المتجر غير موجود" noindex={true} />
      <ErrorMessage message="المتجر غير موجود" />
    </>
  );

  // ✅ بيانات الـ SEO
  const seoDescription = seller.storeDescription
    ? seller.storeDescription.substring(0, 160).trim() + (seller.storeDescription.length > 160 ? '...' : '')
    : `زُر متجر ${seller.storeName} على تسوّق. ${seller.totalProducts || 0} منتج متنوع بأفضل الأسعار، توصيل سريع لكل مصر.`;

  const seoKeywords = [
    seller.storeName,
    `متجر ${seller.storeName}`,
    'متجر الكتروني',
    'تسوق اونلاين',
    'منتجات',
  ].filter(Boolean).join(', ');

  // ✅ Store Schema
  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: seller.storeName,
    description: seller.storeDescription || `متجر ${seller.storeName} على تسوّق`,
    url: `https://tasawwaq.vercel.app/sellers/${sellerId}`,
    ...(seller.logoUrl && { image: seller.logoUrl, logo: seller.logoUrl }),
    ...(seller.rating > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: seller.rating,
        reviewCount: seller.totalRatings || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  // ✅ Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: 'https://tasawwaq.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'المتاجر',
        item: 'https://tasawwaq.vercel.app/sellers',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: seller.storeName,
        item: `https://tasawwaq.vercel.app/sellers/${sellerId}`,
      },
    ],
  };

  // ✅ دمج الـ Schemas
  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [storeSchema, breadcrumbSchema],
  };

  return (
    <>
      <SEO
        title={`متجر ${seller.storeName}`}
        description={seoDescription}
        keywords={seoKeywords}
        image={seller.logoUrl || seller.bannerUrl || '/og-image.svg'}
        url={`/sellers/${sellerId}`}
        type="website"
        structuredData={combinedSchema}
      />

      <div>
        {/* البانر */}
        <div className="h-48 sm:h-64 bg-gradient-to-l from-purple-500 to-indigo-600 relative">
          {seller.bannerUrl && (
            <img
              src={seller.bannerUrl}
              alt={`بانر متجر ${seller.storeName}`}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* معلومات المتجر */}
          <div className="relative -mt-12 mb-8">
            <div className="bg-white rounded-xl border p-6 flex flex-col sm:flex-row items-start gap-4">
              {/* اللوجو */}
              <div className="w-20 h-20 bg-gray-100 rounded-xl border-2 border-white shadow-md overflow-hidden flex items-center justify-center flex-shrink-0">
                {seller.logoUrl ? (
                  <img
                    src={seller.logoUrl}
                    alt={`شعار متجر ${seller.storeName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span class="text-3xl">🏪</span>';
                    }}
                  />
                ) : (
                  <span className="text-3xl">🏪</span>
                )}
              </div>

              {/* البيانات */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">{seller.storeName}</h1>

                {seller.storeDescription && (
                  <p className="text-gray-500 mt-1">{seller.storeDescription}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                  {seller.rating > 0 && (
                    <span className="flex items-center gap-1">
                      <FiStar size={14} className="text-yellow-500" />
                      {seller.rating} ({seller.totalRatings} تقييم)
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <FiPackage size={14} />
                    {seller.totalProducts} منتج
                  </span>
                  {seller.joinedAt && (
                    <span className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      انضم {formatDate(seller.joinedAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'المتاجر', link: '/sellers' },
              { label: seller.storeName },
            ]}
          />

          {/* منتجات المتجر */}
          <h2 className="text-xl font-bold text-gray-800 mb-4 mt-6">
            📦 منتجات المتجر
          </h2>

          <ProductGrid products={products} loading={productsLoading} />

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerStorePage;