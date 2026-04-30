import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import ShippingOptionSelector from '../../components/checkout/ShippingOptionSelector';
import PaymentMethodSelector from '../../components/checkout/PaymentMethodSelector';
import useCart from '../../hooks/useCart';
import orderService from '../../api/orderService';
import shippingService from '../../api/shippingService';
import settingsService from '../../api/settingsService';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // بيانات الشحن والدفع
  const [shippingOptions, setShippingOptions] = useState([]);
  const [codFee, setCodFee] = useState(0);
  const [selectedShippingCost, setSelectedShippingCost] = useState(0);

  const [formData, setFormData] = useState({
    shippingAddress: '',
    shippingCity: '',
    shippingCountry: 'مصر',
    paymentMethod: 'CashOnDelivery',
    orderNotes: '',
    shippingOptionId: null,
  });

  // ✅ جلب خيارات الشحن وإعدادات المنصة
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب خيارات الشحن
        const shippingData = await shippingService.getShippingOptions();
        const list = Array.isArray(shippingData) ? shippingData : shippingData?.items || [];
        setShippingOptions(list);

        // جلب رسوم COD
        try {
          const settings = await settingsService.getPaymentInfo();
          const codSetting = settings?.find?.(s => s.key === 'CODExtraFee');
          if (codSetting) setCodFee(parseFloat(codSetting.value) || 0);
        } catch {
          setCodFee(20); // القيمة الافتراضية
        }
      } catch (err) {
        console.error('فشل تحميل البيانات:', err);
      }
    };
    fetchData();
  }, []);

  // ✅ تحديث تكلفة الشحن عند تغيير الخيار
  const handleShippingChange = (optionId) => {
    setFormData((prev) => ({ ...prev, shippingOptionId: optionId }));
    const option = shippingOptions.find((o) => o.id === optionId);
    setSelectedShippingCost(option ? option.price : 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePaymentChange = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.shippingAddress.trim()) newErrors.shippingAddress = 'العنوان مطلوب';
    if (!formData.shippingCity.trim()) newErrors.shippingCity = 'المدينة مطلوبة';
    if (!formData.shippingOptionId) newErrors.shippingOption = 'اختر طريقة الشحن';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ حساب الإجمالي
  const currentCodFee = formData.paymentMethod === 'CashOnDelivery' ? codFee : 0;
  const grandTotal = cartTotal + selectedShippingCost + currentCodFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (cartItems.length === 0) {
      toast.error('السلة فارغة');
      return;
    }

    try {
      setLoading(true);
      const data = await orderService.createOrder(formData);
      await fetchCart();

      const orderId = data.id || data.orderId;

      // ✅ لو الدفع مش COD → وجّه لصفحة الدفع
      if (formData.paymentMethod !== 'CashOnDelivery') {
        toast.success('تم إنشاء الطلب! يرجى إتمام الدفع 💳');
        navigate(`/orders/${orderId}/payment`);
      } else {
        toast.success('تم إنشاء الطلب بنجاح! 🎉');
        navigate(`/orders/${orderId}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إنشاء الطلب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'الرئيسية', link: '/' },
          { label: 'السلة', link: '/cart' },
          { label: 'إتمام الطلب' },
        ]}
      />

      <h1 className="text-2xl font-bold mb-6">💳 إتمام الطلب</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* الفورم */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 📍 عنوان الشحن */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-bold mb-4">📍 عنوان الشحن</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان *
                  </label>
                  <input
                    type="text"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    placeholder="الشارع، رقم العمارة، الشقة"
                    className={`input-field ${errors.shippingAddress ? 'input-error' : ''}`}
                  />
                  {errors.shippingAddress && (
                    <p className="mt-1 text-sm text-red-500">{errors.shippingAddress}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المدينة *
                    </label>
                    <input
                      type="text"
                      name="shippingCity"
                      value={formData.shippingCity}
                      onChange={handleChange}
                      placeholder="القاهرة"
                      className={`input-field ${errors.shippingCity ? 'input-error' : ''}`}
                    />
                    {errors.shippingCity && (
                      <p className="mt-1 text-sm text-red-500">{errors.shippingCity}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الدولة</label>
                    <input
                      type="text"
                      name="shippingCountry"
                      value={formData.shippingCountry}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 🚚 طريقة الشحن */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-bold mb-4">🚚 طريقة الشحن</h2>
              {errors.shippingOption && (
                <p className="mb-3 text-sm text-red-500">{errors.shippingOption}</p>
              )}
              <ShippingOptionSelector
                selected={formData.shippingOptionId}
                onChange={handleShippingChange}
              />
            </div>

            {/* 💳 طريقة الدفع */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-bold mb-4">💳 طريقة الدفع</h2>
              <PaymentMethodSelector
                selected={formData.paymentMethod}
                onChange={handlePaymentChange}
                codFee={codFee}
              />
            </div>

            {/* 📝 ملاحظات */}
            <div className="bg-white rounded-xl border p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📝 ملاحظات (اختياري)
              </label>
              <textarea
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleChange}
                placeholder="أي ملاحظات إضافية..."
                rows={3}
                className="input-field"
              />
            </div>

            {/* زرار التأكيد */}
            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="btn-primary w-full text-base py-3"
            >
              {loading ? (
                'جاري إنشاء الطلب...'
              ) : (
                <>
                  ✅ تأكيد الطلب - {formatPrice(grandTotal)}
                </>
              )}
            </button>
          </form>
        </div>

        {/* ✅ ملخص الطلب - محدّث */}
        <div>
          <div className="bg-white rounded-xl border p-6 sticky top-20">
            <h3 className="text-lg font-bold mb-4">ملخص الطلب</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  المنتجات ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                </span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">الشحن</span>
                <span className={selectedShippingCost === 0 ? 'text-green-600' : ''}>
                  {selectedShippingCost === 0 ? 'مجاني' : formatPrice(selectedShippingCost)}
                </span>
              </div>

              {currentCodFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">رسوم الدفع عند الاستلام</span>
                  <span className="text-orange-600">{formatPrice(currentCodFee)}</span>
                </div>
              )}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-bold text-lg">
              <span>الإجمالي</span>
              <span className="text-blue-600">{formatPrice(grandTotal)}</span>
            </div>

            {formData.paymentMethod !== 'CashOnDelivery' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                💡 بعد تأكيد الطلب هتنتقل لصفحة الدفع لرفع إيصال التحويل
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;