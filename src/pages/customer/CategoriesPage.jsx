import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCategories} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'الرئيسية', link: '/' }, { label: 'التصنيفات' }]} />
      <h1 className="text-2xl font-bold mb-8">🏷️ التصنيفات</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Link key={category.id} to={`/categories/${category.id}/products`} className="card p-8 text-center hover:border-blue-300 transition-all group">
            <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform">{icons[index % icons.length]}</span>
            <h3 className="text-lg font-bold mb-2">{category.name}</h3>
            {category.description && <p className="text-sm text-gray-500">{category.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
