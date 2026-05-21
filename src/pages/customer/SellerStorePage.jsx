import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FiStar, FiPackage, FiCalendar, FiPhone, FiShare2, FiShoppingBag, FiSearch } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import SearchBar from '../../components/common/SearchBar';
import {
  getSellerById,
  getSellerBySlug,
  getSellerProducts,
  getSellerProductsBySlug,
} from '../../api/customer/customerSellerService';
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

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-48 sm:h-56 lg:h-64 skeleton-shimmer" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-16 sm:-mt-20 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl skeleton-shimmer shrink-0" />
              <div className="flex-1 min-w-0 space-y-3">
                <div className="h-6 w-32 skeleton-shimmer rounded-lg" />
                <div className="h-4 w-full skeleton-shimmer rounded-lg" />
                <div className="h-4 w-3/4 skeleton-shimmer rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <>
      <SEO title="خطأ في تحميل المتجر" noindex={true} />
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-red-100">
            <FiPackage size={36} className="text-red-400" />
          </div>
          <p className="text-gray-700 font-bold text-lg mb-2">تعذر تحميل المتجر</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={fetchSeller}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all text-sm font-medium shadow-sm"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    </>
  );

  if (!seller) return (
    <>
      <SEO title="المتجر غير موجود" noindex={true} />
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-gray-200">
            <FiShoppingBag size={36} className="text-gray-400" />
          </div>
          <p className="text-gray-700 font-bold text-lg">المتجر غير موجود</p>
          <p className="text-gray-400 text-sm mt-2">لم نتمكن من العثور على هذا المتجر</p>
        </div>
      </div>
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
        <div className="relative h-48 sm:h-56 lg:h-72 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 animate-gradient"
            style={{ backgroundSize: '200% 200%' }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          {seller.bannerUrl && !bannerError && (
            <img
              src={seller.bannerUrl}
              alt={`بانر متجر ${seller.storeName}`}
              width={1200}
              height={288}
              className="w-full h-full object-cover opacity-80"
              onError={() => setBannerError(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-56 h-56 bg-white/5 rounded-full blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative -mt-16 sm:-mt-20 mb-8 z-10">
            <div className="bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-purple-500/20 p-[1px] rounded-2xl shadow-xl shadow-purple-500/10">
              <div className="bg-white rounded-2xl p-5 sm:p-7">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="relative shrink-0 group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 shadow-lg transition-transform duration-300 group-hover:scale-105">
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
                    <div className="absolute -bottom-1 -left-1 w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">متجر</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                          {seller.storeName}
                        </h1>
                      </div>
                      <ShareStoreButton
                        sellerId={seller.userId || sellerId}
                        storeSlug={seller.storeSlug}
                        storeName={seller.storeName}
                        storeDescription={seller.storeDescription}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-purple-500/25 transition-all text-sm font-medium shrink-0 active:scale-95"
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

                    <div className="flex flex-wrap items-center gap-2.5 mt-4">
                      {statItems.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
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

                    {sellerPhone && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={`tel:${sellerPhone}`}
                          className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 rounded-xl transition-all border border-emerald-100 hover:border-emerald-200 active:scale-95"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-sm">
                            <FiPhone size={14} className="text-white" />
                          </div>
                          <div>
                            <p className="text-[10px] text-emerald-500 font-bold leading-tight">اتصل بالمتجر</p>
                            <span className="text-sm font-bold text-emerald-700 leading-tight" dir="ltr">{sellerPhone}</span>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Breadcrumb
            items={[
              { label: 'المتاجر', link: '/sellers' },
              { label: seller.storeName },
            ]}
          />

          <div className="mt-8 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">المنتجات</span>
                </div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    منتجات المتجر
                  </h2>
                  {seller.totalProducts > 0 && (
                    <span className="px-2.5 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">
                      {seller.totalProducts}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <SearchBar
              onSearch={handleSearch}
              placeholder="ابحث في منتجات المتجر..."
              initialValue={searchTerm}
            />
          </div>

          {products.length === 0 && !productsLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 sm:p-20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-blue-100">
                {searchTerm ? (
                  <FiSearch size={36} className="text-blue-400" />
                ) : (
                  <FiPackage size={36} className="text-blue-400" />
                )}
              </div>
              <p className="text-gray-700 font-bold text-lg">
                {searchTerm ? 'لا توجد نتائج' : 'لا توجد منتجات'}
              </p>
              <p className="text-gray-400 text-sm mt-1.5 max-w-xs mx-auto">
                {searchTerm
                  ? 'لم نجد أي منتجات تطابق بحثك، حاول بكلمات أخرى'
                  : 'هذا المتجر لم يضف أي منتجات بعد'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => handleSearch('')}
                  className="mt-5 px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium rounded-xl transition-colors"
                >
                  عرض جميع المنتجات
                </button>
              )}
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
