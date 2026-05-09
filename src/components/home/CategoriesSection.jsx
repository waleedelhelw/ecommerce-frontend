import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import categoryService from '../../api/categoryService';
import LoadingSpinner from '../common/LoadingSpinner';

const colors = [
  { from: 'from-blue-500', to: 'to-blue-600', light: 'bg-blue-100', text: 'text-blue-600', shadow: 'shadow-blue-500/20' },
  { from: 'from-purple-500', to: 'to-purple-600', light: 'bg-purple-100', text: 'text-purple-600', shadow: 'shadow-purple-500/20' },
  { from: 'from-pink-500', to: 'to-pink-600', light: 'bg-pink-100', text: 'text-pink-600', shadow: 'shadow-pink-500/20' },
  { from: 'from-green-500', to: 'to-green-600', light: 'bg-green-100', text: 'text-green-600', shadow: 'shadow-green-500/20' },
  { from: 'from-orange-500', to: 'to-orange-600', light: 'bg-orange-100', text: 'text-orange-600', shadow: 'shadow-orange-500/20' },
  { from: 'from-teal-500', to: 'to-teal-600', light: 'bg-teal-100', text: 'text-teal-600', shadow: 'shadow-teal-500/20' },
  { from: 'from-red-500', to: 'to-red-600', light: 'bg-red-100', text: 'text-red-600', shadow: 'shadow-red-500/20' },
  { from: 'from-indigo-500', to: 'to-indigo-600', light: 'bg-indigo-100', text: 'text-indigo-600', shadow: 'shadow-indigo-500/20' },
  { from: 'from-yellow-500', to: 'to-yellow-600', light: 'bg-yellow-100', text: 'text-yellow-600', shadow: 'shadow-yellow-500/20' },
  { from: 'from-cyan-500', to: 'to-cyan-600', light: 'bg-cyan-100', text: 'text-cyan-600', shadow: 'shadow-cyan-500/20' },
];

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

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

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (loading) return <LoadingSpinner />;
  if (categories.length === 0) return null;

  return (
    <section className="py-8 sm:py-14" aria-labelledby="categories-section-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-5 sm:mb-8">
          <div>
            <h2
              id="categories-section-title"
              className="text-2xl sm:text-3xl font-extrabold text-gray-900"
            >
              تسوق حسب التصنيف
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              اختر التصنيف المناسب وابدأ التسوق
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="السابق"
            >
              <FiChevronRight size={18} />
            </button>
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="التالي"
            >
              <FiChevronLeft size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        >
          {categories.map((category, index) => {
            const color = colors[index % colors.length];

            return (
              <Link
                key={category.id}
                to={`/categories/${category.id}/products`}
                aria-label={`تصفح منتجات ${category.name}`}
                className="snap-start shrink-0 w-[120px] sm:w-[140px] group"
              >
                <div
                  className={`
                    relative overflow-hidden
                    bg-gradient-to-br ${color.from} ${color.to}
                    rounded-2xl p-4 sm:p-5
                    flex flex-col items-center justify-center gap-2
                    text-center
                    shadow-sm hover:shadow-lg ${color.shadow}
                    hover:-translate-y-1
                    transition-all duration-300
                    min-h-[100px] sm:min-h-[120px]
                  `}
                >
                  <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
                    {category.name}
                  </h3>

                  {category.productCount > 0 && (
                    <span className="text-white/70 text-[10px] sm:text-xs">
                      {category.productCount} منتج
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
