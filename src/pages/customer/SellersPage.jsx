import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiStar, FiPackage } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import { getAllSellers } from '../../api/customer/customerSellerService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Breadcrumb from '../../components/common/Breadcrumb';

const SellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const data = await getAllSellers();
      setSellers(data?.items || data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل البائعين');
    } finally {
      setLoading(false);
    }
  };

  const filteredSellers = sellers.filter((seller) =>
    seller.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.storeDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: 'https://www.tasawwaq.store',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'المتاجر',
        item: 'https://www.tasawwaq.store/sellers',
      },
    ],
  };

  // ✅ Structured Data للمتاجر
  const sellersStructuredData = sellers.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'المتاجر على تسوّق',
    description: 'تصفّح جميع المتاجر الموثوقة على منصة تسوّق',
    url: 'https://www.tasawwaq.store/sellers',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: sellers.length,
      itemListElement: sellers.slice(0, 10).map((seller, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Store',
          name: seller.storeName,
          url: `https://www.tasawwaq.store/sellers/${seller.userId}`,
          ...(seller.logoUrl && { image: seller.logoUrl }),
          ...(seller.rating > 0 && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: seller.rating,
              reviewCount: seller.totalRatings || 1,
              bestRating: 5,
            },
          }),
        },
      })),
    },
  } : null;

  // ✅ دمج الـ Schemas
  const combinedSchema = sellersStructuredData ? {
    '@context': 'https://schema.org',
    '@graph': [sellersStructuredData, breadcrumbSchema],
  } : breadcrumbSchema;

  return (
    <>
      <SEO
        title="المتاجر الموثوقة"
        description={`تصفّح ${sellers.length || 'جميع'} المتاجر الموثوقة على تسوّق. اكتشف منتجات متنوعة من بائعين موثقين بأفضل الأسعار وأجود المنتجات.`}
        keywords="متاجر, بائعين, تجار, متاجر الكترونية, افتح متجرك, متاجر مصرية"
        url="/sellers"
        structuredData={combinedSchema}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'المتاجر' }]} />

        <h1 className="text-2xl font-bold mb-6">🏪 المتاجر</h1>

        {/* البحث */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="ابحث عن متجر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>
        </div>

        {/* المحتوى */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchSellers} />
        ) : filteredSellers.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">🏪</span>
            <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد متاجر</h3>
            <p className="text-gray-400">لم نجد أي متاجر تطابق بحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSellers.map((seller) => (
              <Link
                key={seller.id}
                to={`/sellers/${seller.userId}`}
                className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* البانر */}
                <div className="h-32 bg-gradient-to-l from-purple-500 to-indigo-600 relative">
                  {seller.bannerUrl && (
                    <img
                      src={seller.bannerUrl}
                      alt={`بانر متجر ${seller.storeName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  {/* اللوجو */}
                  <div className="absolute -bottom-8 right-4">
                    <div className="w-16 h-16 bg-white rounded-xl border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                      {seller.logoUrl ? (
                        <img
                          src={seller.logoUrl}
                          alt={`شعار متجر ${seller.storeName}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '🏪'; }}
                        />
                      ) : (
                        <span className="text-2xl">🏪</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* المعلومات */}
                <div className="pt-10 px-4 pb-4">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                    {seller.storeName}
                  </h3>

                  {seller.storeDescription && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {seller.storeDescription}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    {seller.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <FiStar size={14} className="text-yellow-500" />
                        {seller.rating} ({seller.totalRatings})
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <FiPackage size={14} />
                      {seller.totalProducts} منتج
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SellersPage;