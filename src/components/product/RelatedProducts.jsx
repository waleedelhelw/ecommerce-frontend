import { useState, useEffect } from 'react';
import productService from '../../api/productService';
import ProductCard from './ProductCard';

const RelatedProducts = ({ productId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        const data = await productService.getRelated(productId);
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [productId]);

  if (loading || products.length === 0) return null;

  return (
    <section
      className="mt-12"
      aria-labelledby="related-products-title"
    >
      <h2
        id="related-products-title"
        className="text-2xl font-bold mb-6"
      >
        <span aria-hidden="true">🔗</span> منتجات ذات صلة
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;