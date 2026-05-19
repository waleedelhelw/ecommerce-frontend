import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import { Link } from 'react-router-dom';

const ProductGrid = ({ products, loading, variant }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-gray-200" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-9 bg-gray-200 rounded-xl w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="لا توجد منتجات"
        message="لم يتم العثور على منتجات مطابقة"
        action={
          <Link to="/products" className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
            عرض كل المنتجات
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  );
};

export default ProductGrid;
