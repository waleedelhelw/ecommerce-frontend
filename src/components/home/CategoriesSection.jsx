import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../../api/categoryService';
import LoadingSpinner from '../common/LoadingSpinner';

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        // التعامل مع أي شكل للـ response
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

  const icons = ['📱', '💻', '👕', '🏠', '⌚', '📷', '🎮', '🎧', '👟', '💄'];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">🏷️ تسوق حسب التصنيف</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}/products`}
              className="card flex flex-col items-center justify-center p-6 hover:border-blue-300 transition-all"
            >
              <span className="text-3xl mb-2">{icons[index % icons.length]}</span>
              <span className="font-medium text-sm text-center">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
