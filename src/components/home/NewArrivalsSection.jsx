import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../api/productService';
import ProductCard from '../product/ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

const NewArrivalsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNew = async () => {
      try {
        const data = await productService.getNew();
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.items)) {
          setProducts(data.items);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (data && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching new products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNew();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (products.length === 0) return null;

  return (
    <section
      className="py-8 sm:py-10 md:py-12"
      aria-labelledby="new-arrivals-section-title"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between gap-3 mb-5 sm:mb-8">
          <div>
            <h2
              id="new-arrivals-section-title"
              className="text-xl sm:text-2xl font-bold text-gray-900"
            >
              <span aria-hidden="true">🆕</span> وصل حديثاً
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              أحدث المنتجات المضافة على المنصة
            </p>
          </div>

          <Link
            to="/products"
            className="shrink-0 text-blue-600 hover:text-blue-700 font-medium text-sm"
            aria-label="عرض كل المنتجات الجديدة"
          >
            عرض الكل ←
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;