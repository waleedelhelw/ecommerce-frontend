import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import SearchBar from '../../components/common/SearchBar';
import ProductGrid from '../../components/product/ProductGrid';
import ProductFilter from '../../components/product/ProductFilter';
import ProductSort from '../../components/product/ProductSort';
import Pagination from '../../components/common/Pagination';
import ErrorMessage from '../../components/common/ErrorMessage';
import productService from '../../api/productService';
import { PAGINATION } from '../../utils/constants';

const FALLBACK_SEARCH_PAGE_LIMIT = 8;

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
  [
    product.name,
    product.description,
    product.categoryName,
    product.storeName,
    product.sellerName,
    product.brand,
  ]
    .filter(Boolean)
    .join(' ');

const matchesFlexibleSearch = (product, term) => {
  const normalizedTerm = normalizeArabicSearchText(term);
  if (!normalizedTerm) return true;

  const searchableText = normalizeArabicSearchText(getProductSearchText(product));
  const compactTerm = normalizedTerm.replace(/\s/g, '');
  const compactText = searchableText.replace(/\s/g, '');

  if (searchableText.includes(normalizedTerm) || compactText.includes(compactTerm)) {
    return true;
  }

  return normalizedTerm
    .split(' ')
    .filter((word) => word.length >= 2)
    .some((word) => {
      const compactWord = word.replace(/\s/g, '');
      return (
        searchableText.includes(word) ||
        compactText.includes(compactWord) ||
        isSubsequence(compactWord, compactText)
      );
    });
};

const sortProducts = (products, sortBy) => {
  const sortedProducts = [...products];

  if (sortBy === 'price') {
    return sortedProducts.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  }

  if (sortBy === 'rating') {
    return sortedProducts.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  }

  if (sortBy === 'name') {
    return sortedProducts.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ar'));
  }

  return sortedProducts;
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

  const fetchFlexibleSearchResults = async (baseParams, seedProducts = []) => {
    const fallbackParams = {
      ...baseParams,
      pageNumber: 1,
      pageSize: PAGINATION.MAX_PAGE_SIZE,
    };
    delete fallbackParams.searchTerm;

    const firstPage = await productService.getProducts(fallbackParams);
    const firstItems = firstPage.items || firstPage.products || firstPage || [];
    const fallbackTotalPages = Math.min(firstPage.totalPages || 1, FALLBACK_SEARCH_PAGE_LIMIT);
    const allItems = [...seedProducts, ...firstItems];

    for (let pageNumber = 2; pageNumber <= fallbackTotalPages; pageNumber += 1) {
      const pageData = await productService.getProducts({
        ...fallbackParams,
        pageNumber,
      });
      allItems.push(...(pageData.items || pageData.products || pageData || []));
    }

    const uniqueProducts = Array.from(
      new Map(allItems.map((product) => [product.id || product.productId, product])).values()
    );
    const matchedProducts = sortProducts(
      uniqueProducts.filter((product) => matchesFlexibleSearch(product, filters.searchTerm)),
      filters.sortBy
    );

    const startIndex = (filters.pageNumber - 1) * filters.pageSize;
    setProducts(matchedProducts.slice(startIndex, startIndex + filters.pageSize));
    setTotalPages(Math.max(1, Math.ceil(matchedProducts.length / filters.pageSize)));
    setTotalItems(matchedProducts.length);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = buildParams(filters);

      const data = await productService.getProducts(params);
      const fetchedProducts = data.items || data.products || data || [];

      if (filters.searchTerm) {
        await fetchFlexibleSearchResults(params, fetchedProducts);
        return;
      }

      setProducts(fetchedProducts);
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
  }, [filters, setSearchParams]);

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

  const seoTitle = filters.searchTerm ? `نتائج البحث عن "${filters.searchTerm}"` : 'كل المنتجات';

  const seoDescription = filters.searchTerm
    ? `نتائج البحث عن "${filters.searchTerm}" في تسوّق. اكتشف ${totalItems} منتج بأفضل الأسعار.`
    : `اكتشف آلاف المنتجات على تسوّق. تصفّح ${totalItems > 0 ? totalItems : 'آلاف'} منتج من بائعين موثوقين بأفضل الأسعار وتوصيل لكل مصر.`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: 'https://tasawwaq.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'المنتجات',
        item: 'https://tasawwaq.vercel.app/products',
      },
    ],
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        <SEO title="خطأ في تحميل المنتجات" noindex={true} />
        <ErrorMessage message={error} onRetry={fetchProducts} />
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
        structuredData={breadcrumbSchema}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        <Breadcrumb items={[{ label: 'المنتجات' }]} />

        <div className="mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">📦 المنتجات</h1>
          <p className="text-sm text-gray-500 mt-1">تصفّح المنتجات بسهولة واختر الأنسب لك</p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} placeholder="ابحث عن منتج..." />
        </div>

        {/* Mobile-first layout */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
          {/* Filter Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
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
            <div className="lg:hidden mb-3">
              <ProductFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>

            {/* Sort + Count */}
            <div className="mb-4">
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
              <div className="mt-6 sm:mt-8">
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
    </>
  );
};

export default ProductsPage;
