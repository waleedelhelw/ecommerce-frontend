import { useState, useEffect } from 'react';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import categoryService from '../../api/categoryService';

const ProductFilter = ({ filters, onFilterChange, onReset }) => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showRating, setShowRating] = useState(true);
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setLocalMinPrice(filters.minPrice || '');
    setLocalMaxPrice(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handlePriceApply = () => {
    onFilterChange('minPrice', localMinPrice || null);
    onFilterChange('maxPrice', localMaxPrice || null);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    onReset();
    setIsOpen(false);
  };

  const hasActiveFilters =
    filters.categoryId || filters.minPrice || filters.maxPrice || filters.minRating;

  const handleQuickFilter = (key, value) => {
    onFilterChange(key, value);
  };

  const filterContent = (
    <div className="space-y-5">
      {/* التصنيفات */}
      <div>
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
        >
          <span>📂 التصنيفات</span>
          {showCategories ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        </button>

        {showCategories && (
          <div className="space-y-1 max-h-56 overflow-y-auto">
            <button
              onClick={() => handleQuickFilter('categoryId', null)}
              className={`w-full text-right text-sm px-3 py-2.5 rounded-xl transition-colors ${
                !filters.categoryId
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              الكل
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleQuickFilter('categoryId', cat.id)}
                className={`w-full text-right text-sm px-3 py-2.5 rounded-xl transition-colors ${
                  filters.categoryId == cat.id
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.name}
                {cat.productCount !== undefined && (
                  <span className="text-xs text-gray-400 mr-1">({cat.productCount})</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* السعر */}
      <div>
        <button
          onClick={() => setShowPrice(!showPrice)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
        >
          <span>💰 السعر</span>
          {showPrice ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        </button>

        {showPrice && (
          <div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="number"
                placeholder="من"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <input
                type="number"
                placeholder="إلى"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <button
              onClick={handlePriceApply}
              className="w-full bg-blue-600 text-white text-sm py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
            >
              تطبيق
            </button>
          </div>
        )}
      </div>

      {/* التقييم */}
      <div>
        <button
          onClick={() => setShowRating(!showRating)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
        >
          <span>⭐ التقييم</span>
          {showRating ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        </button>

        {showRating && (
          <div className="space-y-1">
            <button
              onClick={() => handleQuickFilter('minRating', null)}
              className={`w-full text-right text-sm px-3 py-2.5 rounded-xl transition-colors ${
                !filters.minRating
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              الكل
            </button>
            {[4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleQuickFilter('minRating', rating)}
                className={`w-full text-right text-sm px-3 py-2.5 rounded-xl transition-colors ${
                  filters.minRating == rating
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {'⭐'.repeat(rating)} وأعلى
              </button>
            ))}
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 text-sm text-red-600 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
        >
          <FiX size={14} />
          إعادة تعيين الفلاتر
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden lg:block bg-white rounded-2xl border p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiFilter size={18} />
          الفلاتر
        </h3>
        {filterContent}
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center gap-2 bg-white border rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <FiFilter size={16} />
          الفلاتر
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              فعّال
            </span>
          )}
        </button>

        {isOpen && (
          <div className="mt-3 bg-white rounded-2xl border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">تصفية النتائج</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <FiX size={18} />
              </button>
            </div>
            {filterContent}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductFilter;