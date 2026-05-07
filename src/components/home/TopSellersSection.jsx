import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiPackage, FiArrowLeft } from 'react-icons/fi';
import { getAllSellers } from '../../api/customer/customerSellerService';

const TopSellersSection = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellers();
  }, []);

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

  if (loading || sellers.length === 0) return null;

  return (
    <section
      className="py-8 sm:py-10 md:py-12 bg-gray-50"
      aria-labelledby="top-sellers-section-title"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-8">
          <div>
            <h2
              id="top-sellers-section-title"
              className="text-xl sm:text-2xl font-bold text-gray-800"
            >
              <span aria-hidden="true">🏪</span> تسوّق من متاجرنا
            </h2>
            <p className="text-gray-500 mt-1 text-xs sm:text-sm">
              اكتشف أفضل البائعين على منصتنا
            </p>
          </div>

          <Link
            to="/sellers"
            className="shrink-0 flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
            aria-label="عرض كل المتاجر"
          >
            عرض الكل
            <FiArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {sellers.map((seller) => (
            <Link
              key={seller.id}
              to={`/sellers/${seller.userId}`}
              className="bg-white rounded-2xl border p-4 sm:p-5 hover:shadow-md transition-all text-center group"
              aria-label={`زيارة متجر ${seller.storeName}`}
            >
              {/* اللوجو */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-50 rounded-full overflow-hidden flex items-center justify-center mb-3 border">
                {seller.logoUrl ? (
                  <img
                    src={seller.logoUrl}
                    alt={`شعار متجر ${seller.storeName}`}
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.parentElement) {
                        e.target.parentElement.innerHTML = '🏪';
                      }
                    }}
                  />
                ) : (
                  <span className="text-2xl" aria-hidden="true">🏪</span>
                )}
              </div>

              <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-sm sm:text-base line-clamp-1">
                {seller.storeName}
              </h3>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 mt-2 text-[11px] sm:text-xs text-gray-500">
                {seller.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <FiStar size={12} className="text-yellow-500" aria-hidden="true" />
                    <span aria-label={`التقييم ${seller.rating} من 5`}>
                      {seller.rating}
                    </span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <FiPackage size={12} aria-hidden="true" />
                  {seller.totalProducts} منتج
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellersSection;