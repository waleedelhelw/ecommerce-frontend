import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowRight, FiPlus, FiTrash2, FiUpload, FiImage, FiLoader, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { createProduct, updateProduct, getMyProductById } from '../../api/seller/sellerProductService';
import { getCategories } from '../../api/categoryService';
import { uploadImage } from '../../utils/cloudinary';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import toast from 'react-hot-toast';

const SellerProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const mainImageRef = useRef(null);
  const additionalImagesRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // ✅ حالة رفع الصور
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const [showImageGuide, setShowImageGuide] = useState(true);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',
    images: [],
    isActive: true, // ✅ مهم للـ update
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchProduct();
  }, [id]);

  // ✅ getCategories بترجع array مباشرة
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
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
        price: String(data.price || '').replace(/,/g, ''),
        stockQuantity: String(data.stockQuantity || '').replace(/,/g, ''),
        categoryId: data.categoryId || '',
        imageUrl: data.imageUrl || '',
        images: data.images || [],
        isActive: data.isActive !== undefined ? data.isActive : true, // ✅ الحالة من الـ API
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

  // ═══════════════════════════════════════
  // ✅ رفع الصورة الرئيسية من الجهاز
  // ═══════════════════════════════════════
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة فقط');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    try {
      setUploadingMain(true);
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
      toast.success('تم رفع الصورة الرئيسية بنجاح');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('فشل رفع الصورة');
    } finally {
      setUploadingMain(false);
      if (mainImageRef.current) mainImageRef.current.value = '';
    }
  };

  // ✅ حذف الصورة الرئيسية
  const removeMainImage = () => {
    setForm((prev) => ({ ...prev, imageUrl: '' }));
  };

  // ═══════════════════════════════════════
  // ✅ رفع صور إضافية من الجهاز
  // ═══════════════════════════════════════
  const handleAdditionalImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const invalidFiles = files.filter((f) => !f.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      toast.error('يرجى اختيار ملفات صور فقط');
      return;
    }

    const oversizedFiles = files.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('حجم كل صورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    try {
      setUploadingAdditional(true);
      const currentLength = form.images.length;

      const uploadPromises = files.map(async (file, index) => {
        const url = await uploadImage(file);
        return {
          imageUrl: url,
          altText: file.name.replace(/\.[^/.]+$/, ''),
          displayOrder: currentLength + index + 1,
          isMain: false,
        };
      });

      const newImages = await Promise.all(uploadPromises);

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));

      toast.success(`تم رفع ${newImages.length} صورة بنجاح`);
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('فشل رفع بعض الصور');
    } finally {
      setUploadingAdditional(false);
      if (additionalImagesRef.current) additionalImagesRef.current.value = '';
    }
  };

  // ✅ تعديل بيانات صورة إضافية
  const updateImage = (index, field, value) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      newImages[index] = { ...newImages[index], [field]: value };
      return { ...prev, images: newImages };
    });
  };

  // ✅ حذف صورة إضافية
  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ═══════════════════════════════════════
  // ✅ إرسال الفورم
  // ═══════════════════════════════════════
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.price || !form.categoryId) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);

      const cleanPrice = String(form.price).replace(/[,\s]/g, '');
      const cleanStock = String(form.stockQuantity).replace(/[,\s]/g, '');

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(cleanPrice),
        stockQuantity: parseInt(cleanStock) || 0,
        categoryId: parseInt(form.categoryId),
        imageUrl: form.imageUrl || null,
        isActive: form.isActive, // ✅ مهم جداً للـ update
        images: form.images
          .filter((img) => img.imageUrl && img.imageUrl.trim())
          .map((img, index) => ({
            imageUrl: img.imageUrl.trim(),
            altText: img.altText?.trim() || '',
            displayOrder: img.displayOrder || index + 1,
            isMain: img.isMain || false,
          })),
      };

      if (isEdit) {
        await updateProduct(id, payload);
        toast.success('تم تحديث المنتج بنجاح');
      } else {
        await createProduct(payload);
        toast.success('تم إضافة المنتج بنجاح');
      }

      navigate('/seller/products');
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = 'حدث خطأ في حفظ المنتج';

      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.errors) {
        const errors = errorData.errors;
        const errorMessages = [];
        for (const key in errors) {
          if (Array.isArray(errors[key])) {
            errorMessages.push(...errors[key]);
          } else {
            errorMessages.push(errors[key]);
          }
        }
        errorMessage = errorMessages.join(' | ');
      }

      setError(errorMessage);
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

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* ═══════════════════════════════════════ */}
        {/* البيانات الأساسية */}
        {/* ═══════════════════════════════════════ */}
        <div className="bg-white rounded-xl border p-4 sm:p-6">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">الكمية بالمخزن *</label>
              <input
                type="number"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="0"
                min="0"
                required
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
          </div>
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* ✅ الصورة الرئيسية - رفع من الجهاز */}
        {/* ═══════════════════════════════════════ */}
        <div className="bg-white rounded-xl border p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">الصورة الرئيسية</h2>
            <button
              type="button"
              onClick={() => setShowImageGuide((prev) => !prev)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
            >
              {showImageGuide ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              <span className="hidden sm:inline">{showImageGuide ? 'إخفاء' : 'إظهار'} المواصفات</span>
            </button>
          </div>

          {showImageGuide && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-4 text-xs sm:text-sm text-amber-900 space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-lg shrink-0">💡</span>
                <div>
                  <p className="font-semibold">عايز صور احترافية لمنتجك؟</p>
                  <p className="text-amber-700 mt-1">
                    ارفع صورة المنتج بتاعك على <strong>Gemini</strong> وانسخ البرومبت ده وحطه — 
                    Gemini هيظبطلك الصورة بالمواصفات المطلوبة ويديك كل بيانات المنتج.
                  </p>
                </div>
              </div>

              <div className="border-t border-amber-200 pt-3">
                <p className="font-semibold mb-2">🤖 البرومبت:</p>
                <div className="bg-white rounded-lg p-3 text-xs text-gray-700 border border-amber-100 font-mono leading-relaxed select-all whitespace-pre-wrap">
{`Create a professional e-commerce product photo from this image. Make it square 1:1, at least 1000x1000px, with a clean white or light solid background. Center the product to fill most of the frame. High resolution, well-lit, professional look. No text, logos, or watermarks.

Then, tell me everything about this product in Arabic: what's it called, what's it used for, what are its features, what category does it belong to, and what's a good price for it in EGP.`}</div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('Create a professional e-commerce product photo from this image. Make it square 1:1, at least 1000x1000px, with a clean white or light solid background. Center the product to fill most of the frame. High resolution, well-lit, professional look. No text, logos, or watermarks.\n\nThen, tell me everything about this product in Arabic: what\'s it called, what\'s it used for, what are its features, what category does it belong to, and what\'s a good price for it in EGP.');
                    toast.success('تم نسخ البرومبت');
                  }}
                  className="mt-1 text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  📋 نسخ البرومبت
                </button>
              </div>
            </div>
          )}

          {form.imageUrl ? (
            <div className="relative inline-block">
              <img
                src={form.imageUrl}
                alt="الصورة الرئيسية"
                className="w-48 h-48 object-cover rounded-xl border-2 border-green-200"
              />
              <button
                type="button"
                onClick={removeMainImage}
                className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg"
                title="حذف الصورة"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => !uploadingMain && mainImageRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-colors
                ${uploadingMain
                  ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                }`}
            >
              {uploadingMain ? (
                <div className="flex flex-col items-center gap-2">
                  <FiLoader size={32} className="text-green-500 animate-spin" />
                  <p className="text-sm text-gray-500">جاري رفع الصورة...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FiUpload size={32} className="text-gray-400" />
                  <p className="text-sm font-medium text-gray-600">اضغط لرفع الصورة الرئيسية</p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP - حد أقصى 5MB</p>
                </div>
              )}
            </div>
          )}

          <input
            ref={mainImageRef}
            type="file"
            accept="image/*"
            onChange={handleMainImageUpload}
            className="hidden"
          />
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* ✅ الصور الإضافية - رفع من الجهاز */}
        {/* ═══════════════════════════════════════ */}
        <div className="bg-white rounded-xl border p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-800">صور إضافية</h2>
            <button
              type="button"
              onClick={() => !uploadingAdditional && additionalImagesRef.current?.click()}
              disabled={uploadingAdditional}
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
            >
              {uploadingAdditional ? (
                <>
                  <FiLoader size={16} className="animate-spin" />
                  جاري الرفع...
                </>
              ) : (
                <>
                  <FiPlus size={16} />
                  إضافة صور
                </>
              )}
            </button>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-700">
            <p>💡 يفضّل أن تكون الصور الإضافية بنفس مواصفات الصورة الرئيسية — استخدم نفس البرومبت مع Gemini.</p>
          </div>

          <input
            ref={additionalImagesRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdditionalImagesUpload}
            className="hidden"
          />

          {form.images.length === 0 ? (
            <div
              onClick={() => !uploadingAdditional && additionalImagesRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-colors
                ${uploadingAdditional
                  ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                }`}
            >
              {uploadingAdditional ? (
                <div className="flex flex-col items-center gap-2">
                  <FiLoader size={32} className="text-green-500 animate-spin" />
                  <p className="text-sm text-gray-500">جاري رفع الصور...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FiImage size={32} className="text-gray-400" />
                  <p className="text-sm font-medium text-gray-600">اضغط لرفع صور إضافية</p>
                  <p className="text-xs text-gray-400">يمكنك اختيار عدة صور - PNG, JPG, WEBP</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {form.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.imageUrl}
                      alt={img.altText || `صورة ${index + 1}`}
                      className={`w-full h-32 object-cover rounded-lg border-2 transition-colors
                        ${img.isMain ? 'border-green-500' : 'border-gray-200 group-hover:border-green-300'}`}
                    />

                    {img.isMain && (
                      <span className="absolute top-1 right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        رئيسية
                      </span>
                    )}

                    <div className="absolute top-1 left-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-red-500/80 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md active:scale-95 transition-all"
                        title="حذف"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>

                    <div className="mt-2 space-y-1">
                      <input
                        type="text"
                        value={img.altText || ''}
                        onChange={(e) => updateImage(index, 'altText', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-xs outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="وصف الصورة"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={img.displayOrder || 0}
                          onChange={(e) => updateImage(index, 'displayOrder', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border rounded text-xs outline-none focus:ring-1 focus:ring-green-500"
                          placeholder="ترتيب"
                          min="0"
                        />
                        <label className="flex items-center gap-1 text-xs text-gray-600">
                          <input
                            type="checkbox"
                            checked={img.isMain || false}
                            onChange={(e) => updateImage(index, 'isMain', e.target.checked)}
                            className="rounded text-green-500"
                          />
                          رئيسية
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {/* ✅ زر إضافة المزيد */}
                <div
                  onClick={() => !uploadingAdditional && additionalImagesRef.current?.click()}
                  className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                >
                  {uploadingAdditional ? (
                    <FiLoader size={24} className="text-green-500 animate-spin" />
                  ) : (
                    <>
                      <FiPlus size={24} className="text-gray-400" />
                      <span className="text-xs text-gray-400 mt-1">إضافة</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* ✅ حالة المنتج - في حالة التعديل بس */}
        {/* ═══════════════════════════════════════ */}
        {isEdit && (
          <div className="bg-white rounded-xl border p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-gray-800">حالة المنتج</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {form.isActive ? 'المنتج نشط ومعروض للعملاء' : 'المنتج غير نشط ومخفي عن العملاء'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  form.isActive ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    form.isActive ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════ */}
        {/* زر الحفظ */}
        {/* ═══════════════════════════════════════ */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading || uploadingMain || uploadingAdditional}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
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