import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiPackage, FiArrowLeft, FiShield, FiChevronLeft } from 'react-icons/fi';
import { getAllSellers } from '../../api/customer/customerSellerService';

const TopSellersSection = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const data = await getAllSellers({ pageSize: 4 });
        setSellers(data?.items || data || []);
      } catch (err) {
        console.error('Error fetching sellers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  if (loading || sellers.length === 0) return null;

  return (
    <section
      className="py-8 sm:py-14 bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="top-sellers-section-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg" aria-hidden="true">🏪</span>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
                بائعون موثوقون
              </span>
            </div>
            <h2
              id="top-sellers-section-title"
              className="text-2xl sm:text-3xl font-extrabold text-gray-900"
            >
              تسوّق من متاجرنا
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              اكتشف أفضل البائعين على منصتنا
            </p>
          </div>

          <Link
            to="/sellers"
            className="shrink-0 flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
            aria-label="عرض كل المتاجر"
          >
            عرض الكل
            <FiArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {sellers.map((seller) => (
            <Link
              key={seller.id}
              to={`/sellers/${seller.userId}`}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 p-5 sm:p-6 hover:shadow-lg transition-all duration-300"
              aria-label={`زيارة متجر ${seller.storeName}`}
            >
              <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-0">
                {/* Logo */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl sm:rounded-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-100 group-hover:border-indigo-200 transition-colors mx-auto mb-0 sm:mb-4">
                  {seller.logoUrl ? (
                    <img
                      src={seller.logoUrl}
                      alt={`شعار متجر ${seller.storeName}`}
                      className="w-full h-full object-contain p-1"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl">🏪</span>
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 sm:text-center">
                  <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors text-base sm:text-lg line-clamp-1">
                    {seller.storeName}
                  </h3>

                  <div className="flex sm:flex-col items-center sm:items-center gap-2 sm:gap-1 mt-1.5 text-xs text-gray-500">
                    {seller.rating > 0 && (
                      <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                        <FiStar size={12} className="text-yellow-500" aria-hidden="true" />
                        <span aria-label={`التقييم ${seller.rating} من 5`}>
                          {seller.rating}
                        </span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <FiPackage size={12} aria-hidden="true" />
                      {seller.totalProducts || 0} منتج
                    </span>
                  </div>

                  {seller.isVerified && (
                    <div className="hidden sm:flex items-center justify-center gap-1 mt-3 text-indigo-600 text-xs">
                      <FiShield size={12} />
                      <span>متجر موثوق</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between sm:justify-center text-xs text-gray-400 group-hover:text-indigo-500 transition-colors">
                <span>زيارة المتجر</span>
                <FiChevronLeft size={14} className="sm:hidden" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellersSection;
