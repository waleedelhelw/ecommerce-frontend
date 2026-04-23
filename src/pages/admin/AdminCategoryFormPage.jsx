import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CategoryForm from '../../components/admin/CategoryForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import adminCategoryService from '../../api/admin/adminCategoryService';

const AdminCategoryFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategory = async () => {
    if (!isEdit) return;
    try {
      setLoading(true);
      setError(null);
      const data = await adminCategoryService.getCategory(id);
      setCategory(data);
    } catch (err) {
      setError('فشل في تحميل بيانات التصنيف');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCategory} />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? '✏️ تعديل التصنيف' : '➕ إضافة تصنيف جديد'}
      </h1>
      <CategoryForm category={category} />
    </div>
  );
};

export default AdminCategoryFormPage;