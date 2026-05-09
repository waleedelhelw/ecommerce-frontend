import { useState, useEffect, useRef } from 'react';
import categoryService from '../../api/categoryService';

const CategoryTabs = ({ selectedId, onSelect }) => {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    categoryService.getCategories().then((data) => {
      const cats = Array.isArray(data) ? data
        : data?.items || data?.categories || data?.data || [];
      setCategories(cats);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!scrollRef.current || !selectedId) return;
    const active = scrollRef.current.querySelector('[data-active="true"]');
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedId]);

  return (
    <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
      <button
        onClick={() => onSelect(null)}
        data-active={!selectedId}
        className={`snap-start shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
          !selectedId
            ? 'bg-black text-white shadow-sm'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        الكل
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          data-active={selectedId == cat.id}
          className={`snap-start shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            selectedId == cat.id
              ? 'bg-black text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
