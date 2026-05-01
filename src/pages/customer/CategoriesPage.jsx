import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import categoryService from '../../api/categoryService';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data || []);
    } catch (err) {
      setError('فشل في تحميل التصنيفات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const icons = ['📱', '💻', '👕', '🏠', '⌚', '📷', '🎮', '🎧', '👟', '💄'];

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
    ],
  };

  // ✅ Structured Data للتصنيفات
  const categoriesStructuredData = categories.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'تصنيفات المنتجات',
    description: 'تصفّح جميع تصنيفات المنتجات على تسوّق',
    url: 'https://tasawwaq.vercel.app/categories',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: categories.length,
      itemListElement: categories.map((cat, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: cat.name,
        url: `https://tasawwaq.vercel.app/categories/${cat.id}/products`,
      })),
    },
  } : null;

  // ✅ دمج الـ Schemas
  const combinedSchema = categoriesStructuredData ? {
    '@context': 'https://schema.org',
    '@graph': [categoriesStructuredData, breadcrumbSchema],
  } : breadcrumbSchema;

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCategories} />;

  return (
    <>
      <SEO
        title="تصنيفات المنتجات"
        description={`تصفّح ${categories.length || 'جميع'} تصنيفات المنتجات على تسوّق. ابحث عن المنتجات حسب التصنيف من إلكترونيات، ملابس، أحذية، إكسسوارات وأكثر.`}
        keywords="تصنيفات, اقسام, منتجات, الكترونيات, ملابس, احذية, اكسسوارات, اجهزة منزلية"
        url="/categories"
        structuredData={combinedSchema}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'التصنيفات' }]} />

        <h1 className="text-2xl font-bold mb-8">🏷️ التصنيفات</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}/products`}
              className="card p-8 text-center hover:border-purple-300 transition-all group"
            >
              <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform">
                {icons[index % icons.length]}
              </span>
              <h3 className="text-lg font-bold mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-500">{category.description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;