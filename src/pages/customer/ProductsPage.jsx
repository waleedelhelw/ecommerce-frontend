import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import SearchBar from '../../components/common/SearchBar';
import CategoryTabs from '../../components/product/CategoryTabs';
import ProductGrid from '../../components/product/ProductGrid';
import ProductSort from '../../components/product/ProductSort';
import Pagination from '../../components/common/Pagination';
import ErrorMessage from '../../components/common/ErrorMessage';
import productService from '../../api/productService';
import { PAGINATION } from '../../utils/constants';

const normalizeArabicSearchText = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[ًٌٍَُِّْ]/g, '')
    .replace(/ـ/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isSubsequence = (query, text) => {
  if (query.length < 3) return false;
  let queryIndex = 0;
  for (const char of text) {
    if (char === query[queryIndex]) queryIndex += 1;
    if (queryIndex === query.length) return true;
  }
  return false;
};

const getProductSearchText = (product) =>
  [product.name, product.description, product.categoryName, product.storeName, product.sellerName, product.brand]
    .filter(Boolean).join(' ');

const matchesFlexibleSearch = (product, term) => {
  const normalizedTerm = normalizeArabicSearchText(term);
  if (!normalizedTerm) return true;
  const searchableText = normalizeArabicSearchText(getProductSearchText(product));
  const compactTerm = normalizedTerm.replace(/\s/g, '');
  const compactText = searchableText.replace(/\s/g, '');
  if (searchableText.includes(normalizedTerm) || compactText.includes(compactTerm)) return true;
  return normalizedTerm.split(' ').filter((w) => w.length >= 2).some((word) => {
    const compactWord = word.replace(/\s/g, '');
    return searchableText.includes(word) || compactText.includes(compactWord) || isSubsequence(compactWord, compactText);
  });
};

const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  if (sortBy === 'price') return sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  if (sortBy === 'rating') return sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  if (sortBy === 'name') return sorted.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ar'));
  return sorted;
};

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

  const buildParams = (sourceFilters) => {
    const params = {};
    Object.entries(sourceFilters).forEach(([key, value]) => {
      if (value !== null && value !== '' && value !== undefined) {
        params[key] = value;
      }
    });
    return params;
  };

  useEffect(() => {
    const abortController = new AbortController();

    const fetchFlexibleSearchResults = async (baseParams, seedProducts = [], currentSearchTerm, currentSortBy, currentPageNumber) => {
      const fallbackParams = { ...baseParams, pageNumber: 1, pageSize: 200 };
      delete fallbackParams.searchTerm;

      const response = await productService.getProducts(fallbackParams);
      if (abortController.signal.aborted) return;
      const allItems = [...seedProducts, ...(response.items || response.products || response || [])];

      if (abortController.signal.aborted) return;

      const uniqueProducts = Array.from(
        new Map(allItems.map((product) => [product.id || product.productId, product])).values()
      );
      const matchedProducts = sortProducts(
        uniqueProducts.filter((product) => matchesFlexibleSearch(product, currentSearchTerm)),
        currentSortBy
      );

      const startIndex = (currentPageNumber - 1) * PAGINATION.DEFAULT_PAGE_SIZE;
      setProducts(matchedProducts.slice(startIndex, startIndex + PAGINATION.DEFAULT_PAGE_SIZE));
      setTotalPages(Math.max(1, Math.ceil(matchedProducts.length / PAGINATION.DEFAULT_PAGE_SIZE)));
      setTotalItems(matchedProducts.length);
    };

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = buildParams(filters);
        const data = await productService.getProducts(params);
        if (abortController.signal.aborted) return;
        const fetchedProducts = data.items || data.products || data || [];

        if (filters.searchTerm) {
          await fetchFlexibleSearchResults(
            params, fetchedProducts,
            filters.searchTerm, filters.sortBy, filters.pageNumber
          );
          return;
        }

        setProducts(fetchedProducts);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalCount || data.totalItems || 0);
      } catch (err) {
        if (abortController.signal.aborted) return;
        setError('فشل في تحميل المنتجات');
        console.error('Error fetching products:', err);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchProducts();

    return () => abortController.abort();
  }, [filters.categoryId, filters.searchTerm, filters.sellerId, filters.minPrice, filters.maxPrice, filters.minRating, filters.sortBy, filters.pageNumber, filters.pageSize]);

  useEffect(() => {
    const params = {};
    if (filters.searchTerm) params.search = filters.searchTerm;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.sellerId) params.sellerId = filters.sellerId;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.minRating) params.minRating = filters.minRating;
    if (filters.sortBy && filters.sortBy !== 'newest') params.sortBy = filters.sortBy;
    if (filters.pageNumber && filters.pageNumber !== 1) params.page = filters.pageNumber;
    setSearchParams(params);
  }, [filters.searchTerm, filters.categoryId, filters.sellerId, filters.minPrice, filters.maxPrice, filters.minRating, filters.sortBy, filters.pageNumber, setSearchParams]);

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

  const seoTitle = filters.searchTerm ? `نتائج البحث عن "${filters.searchTerm}"` : 'كل المنتجات';
  const seoDescription = filters.searchTerm
    ? `نتائج البحث عن "${filters.searchTerm}" في تسوّق. اكتشف ${totalItems} منتج بأفضل الأسعار.`
    : `اكتشف آلاف المنتجات على تسوّق. تصفّح ${totalItems > 0 ? totalItems : 'آلاف'} منتج من بائعين موثوقين بأفضل الأسعار وتوصيل لكل مصر.`;

  if (error) {
    return (
      <div className="px-4 py-6">
        <SEO title="خطأ في تحميل المنتجات" noindex={true} />
        <ErrorMessage message={error} onRetry={() => setFilters((prev) => ({ ...prev }))} />
      </div>
    );
  }

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords="منتجات, تسوق, شراء اونلاين, متجر الكتروني, اسعار, خصومات"
        url={`/products${filters.searchTerm ? `?search=${filters.searchTerm}` : ''}`}
      />

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">المنتجات</h1>
          <p className="text-sm text-gray-500 mt-0.5">اختر ما يناسبك من آلاف المنتجات</p>
        </div>

        {/* Search */}
        <div className="mb-3">
          <SearchBar onSearch={handleSearch} placeholder="ابحث عن منتج..." initialValue={filters.searchTerm} />
        </div>

        {/* Category Tabs */}
        <div className="mb-4">
          <CategoryTabs
            selectedId={filters.categoryId}
            onSelect={(id) => handleFilterChange('categoryId', id)}
          />
        </div>

        {/* Sort + Results count */}
        <div className="mb-4">
          <ProductSort
            value={filters.sortBy}
            onChange={handleSortChange}
            totalItems={totalItems}
          />
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} loading={loading} variant="simple" />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={filters.pageNumber}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsPage;
