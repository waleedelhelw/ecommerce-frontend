import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiSave, FiArrowRight } from 'react-icons/fi';
import {
  createOffer,
  updateOffer,
  getMyOffers,
} from '../../api/seller/sellerOfferService';
import { getMyProducts } from '../../api/seller/sellerProductService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import toast from 'react-hot-toast';

const SellerOfferFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);

  const [pageLoading, setPageLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    productId: '',
    offerType: 'Discount',
    title: '',
    description: '',
    discountPercentage: '',
    offerPrice: '',
    buyQuantity: '',
    freeQuantity: '',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: '',
  });

  useEffect(() => {
    fetchProducts();
    if (isEdit) loadOfferData();
  }, [id]);

  const loadOfferData = () => {
    const stateOffer = location.state?.offer;
    if (stateOffer) {
      setForm({
        productId: stateOffer.productId || '',
        offerType: stateOffer.offerType || 'Discount',
        title: stateOffer.title || '',
        description: stateOffer.description || '',
        discountPercentage: stateOffer.discountPercentage ?? '',
        offerPrice: stateOffer.offerPrice ?? '',
        buyQuantity: stateOffer.buyQuantity ?? '',
        freeQuantity: stateOffer.freeQuantity ?? '',
        startDate: stateOffer.startDate ? stateOffer.startDate.slice(0, 16) : '',
        endDate: stateOffer.endDate ? stateOffer.endDate.slice(0, 16) : '',
      });
      setPageLoading(false);
    } else {
      fetchOfferFromList();
    }
  };

  const fetchOfferFromList = async () => {
    try {
      setPageLoading(true);
      const data = await getMyOffers({ pageSize: 200 });
      const items = data?.items || [];
      const offer = items.find((o) => String(o.id) === String(id));
      if (!offer) throw new Error('العرض غير موجود');
      setForm({
        productId: offer.productId || '',
        offerType: offer.offerType || 'Discount',
        title: offer.title || '',
        description: offer.description || '',
        discountPercentage: offer.discountPercentage ?? '',
        offerPrice: offer.offerPrice ?? '',
        buyQuantity: offer.buyQuantity ?? '',
        freeQuantity: offer.freeQuantity ?? '',
        startDate: offer.startDate ? offer.startDate.slice(0, 16) : '',
        endDate: offer.endDate ? offer.endDate.slice(0, 16) : '',
      });
    } catch {
      setError('حدث خطأ في تحميل بيانات العرض');
    } finally {
      setPageLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getMyProducts({ pageSize: 200 });
      setProducts(data?.items || data || []);
    } catch {
      setProducts([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.productId) errs.productId = 'اختر المنتج';
    if (!form.title.trim()) errs.title = 'عنوان العرض مطلوب';
    if (!form.startDate) errs.startDate = 'تاريخ البداية مطلوب';
    if (!form.endDate) errs.endDate = 'تاريخ النهاية مطلوب';
    if (form.startDate && form.endDate && new Date(form.startDate) >= new Date(form.endDate)) {
      errs.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
    }

    if (form.offerType === 'Discount') {
      const hasPercentage = form.discountPercentage !== '' && Number(form.discountPercentage) > 0;
      const hasOfferPrice = form.offerPrice !== '' && Number(form.offerPrice) > 0;
      if (!hasPercentage && !hasOfferPrice) {
        errs.discountPercentage = 'حدد نسبة الخصم أو سعر العرض';
      }
      if (hasPercentage && (Number(form.discountPercentage) < 1 || Number(form.discountPercentage) > 99)) {
        errs.discountPercentage = 'نسبة الخصم بين 1 و 99';
      }
    }

    if (form.offerType === 'BuyOneGetOne') {
      if (!form.buyQuantity || Number(form.buyQuantity) < 1) errs.buyQuantity = 'عدد الشراء يجب أن يكون 1 على الأقل';
      if (!form.freeQuantity || Number(form.freeQuantity) < 1) errs.freeQuantity = 'الكمية المجانية يجب أن تكون 1 على الأقل';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      productId: Number(form.productId),
      offerType: form.offerType,
      title: form.title.trim(),
      description: form.description.trim() || null,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    };

    if (form.offerType === 'Discount') {
      payload.discountPercentage = form.discountPercentage !== '' ? Number(form.discountPercentage) : null;
      payload.offerPrice = form.offerPrice !== '' ? Number(form.offerPrice) : null;
      payload.buyQuantity = null;
      payload.freeQuantity = null;
    } else {
      payload.buyQuantity = Number(form.buyQuantity);
      payload.freeQuantity = Number(form.freeQuantity);
      payload.discountPercentage = null;
      payload.offerPrice = null;
    }

    try {
      setSubmitting(true);
      if (isEdit) {
        await updateOffer(id, payload);
        toast.success('تم تحديث العرض بنجاح');
      } else {
        await createOffer(payload);
        toast.success('تم إنشاء العرض بنجاح');
      }
      navigate('/seller/offers');
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل حفظ العرض');
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const selectedProduct = products.find((p) => String(p.id) === String(form.productId));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/seller/offers')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <FiArrowRight size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">العروض</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isEdit ? 'تعديل العرض' : 'إضافة عرض جديد'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            المنتج <span className="text-red-500">*</span>
          </label>
          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all ${
              errors.productId ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
            disabled={isEdit}
          >
            <option value="">-- اختر المنتج --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.productId && <p className="mt-1 text-xs text-red-500">{errors.productId}</p>}
          {selectedProduct && (
            <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
              <img
                src={selectedProduct.imageUrl || '/placeholder-product.png'}
                alt={selectedProduct.name}
                className="w-8 h-8 rounded-lg object-cover border"
                onError={(e) => { e.target.src = '/placeholder-product.png'; }}
              />
              <div>
                <p className="text-sm font-medium text-gray-700">{selectedProduct.name}</p>
                <p className="text-[11px] text-gray-400">السعر: {selectedProduct.price} ج.م</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">نوع العرض</label>
          <div className="flex gap-3">
            <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-bold ${
              form.offerType === 'Discount'
                ? 'border-orange-400 bg-orange-50 text-orange-700'
                : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="offerType"
                value="Discount"
                checked={form.offerType === 'Discount'}
                onChange={handleChange}
                className="sr-only"
              />
              🔥 خصم
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-bold ${
              form.offerType === 'BuyOneGetOne'
                ? 'border-purple-400 bg-purple-50 text-purple-700'
                : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="offerType"
                value="BuyOneGetOne"
                checked={form.offerType === 'BuyOneGetOne'}
                onChange={handleChange}
                className="sr-only"
              />
              🎁 اشتري + هدية
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            عنوان العرض <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="مثال: عرض الصيف, خصم الموسم..."
            className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all ${
              errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">الوصف</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="وصف العرض (اختياري)"
            className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 hover:border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
          />
        </div>

        {form.offerType === 'Discount' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                نسبة الخصم %
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={form.discountPercentage}
                onChange={handleChange}
                min={1}
                max={99}
                placeholder="مثال: 30"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all ${
                  errors.discountPercentage ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              />
              {errors.discountPercentage && <p className="mt-1 text-xs text-red-500">{errors.discountPercentage}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                سعر العرض (اختياري)
              </label>
              <input
                type="number"
                name="offerPrice"
                value={form.offerPrice}
                onChange={handleChange}
                min={0}
                step="0.01"
                placeholder="يُحسب تلقائياً من نسبة الخصم"
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 hover:border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
              />
              {selectedProduct && form.discountPercentage && !form.offerPrice && (
                <p className="mt-1 text-xs text-gray-400">
                  السعر بعد الخصم: {selectedProduct.price - (selectedProduct.price * Number(form.discountPercentage) / 100)} ج.م
                </p>
              )}
            </div>
          </div>
        )}

        {form.offerType === 'BuyOneGetOne' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                كمية الشراء <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="buyQuantity"
                value={form.buyQuantity}
                onChange={handleChange}
                min={1}
                placeholder="مثال: 2"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all ${
                  errors.buyQuantity ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              />
              {errors.buyQuantity && <p className="mt-1 text-xs text-red-500">{errors.buyQuantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                الكمية المجانية <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="freeQuantity"
                value={form.freeQuantity}
                onChange={handleChange}
                min={1}
                placeholder="مثال: 1"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all ${
                  errors.freeQuantity ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              />
              {errors.freeQuantity && <p className="mt-1 text-xs text-red-500">{errors.freeQuantity}</p>}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              تاريخ البداية <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all ${
                errors.startDate ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            />
            {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              تاريخ النهاية <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all ${
                errors.endDate ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            />
            {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-sm font-bold transition-all shadow-sm"
          >
            <FiSave size={16} />
            {submitting ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إنشاء العرض'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/seller/offers')}
            className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-bold transition-all"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerOfferFormPage;
