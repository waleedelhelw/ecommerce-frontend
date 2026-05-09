import { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import productService from '../../api/productService';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

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

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const cardWidth = 280;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  if (loading) return <ProductSkeleton count={4} grid={false} />;
  if (products.length === 0) return null;

  return (
    <div className="relative">
      {/* Desktop scroll buttons */}
      {products.length > 4 && (
        <div className="hidden sm:flex absolute top-1/2 -translate-y-1/2 z-10 w-full justify-between pointer-events-none">
          <button
            onClick={() => scroll('right')}
            className="-mr-4 pointer-events-auto p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 shadow-lg hover:shadow-xl transition-all"
            aria-label="السابق"
          >
            <FiChevronRight size={20} />
          </button>
          <button
            onClick={() => scroll('left')}
            className="-ml-4 pointer-events-auto p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 shadow-lg hover:shadow-xl transition-all"
            aria-label="التالي"
          >
            <FiChevronLeft size={20} />
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        role="list"
        aria-label="قائمة المنتجات المميزة"
      >
        {products.map((product) => (
          <div
            key={product.id}
            role="listitem"
            className="w-[72vw] max-w-[280px] min-w-[220px] shrink-0 snap-start"
          >
            <ProductCard product={product} variant="simple" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
