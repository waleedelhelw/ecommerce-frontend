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
        productService.getProducts({ categoryId: id, pageNumber: currentPage, pageSize: ITEMS_PER_PAGE }),
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

  useEffect(() => { fetchData(); }, [id, currentPage]);

  if (error) return (
    <>
      <SEO title="خطأ في تحميل التصنيف" noindex={true} />
      <ErrorMessage message={error} onRetry={fetchData} />
    </>
  );

  const categoryName = category?.name || 'تصنيف';

  // ✅ Breadcrumb Schema
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
        name: 'التصنيفات',
        item: 'https://tasawwaq.vercel.app/categories',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `https://tasawwaq.vercel.app/categories/${id}/products`,
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'التصنيفات', link: '/categories' },
            { label: categoryName },
          ]}
        />

        <h1 className="text-2xl font-bold mb-8">🏷️ {categoryName}</h1>

        <ProductGrid products={products} loading={loading} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    </>
  );
};

export default CategoryProductsPage;