import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiStar, FiPackage, FiCalendar } from 'react-icons/fi';
import { getSellerById, getSellerProducts } from '../../api/customer/customerSellerService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductGrid from '../../components/product/ProductGrid';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatDate';

const SellerStorePage = () => {
  // ✅ بنستخدم sellerId بدل id
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
      // ✅ بنبعت sellerId للـ API
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
      // ✅ بنبعت sellerId للـ API
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
  if (error) return <ErrorMessage message={error} onRetry={fetchSeller} />;
  if (!seller) return <ErrorMessage message="المتجر غير موجود" />;

  return (
    <div>
      {/* البانر */}
      <div className="h-48 sm:h-64 bg-gradient-to-l from-blue-500 to-blue-600 relative">
        {seller.bannerUrl && (
          <img
            src={seller.bannerUrl}
            alt="banner"
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
                  alt={seller.storeName}
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
            { label: 'الرئيسية', link: '/' },
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
  );
};

export default SellerStorePage;