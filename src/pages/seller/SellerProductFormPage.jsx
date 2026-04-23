import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowRight, FiPlus, FiTrash2 } from 'react-icons/fi';
import { createProduct, updateProduct, getMyProductById } from '../../api/seller/sellerProductService';
import { getCategories } from '../../api/categoryService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const SellerProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',
    images: [],
  });

  // تحميل الفئات
  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data?.items || data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProduct = async () => {
    try {
      setPageLoading(true);
      const data = await getMyProductById(id);
      setForm({
        name: data.name || '',
        description: data.description || '',
        price: data.price || '',
        stockQuantity: data.stockQuantity || '',
        categoryId: data.categoryId || '',
        imageUrl: data.imageUrl || '',
        images: data.images || [],
      });
    } catch (err) {
      setError('حدث خطأ في تحميل بيانات المنتج');
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // إضافة صورة جديدة
  const addImage = () => {
    setForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { imageUrl: '', altText: '', displayOrder: prev.images.length + 1, isMain: false },
      ],
    }));
  };

  // تعديل صورة
  const updateImage = (index, field, value) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      newImages[index] = { ...newImages[index], [field]: value };
      return { ...prev, images: newImages };
    });
  };

  // حذف صورة
  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!form.name || !form.price || !form.categoryId) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity) || 0,
        categoryId: parseInt(form.categoryId),
      };

      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      navigate('/seller/products');
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في حفظ المنتج');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <LoadingSpinner />;

  return (
    <div>
      {/* العنوان */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/seller/products')} className="p-2 hover:bg-gray-100 rounded-lg">
          <FiArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </h1>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* البيانات الأساسية */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">البيانات الأساسية</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="اسم المنتج"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="وصف المنتج"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الكمية بالمخزن</label>
              <input
                type="number"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف *</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              >
                <option value="">اختر التصنيف</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة الرئيسية</label>
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        {/* الصور المتعددة */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">صور إضافية</h2>
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              <FiPlus size={16} />
              إضافة صورة
            </button>
          </div>

          {form.images.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              لا توجد صور إضافية. اضغط "إضافة صورة" لإضافة المزيد.
            </p>
          ) : (
            <div className="space-y-3">
              {form.images.map((img, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="url"
                      value={img.imageUrl}
                      onChange={(e) => updateImage(index, 'imageUrl', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="رابط الصورة"
                    />
                    <input
                      type="text"
                      value={img.altText}
                      onChange={(e) => updateImage(index, 'altText', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="وصف الصورة"
                    />
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={img.displayOrder}
                        onChange={(e) => updateImage(index, 'displayOrder', parseInt(e.target.value))}
                        className="w-20 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="ترتيب"
                        min="0"
                      />
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={img.isMain}
                          onChange={(e) => updateImage(index, 'isMain', e.target.checked)}
                          className="rounded"
                        />
                        رئيسية
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* زر الحفظ */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            className="px-6 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <FiSave size={18} />
            {loading ? 'جاري الحفظ...' : isEdit ? 'تحديث المنتج' : 'إضافة المنتج'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerProductFormPage;