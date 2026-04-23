import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    } catch (err) {
      setError('فشل في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id, currentPage]);

  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'الرئيسية', link: '/' }, { label: 'التصنيفات', link: '/categories' }, { label: category?.name || 'تصنيف' }]} />
      <h1 className="text-2xl font-bold mb-8">🏷️ {category?.name || 'منتجات التصنيف'}</h1>
      <ProductGrid products={products} loading={loading} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    </div>
  );
};

export default CategoryProductsPage;
