import { Link } from 'react-router-dom';
import FeaturedProducts from '../product/FeaturedProducts';

const FeaturedSection = () => {
  return (
    <section
      className="py-12 bg-white"
      aria-labelledby="featured-section-title"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2
            id="featured-section-title"
            className="text-2xl font-bold"
          >
            <span aria-hidden="true">⭐</span> منتجات مميزة
          </h2>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
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