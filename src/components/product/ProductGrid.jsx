import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import { Link } from 'react-router-dom';

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border overflow-hidden animate-pulse">
            <div className="h-40 sm:h-48 md:h-52 bg-gray-200" />
            <div className="p-3 sm:p-4 space-y-3">
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-5 bg-gray-200 rounded w-1/3" />
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
          <Link to="/products" className="btn-primary">
            عرض كل المنتجات
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;