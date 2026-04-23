import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import SearchBar from '../../components/common/SearchBar';
import ProductGrid from '../../components/product/ProductGrid';
import ProductFilter from '../../components/product/ProductFilter';
import ProductSort from '../../components/product/ProductSort';
import Pagination from '../../components/common/Pagination';
import ErrorMessage from '../../components/common/ErrorMessage';
import productService from '../../api/productService';
import { PAGINATION } from '../../utils/constants';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState({
    searchTerm: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || null,
    sellerId: searchParams.get('sellerId') || null,
    minPrice: searchParams.get('minPrice') || null,
    maxPrice: searchParams.get('maxPrice') || null,
    minRating: searchParams.get('minRating') || null,
    sortBy: searchParams.get('sortBy') || 'newest',
    pageNumber: Number(searchParams.get('page')) || 1,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== '' && value !== undefined) {
          params[key] = value;
        }
      });

      const data = await productService.getProducts(params);

      setProducts(data.items || data.products || data || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalCount || data.totalItems || 0);
    } catch (err) {
      setError('فشل في تحميل المنتجات');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, pageNumber: 1 }));
  };

  const handleSearch = (term) => {
    setFilters((prev) => ({ ...prev, searchTerm: term, pageNumber: 1 }));
  };

  const handleSortChange = (sortBy) => {
    setFilters((prev) => ({ ...prev, sortBy, pageNumber: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, pageNumber: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      categoryId: null,
      sellerId: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      sortBy: 'newest',
      pageNumber: 1,
      pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    });
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={fetchProducts} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'الرئيسية', link: '/' },
          { label: 'المنتجات' },
        ]}
      />

      <h1 className="text-2xl font-bold mb-6">📦 المنتجات</h1>

      {/* Search */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} placeholder="ابحث عن منتج..." />
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Filter Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20">
            <ProductFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>
        </aside>

        {/* Products Section */}
        <main className="flex-1 min-w-0">

          {/* Mobile Filter */}
          <div className="lg:hidden mb-4">
            <ProductFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Sort + Count */}
          <div className="mb-6">
            <ProductSort
              value={filters.sortBy}
              onChange={handleSortChange}
              totalItems={totalItems}
            />
          </div>

          {/* Grid */}
          <ProductGrid products={products} loading={loading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={filters.pageNumber}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;