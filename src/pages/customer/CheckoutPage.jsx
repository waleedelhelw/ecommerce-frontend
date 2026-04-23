import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import CartSummary from '../../components/cart/CartSummary';
import useCart from '../../hooks/useCart';
import orderService from '../../api/orderService';
import { PAYMENT_METHODS } from '../../utils/constants';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    shippingAddress: '',
    shippingCity: '',           // ✅ كان city
    shippingCountry: 'مصر',    // ✅ كان country
    paymentMethod: 'CashOnDelivery',
    orderNotes: '',             // ✅ كان notes
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.shippingAddress.trim()) newErrors.shippingAddress = 'العنوان مطلوب';
    if (!formData.shippingCity.trim()) newErrors.shippingCity = 'المدينة مطلوبة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (cartItems.length === 0) { toast.error('السلة فارغة'); return; }
    try {
      setLoading(true);
      const data = await orderService.createOrder(formData);
      toast.success('تم إنشاء الطلب بنجاح! 🎉');
      await fetchCart();
      navigate(`/orders/${data.id || data.orderId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إنشاء الطلب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'الرئيسية', link: '/' }, { label: 'السلة', link: '/cart' }, { label: 'إتمام الطلب' }]} />
      <h1 className="text-2xl font-bold mb-6">💳 إتمام الطلب</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-bold mb-4">📍 عنوان الشحن</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">العنوان *</label>
              <input type="text" name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} placeholder="الشارع، رقم العمارة، الشقة" className={`input-field ${errors.shippingAddress ? 'input-error' : ''}`} />
              {errors.shippingAddress && <p className="mt-1 text-sm text-red-500">{errors.shippingAddress}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المدينة *</label>
                {/* ✅ غيّر name من city لـ shippingCity */}
                <input type="text" name="shippingCity" value={formData.shippingCity} onChange={handleChange} placeholder="القاهرة" className={`input-field ${errors.shippingCity ? 'input-error' : ''}`} />
                {errors.shippingCity && <p className="mt-1 text-sm text-red-500">{errors.shippingCity}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الدولة</label>
                {/* ✅ غيّر name من country لـ shippingCountry */}
                <input type="text" name="shippingCountry" value={formData.shippingCountry} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <h2 className="text-lg font-bold mb-4 mt-6">💳 طريقة الدفع</h2>
            <div className="space-y-3 mb-6">
              {PAYMENT_METHODS.map((method) => (
                <label key={method.value} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === method.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="paymentMethod" value={method.value} checked={formData.paymentMethod === method.value} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{method.label}</span>
                </label>
              ))}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">📝 ملاحظات (اختياري)</label>
              {/* ✅ غيّر name من notes لـ orderNotes */}
              <textarea name="orderNotes" value={formData.orderNotes} onChange={handleChange} placeholder="أي ملاحظات إضافية..." rows={3} className="input-field" />
            </div>
            <button type="submit" disabled={loading || cartItems.length === 0} className="btn-primary w-full text-base py-3">
              {loading ? 'جاري إنشاء الطلب...' : '✅ تأكيد الطلب'}
            </button>
          </form>
        </div>
        <div><CartSummary showCheckout={false} /></div>
      </div>
    </div>
  );
};

export default CheckoutPage;