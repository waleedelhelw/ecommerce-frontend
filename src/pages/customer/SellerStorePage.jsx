import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FiStar, FiPackage, FiCalendar, FiPhone, FiShare2, FiShoppingBag } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import SearchBar from '../../components/common/SearchBar';
import {
  getSellerById,
  getSellerBySlug,
  getSellerProducts,
  getSellerProductsBySlug,
} from '../../api/customer/customerSellerService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductGrid from '../../components/product/ProductGrid';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatDate';
import ShareStoreButton from '../../components/seller/ShareStoreButton';

const SellerStorePage = () => {
  const { sellerId } = useParams();
  const isSlugRoute = Number.isNaN(Number(sellerId));
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const fetchSeller = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = isSlugRoute
        ? await getSellerBySlug(sellerId)
        : await getSellerById(sellerId);
      setSeller(data);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل بيانات المتجر');
    } finally {
      setLoading(false);
    }
  }, [sellerId, isSlugRoute]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const fetchProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const params = {
        pageNumber: currentPage,
        pageSize: 12,
      };
      if (searchTerm) params.searchTerm = searchTerm;
      const data = isSlugRoute
        ? await getSellerProductsBySlug(sellerId, params)
        : await getSellerProducts(sellerId, params);
      setProducts(data?.items || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error('Error fetching seller products:', err);
    } finally {
      setProductsLoading(false);
    }
  }, [sellerId, isSlugRoute, currentPage, searchTerm]);

  useEffect(() => {
    fetchSeller();
  }, [fetchSeller]);

  useEffect(() => {
    if (seller) {
      fetchProducts();
    }
  }, [seller, fetchProducts]);

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

  const sellerPhone =
    seller.businessPhone ||
    seller.phone ||
    seller.sellerPhone ||
    seller.contactPhone ||
    seller.mobile ||
    seller.phoneNumber;

  const publicStorePath = `/sellers/${seller.storeSlug || sellerId}`;

  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: seller.storeName,
    description: seller.storeDescription || `متجر ${seller.storeName} على تسوّق`,
    url: `https://www.tasawwaq.store${publicStorePath}`,
    ...(seller.logoUrl && { image: seller.logoUrl, logo: seller.logoUrl }),
    ...(sellerPhone && { telephone: sellerPhone }),
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://www.tasawwaq.store' },
      { '@type': 'ListItem', position: 2, name: 'المتاجر', item: 'https://www.tasawwaq.store/sellers' },
      { '@type': 'ListItem', position: 3, name: seller.storeName, item: `https://www.tasawwaq.store${publicStorePath}` },
    ],
  };

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [storeSchema, breadcrumbSchema],
  };

  const statItems = [
    { icon: <FiPackage size={16} />, label: 'المنتجات', value: seller.totalProducts, gradient: 'from-blue-500 to-indigo-600' },
    ...(seller.rating > 0 ? [{ icon: <FiStar size={16} />, label: 'التقييم', value: `${seller.rating} (${seller.totalRatings})`, gradient: 'from-amber-500 to-yellow-600' }] : []),
    ...(seller.joinedAt ? [{ icon: <FiCalendar size={16} />, label: 'انضم', value: formatDate(seller.joinedAt), gradient: 'from-emerald-500 to-green-600' }] : []),
  ];

  return (
    <>
      <SEO
        title={`متجر ${seller.storeName}`}
        description={seoDescription}
        keywords={seoKeywords}
        image={seller.logoUrl || seller.bannerUrl || '/og-image.jpg'}
        url={publicStorePath}
        type="website"
        structuredData={combinedSchema}
      />

      <div>
        {/* Banner */}
        <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800" />
          {seller.bannerUrl && !bannerError && (
            <img
              src={seller.bannerUrl}
              alt={`بانر متجر ${seller.storeName}`}
              width={1200}
              height={256}
              className="w-full h-full object-cover opacity-60"
              onError={() => setBannerError(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Store Info Card */}
          <div className="relative -mt-16 sm:-mt-20 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-purple-500/5 p-5 sm:p-7">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                {/* Logo */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
                      {seller.logoUrl && !logoError ? (
                        <img
                          src={seller.logoUrl}
                          alt={`شعار متجر ${seller.storeName}`}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          onError={() => setLogoError(true)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
                          <FiShoppingBag size={28} className="text-purple-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {/* Store Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">متجر</span>
                      </div>
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words mt-0.5">
                        {seller.storeName}
                      </h1>
                    </div>
                    <ShareStoreButton
                      sellerId={seller.userId || sellerId}
                      storeSlug={seller.storeSlug}
                      storeName={seller.storeName}
                      storeDescription={seller.storeDescription}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all text-sm font-medium shadow-sm shrink-0"
                      label={
                        <span className="flex items-center gap-1.5">
                          <FiShare2 size={14} />
                          شارك المتجر
                        </span>
                      }
                    />
                  </div>

                  {seller.storeDescription && (
                    <p className="text-sm sm:text-base text-gray-500 mt-2 leading-relaxed line-clamp-2">
                      {seller.storeDescription}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    {statItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-sm`}>
                          <span className="text-white">{item.icon}</span>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 leading-tight">{item.label}</p>
                          <p className="text-xs font-bold text-gray-800 leading-tight">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Phone */}
                  {sellerPhone && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <a
                        href={`tel:${sellerPhone}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-sm">
                          <FiPhone size={13} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-emerald-700" dir="ltr">{sellerPhone}</span>
                      </a>
                    </div>
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

          {/* Products Section */}
          <div className="mt-8 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">المنتجات</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              منتجات المتجر
            </h2>
          </div>

          <div className="mb-5">
            <SearchBar
              onSearch={handleSearch}
              placeholder="ابحث في منتجات المتجر..."
              initialValue={searchTerm}
            />
          </div>

          {products.length === 0 && !productsLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiPackage size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">لا توجد منتجات</p>
              <p className="text-gray-300 text-sm mt-1">
                {searchTerm ? 'لا توجد نتائج للبحث' : 'هذا المتجر لا يحتوي على منتجات حالياً'}
              </p>
            </div>
          ) : (
            <>
              <ProductGrid products={products} loading={productsLoading} variant="simple" />

              {totalPages > 1 && (
                <div className="mt-8 mb-6">
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerStorePage;
