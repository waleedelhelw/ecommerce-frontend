import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import productService from '../../api/productService';
import ProductCard from '../product/ProductCard';
import ProductSkeleton from '../product/ProductSkeleton';

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

  if (loading) return <ProductSkeleton count={4} />;
  if (products.length === 0) return null;

  return (
    <section
      className="py-8 sm:py-14"
      aria-labelledby="new-arrivals-section-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg" aria-hidden="true">🆕</span>
              <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-0.5 rounded-full">
                أحدث الإضافات
              </span>
            </div>
            <h2
              id="new-arrivals-section-title"
              className="text-2xl sm:text-3xl font-extrabold text-gray-900"
            >
              وصل حديثاً
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              أحدث المنتجات المضافة على المنصة
            </p>
          </div>

          <Link
            to="/products"
            className="shrink-0 flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
            aria-label="عرض كل المنتجات الجديدة"
          >
            عرض الكل
            <FiArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} variant="simple" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;
