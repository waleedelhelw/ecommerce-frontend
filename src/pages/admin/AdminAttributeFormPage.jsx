import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPlus, FiX } from 'react-icons/fi';
import Input from '../../components/common/Input';
import adminAttributeService from '../../api/admin/adminAttributeService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import toast from 'react-hot-toast';

const AdminAttributeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    displayOrder: 0,
    values: [''],
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    const fetchAttribute = async () => {
      try {
        setPageLoading(true);
        setPageError(null);
        const data = await adminAttributeService.getAttributeById(id);
        setFormData({
          name: data.name || '',
          displayOrder: data.displayOrder ?? 0,
          values: Array.isArray(data.values)
            ? data.values.map((v) => (typeof v === 'string' ? v : v.value || ''))
            : [''],
        });
      } catch (err) {
        setPageError('فشل في تحميل بيانات الخاصية');
      } finally {
        setPageLoading(false);
      }
    };
    fetchAttribute();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleValueChange = (index, value) => {
    setFormData((prev) => {
      const values = [...prev.values];
      values[index] = value;
      return { ...prev, values };
    });
  };

  const addValue = () => {
    setFormData((prev) => ({ ...prev, values: [...prev.values, ''] }));
  };

  const removeValue = (index) => {
    setFormData((prev) => {
      const values = prev.values.filter((_, i) => i !== index);
      return { ...prev, values: values.length === 0 ? [''] : values };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'اسم الخاصية مطلوب';

    const nonEmptyValues = formData.values.filter((v) => v.trim());
    if (nonEmptyValues.length === 0) {
      newErrors.values = 'يجب إضافة قيمة واحدة على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      displayOrder: Number(formData.displayOrder) || 0,
      values: formData.values.filter((v) => v.trim()).map((v) => ({ value: v.trim() })),
    };

    try {
      setLoading(true);
      if (isEdit) {
        await adminAttributeService.updateAttribute(id, payload);
        toast.success('تم تعديل الخاصية بنجاح');
      } else {
        await adminAttributeService.createAttribute(payload);
        toast.success('تم إضافة الخاصية بنجاح');
      }
      navigate('/admin/attributes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <LoadingSpinner size="lg" />;
  if (pageError) return <ErrorMessage message={pageError} onRetry={() => window.location.reload()} />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? '✏️ تعديل الخاصية' : '➕ إضافة خاصية جديدة'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 max-w-lg">
        <Input
          label="اسم الخاصية *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="مثال: اللون، السعة، المقاس"
          error={errors.name}
        />

        <Input
          label="ترتيب العرض"
          name="displayOrder"
          type="number"
          value={formData.displayOrder}
          onChange={handleChange}
          placeholder="0"
        />

        {/* Values */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            قيم الخاصية *
          </label>
          <div className="space-y-2">
            {formData.values.map((value, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  placeholder={`القيمة ${index + 1}`}
                  className="input-field flex-1"
                />
                {formData.values.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeValue(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف القيمة"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.values && (
            <p className="mt-1 text-sm text-red-500">{errors.values}</p>
          )}
          <button
            type="button"
            onClick={addValue}
            className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FiPlus size={14} />
            إضافة قيمة
          </button>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading
              ? 'جاري الحفظ...'
              : isEdit
                ? '💾 تعديل الخاصية'
                : '💾 إضافة الخاصية'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/attributes')}
            className="btn-secondary"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAttributeFormPage;
