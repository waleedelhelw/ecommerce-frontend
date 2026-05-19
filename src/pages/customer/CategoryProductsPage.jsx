import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductGrid from '../../components/product/ProductGrid';
import Pagination from '../../components/common/Pagination';
import ErrorMessage from '../../components/common/ErrorMessage';
import productService from '../../api/productService';
import categoryService from '../../api/categoryService';
import { ITEMS_PER_PAGE } from '../../utils/constants';

const CategoryProductsPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [catData, prodData] = await Promise.all([
        categoryService.getCategory(id).catch(() => ({ name: 'تصنيف' })),
        productService.getProducts({
          categoryId: id,
          pageNumber: currentPage,
          pageSize: ITEMS_PER_PAGE,
        }),
      ]);
      setCategory(catData);
      setProducts(prodData.items || prodData.products || prodData || []);
      setTotalPages(prodData.totalPages || 1);
      setTotalCount(prodData.totalCount || 0);
    } catch (err) {
      setError('فشل في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, currentPage]);

  if (error) {
    return (
      <>
        <SEO title="خطأ في تحميل التصنيف" noindex={true} />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
          <ErrorMessage message={error} onRetry={fetchData} />
        </div>
      </>
    );
  }

  const categoryName = category?.name || 'تصنيف';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: 'https://www.tasawwaq.store',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'التصنيفات',
        item: 'https://www.tasawwaq.store/categories',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `https://www.tasawwaq.store/categories/${id}/products`,
      },
    ],
  };

  return (
    <>
      <SEO
        title={`${categoryName} - منتجات وعروض`}
        description={`اكتشف ${totalCount > 0 ? totalCount : 'أحدث'} منتج في تصنيف ${categoryName} على تسوّق. أفضل الأسعار، توصيل سريع لكل مصر، وضمان الجودة.`}
        keywords={`${categoryName}, منتجات ${categoryName}, شراء ${categoryName}, ${categoryName} اونلاين`}
        url={`/categories/${id}/products`}
        structuredData={breadcrumbSchema}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        <Breadcrumb
          items={[
            { label: 'التصنيفات', link: '/categories' },
            { label: categoryName },
          ]}
        />

        <div className="mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">🏷️ {categoryName}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalCount > 0 ? `${totalCount} منتج متاح` : 'تصفّح منتجات هذا التصنيف'}
          </p>
          {category?.description && (
            <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-3xl">
              {category.description}
            </p>
          )}
        </div>

        <ProductGrid products={products} loading={loading} variant="simple" />

        {totalPages > 1 && (
          <div className="mt-6 sm:mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryProductsPage;