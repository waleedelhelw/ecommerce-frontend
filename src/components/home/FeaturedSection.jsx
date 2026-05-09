import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import FeaturedProducts from '../product/FeaturedProducts';

const FeaturedSection = () => {
  return (
    <section
      className="py-8 sm:py-14 bg-white"
      aria-labelledby="featured-section-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-3 mb-5 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg" aria-hidden="true">⭐</span>
              <span className="text-xs font-bold text-yellow-600 bg-yellow-50 border border-yellow-200 px-3 py-0.5 rounded-full">
                الأكثر مبيعاً
              </span>
            </div>
            <h2
              id="featured-section-title"
              className="text-2xl sm:text-3xl font-extrabold text-gray-900"
            >
              منتجات مميزة
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              اختيارات مميزة ومنتجات عليها إقبال
            </p>
          </div>

          <Link
            to="/products"
            className="shrink-0 flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
            aria-label="عرض كل المنتجات المميزة"
          >
            عرض الكل
            <FiArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>

        <FeaturedProducts />
      </div>
    </section>
  );
};

export default FeaturedSection;
