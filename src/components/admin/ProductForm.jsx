import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import SingleImageUploader from './SingleImageUploader';  // ✅ جديد
import categoryService from '../../api/categoryService';
import adminProductService from '../../api/admin/adminProductService';
import toast from 'react-hot-toast';

const ProductForm = ({ product = null }) => {
  const navigate = useNavigate();
  const isEdit = !!product;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',          // ✅ URL واحد بس
    isActive: true,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price
          ? String(product.price).replace(/,/g, '')
          : '',
        stockQuantity: product.stockQuantity
          ? String(product.stockQuantity).replace(/,/g, '')
          : '',
        categoryId: product.categoryId || '',
        imageUrl: product.imageUrl || '',    // ✅ الصورة اللي موجودة
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;

    if (name === 'price' || name === 'stockQuantity') {
      finalValue = String(value).replace(/,/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ✅ تحديث الصورة
  const handleImageChange = (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    if (errors.imageUrl) {
      setErrors((prev) => ({ ...prev, imageUrl: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'اسم المنتج مطلوب';
    if (!formData.description.trim()) newErrors.description = 'الوصف مطلوب';
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = 'السعر يجب أن يكون أكبر من 0';
    if (!formData.stockQuantity && formData.stockQuantity !== 0)
      newErrors.stockQuantity = 'الكمية مطلوبة';
    if (Number(formData.stockQuantity) < 0)
      newErrors.stockQuantity = 'الكمية لا يمكن أن تكون سالبة';
    if (!formData.categoryId) newErrors.categoryId = 'التصنيف مطلوب';
    if (!formData.imageUrl) newErrors.imageUrl = 'صورة المنتج مطلوبة';  // ✅
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        categoryId: Number(formData.categoryId),
      };

      if (isEdit) {
        await adminProductService.updateProduct(product.id, payload);
        toast.success('تم تعديل المنتج بنجاح');
      } else {
        await adminProductService.createProduct(payload);
        toast.success('تم إضافة المنتج بنجاح');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 max-w-2xl">
      <Input
        label="اسم المنتج *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="أدخل اسم المنتج"
        error={errors.name}
      />

      <Input
        label="الوصف *"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        placeholder="أدخل وصف المنتج"
        error={errors.description}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="السعر *"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          error={errors.price}
        />
        <Input
          label="الكمية *"
          name="stockQuantity"
          type="number"
          value={formData.stockQuantity}
          onChange={handleChange}
          placeholder="0"
          min="0"
          error={errors.stockQuantity}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          التصنيف *
        </label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className={`input-field ${errors.categoryId ? 'input-error' : ''}`}
        >
          <option value="">اختر التصنيف</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>
        )}
      </div>

      {/* ✅ رفع الصورة - بدل input اللينك */}
      <SingleImageUploader
        imageUrl={formData.imageUrl}
        onChange={handleImageChange}
        error={errors.imageUrl}
      />

      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            منتج نشط (Active)
          </span>
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'جاري الحفظ...' : isEdit ? '💾 تعديل المنتج' : '💾 إضافة المنتج'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="btn-secondary"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
};

export default ProductForm;