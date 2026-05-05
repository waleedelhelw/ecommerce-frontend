import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import categoryService from '../../api/categoryService';

const colors = [
  { bg: 'from-blue-500 to-blue-700', ring: 'ring-blue-300', light: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'from-purple-500 to-purple-700', ring: 'ring-purple-300', light: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'from-pink-500 to-pink-700', ring: 'ring-pink-300', light: 'bg-pink-100', text: 'text-pink-600' },
  { bg: 'from-green-500 to-green-700', ring: 'ring-green-300', light: 'bg-green-100', text: 'text-green-600' },
  { bg: 'from-orange-500 to-orange-700', ring: 'ring-orange-300', light: 'bg-orange-100', text: 'text-orange-600' },
  { bg: 'from-teal-500 to-teal-700', ring: 'ring-teal-300', light: 'bg-teal-100', text: 'text-teal-600' },
  { bg: 'from-red-500 to-red-700', ring: 'ring-red-300', light: 'bg-red-100', text: 'text-red-600' },
  { bg: 'from-indigo-500 to-indigo-700', ring: 'ring-indigo-300', light: 'bg-indigo-100', text: 'text-indigo-600' },
  { bg: 'from-yellow-500 to-yellow-600', ring: 'ring-yellow-300', light: 'bg-yellow-100', text: 'text-yellow-600' },
  { bg: 'from-cyan-500 to-cyan-700', ring: 'ring-cyan-300', light: 'bg-cyan-100', text: 'text-cyan-600' },
];

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getCategories();
      setCategories(data || []);
    } catch (err) {
      setError('فشل في تحميل التصنيفات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // ── Structured Data ──
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://tasawwaq.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'التصنيفات', item: 'https://tasawwaq.vercel.app/categories' },
    ],
  };

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

  const combinedSchema = categoriesStructuredData
    ? { '@context': 'https://schema.org', '@graph': [categoriesStructuredData, breadcrumbSchema] }
    : breadcrumbSchema;

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCategories} />;

  return (
    <>
      <SEO
        title="تصنيفات المنتجات"
        description={`تصفّح ${categories.length || 'جميع'} تصنيفات المنتجات على تسوّق.`}
        keywords="تصنيفات, اقسام, منتجات, الكترونيات, ملابس, احذية, اكسسوارات"
        url="/categories"
        structuredData={combinedSchema}
      />

      <div className="max-w-7xl mx-auto px-4 py-10">

        <Breadcrumb items={[{ label: 'التصنيفات' }]} />

        {/* ── Header ── */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">التصنيفات</h1>
          <p className="text-gray-500 text-sm">
            {categories.length} تصنيف متاح — اختر ما يناسبك
          </p>
          <div className="mt-3 w-16 h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const color = colors[index % colors.length];
            const firstLetter = category.name?.charAt(0) || '؟';

            return (
              <Link
                key={category.id}
                to={`/categories/${category.id}/products`}
                aria-label={`تصفح منتجات ${category.name}`}
                className="group relative bg-white rounded-2xl shadow-sm border border-gray-100
                           hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                           overflow-hidden flex items-center gap-4 p-5"
              >
                {/* الأيقونة (حرف ملون) */}
                <div className={`
                  relative shrink-0
                  w-16 h-16 rounded-2xl
                  bg-gradient-to-br ${color.bg}
                  flex items-center justify-center
                  shadow-md
                  group-hover:scale-105 transition-transform duration-300
                `}>
                  <span className="text-white text-2xl font-extrabold">
                    {firstLetter}
                  </span>
                  {/* زخرفة داخل الأيقونة */}
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white/20 pointer-events-none" />
                </div>

                {/* النص */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-base text-gray-800 truncate
                                  group-hover:${color.text} transition-colors`}>
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <span className={`inline-block mt-2 text-xs font-semibold ${color.text}`}>
                    تصفح المنتجات ←
                  </span>
                </div>

                {/* شريط لوني جانبي */}
                <div className={`absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b ${color.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;