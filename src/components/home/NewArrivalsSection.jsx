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
      className="py-12"
      aria-labelledby="new-arrivals-section-title"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2
            id="new-arrivals-section-title"
            className="text-2xl font-bold"
          >
            <span aria-hidden="true">🆕</span> وصل حديثاً
          </h2>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            aria-label="عرض كل المنتجات الجديدة"
          >
            عرض الكل ←
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;