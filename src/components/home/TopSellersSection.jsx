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
      className="py-12 bg-gray-50"
      aria-labelledby="top-sellers-section-title"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* العنوان */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              id="top-sellers-section-title"
              className="text-2xl font-bold text-gray-800"
            >
              <span aria-hidden="true">🏪</span> تسوّق من متاجرنا
            </h2>
            <p className="text-gray-500 mt-1">
              اكتشف أفضل البائعين على منصتنا
            </p>
          </div>
          <Link
            to="/sellers"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
            aria-label="عرض كل المتاجر"
          >
            عرض الكل
            <FiArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* الكروت */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellers.map((seller) => (
            <Link
              key={seller.id}
              to={`/sellers/${seller.userId}`}
              className="bg-white rounded-xl border p-5 hover:shadow-lg transition-shadow text-center group"
              aria-label={`زيارة متجر ${seller.storeName}`}
            >
              {/* اللوجو */}
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full overflow-hidden flex items-center justify-center mb-3">
                {seller.logoUrl ? (
                  <img
                    src={seller.logoUrl}
                    alt={`شعار متجر ${seller.storeName}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '🏪';
                    }}
                  />
                ) : (
                  <span className="text-2xl" aria-hidden="true">🏪</span>
                )}
              </div>

              <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {seller.storeName}
              </h3>

              <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-500">
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