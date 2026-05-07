import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../../api/categoryService';
import LoadingSpinner from '../common/LoadingSpinner';

const colors = [
  { bg: 'from-blue-500 to-blue-700', light: 'bg-blue-400/30' },
  { bg: 'from-purple-500 to-purple-700', light: 'bg-purple-400/30' },
  { bg: 'from-pink-500 to-pink-700', light: 'bg-pink-400/30' },
  { bg: 'from-green-500 to-green-700', light: 'bg-green-400/30' },
  { bg: 'from-orange-500 to-orange-700', light: 'bg-orange-400/30' },
  { bg: 'from-teal-500 to-teal-700', light: 'bg-teal-400/30' },
  { bg: 'from-red-500 to-red-700', light: 'bg-red-400/30' },
  { bg: 'from-indigo-500 to-indigo-700', light: 'bg-indigo-400/30' },
  { bg: 'from-yellow-500 to-yellow-700', light: 'bg-yellow-400/30' },
  { bg: 'from-cyan-500 to-cyan-700', light: 'bg-cyan-400/30' },
];

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && Array.isArray(data.items)) {
          setCategories(data.items);
        } else if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else if (data && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (categories.length === 0) return null;

  return (
    <section className="py-8 sm:py-10 md:py-14" aria-labelledby="categories-section-title">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="text-center mb-6 sm:mb-10">
          <h2
            id="categories-section-title"
            className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2"
          >
            تسوق حسب التصنيف
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm">
            اختر التصنيف المناسب وابدأ التسوق
          </p>
          <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((category, index) => {
            const color = colors[index % colors.length];
            const firstLetter = category.name?.charAt(0) || '؟';

            return (
              <Link
                key={category.id}
                to={`/categories/${category.id}/products`}
                aria-label={`تصفح منتجات ${category.name}`}
                className={`
                  relative overflow-hidden
                  bg-gradient-to-br ${color.bg}
                  rounded-2xl p-4 sm:p-5
                  min-h-[120px] sm:min-h-[140px]
                  flex flex-col items-center justify-center gap-3
                  text-center shadow-sm
                  hover:shadow-lg hover:-translate-y-1
                  transition-all duration-300 group
                `}
              >
                <div
                  className={`
                    w-12 h-12 sm:w-14 sm:h-14 rounded-full ${color.light}
                    flex items-center justify-center
                    group-hover:scale-110 transition-transform duration-300
                  `}
                >
                  <span className="text-white text-xl sm:text-2xl font-extrabold">
                    {firstLetter}
                  </span>
                </div>

                <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
                  {category.name}
                </h3>

                <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-white/10 pointer-events-none" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;