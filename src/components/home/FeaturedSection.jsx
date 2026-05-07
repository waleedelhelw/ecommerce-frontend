import { Link } from 'react-router-dom';
import FeaturedProducts from '../product/FeaturedProducts';

const FeaturedSection = () => {
  return (
    <section
      className="py-8 sm:py-10 md:py-12 bg-white"
      aria-labelledby="featured-section-title"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between gap-3 mb-5 sm:mb-8">
          <div>
            <h2
              id="featured-section-title"
              className="text-xl sm:text-2xl font-bold text-gray-900"
            >
              <span aria-hidden="true">⭐</span> منتجات مميزة
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              اختيارات مميزة ومنتجات عليها إقبال
            </p>
          </div>

          <Link
            to="/products"
            className="shrink-0 text-blue-600 hover:text-blue-700 font-medium text-sm"
            aria-label="عرض كل المنتجات المميزة"
          >
            عرض الكل ←
          </Link>
        </div>

        <FeaturedProducts />
      </div>
    </section>
  );
};

export default FeaturedSection;