import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import adminCategoryService from '../../api/admin/adminCategoryService';
import toast from 'react-hot-toast';

const CategoryForm = ({ category = null }) => {
  const navigate = useNavigate();
  const isEdit = !!category;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'اسم التصنيف مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      if (isEdit) {
        await adminCategoryService.updateCategory(category.id, formData);
        toast.success('تم تعديل التصنيف بنجاح');
      } else {
        await adminCategoryService.createCategory(formData);
        toast.success('تم إضافة التصنيف بنجاح');
      }
      navigate('/admin/categories');
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 max-w-lg">
      <Input
        label="اسم التصنيف *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="أدخل اسم التصنيف"
        error={errors.name}
      />

      <Input
        label="الوصف"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        placeholder="أدخل وصف التصنيف (اختياري)"
      />

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'جاري الحفظ...' : isEdit ? '💾 تعديل التصنيف' : '💾 إضافة التصنيف'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/categories')}
          className="btn-secondary"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;