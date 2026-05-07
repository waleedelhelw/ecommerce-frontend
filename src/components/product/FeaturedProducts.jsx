import { useState, useEffect } from 'react';
import productService from '../../api/productService';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productService.getFeatured();
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
        console.error('Error fetching featured products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (products.length === 0) return null;

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-3 -mx-3 px-3 snap-x snap-mandatory sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 lg:gap-6 sm:overflow-visible"
      role="list"
      aria-label="قائمة المنتجات المميزة"
    >
      {products.map((product) => (
        <div
          key={product.id}
          role="listitem"
          className="w-[72vw] max-w-[260px] min-w-[210px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:min-w-0"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
