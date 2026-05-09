import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import ShippingOptionSelector from '../../components/checkout/ShippingOptionSelector';
import PaymentMethodSelector from '../../components/checkout/PaymentMethodSelector';
import InstallmentPlanSelector from '../../components/checkout/InstallmentPlanSelector';
import ValidationSummary from '../../components/common/ValidationSummary';
import useCart from '../../hooks/useCart';
import orderService from '../../api/orderService';
import shippingService from '../../api/shippingService';
import settingsService from '../../api/settingsService';
import { formatPrice } from '../../utils/formatPrice';
import { showValidationFeedback } from '../../utils/formValidation';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, fetchCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [zonesLoading, setZonesLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // ✅ بيانات مناطق الشحن الجديدة
  const [zonesData, setZonesData] = useState(null);
  const [codFee, setCodFee] = useState(0);

  // التقسيط
  const [useInstallment, setUseInstallment] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  // ✅ formData الجديد — بدون shippingOptionId و shippingCity
  const [formData, setFormData] = useState({
    shippingAddress: '',
    governorate: '',
    city: '',
    shippingCountry: 'مصر',
    customerPhoneNumber: '',
    paymentMethod: 'CashOnDelivery',
    orderNotes: '',
  });

  // ✅ جلب مناطق الشحن وإعدادات المنصة
  useEffect(() => {
    const fetchData = async () => {
      // جلب مناطق الشحن
      try {
        setZonesLoading(true);
        const zonesResult = await shippingService.getCartAvailableZones();
        setZonesData(zonesResult);
      } catch (err) {
        console.error('فشل تحميل مناطق الشحن:', err);
        toast.error('فشل تحميل مناطق الشحن، حاول تاني');
      } finally {
        setZonesLoading(false);
      }

      // جلب رسوم COD
      try {
        const settings = await settingsService.getPaymentInfo();
        const codSetting = settings?.find?.((s) => s.key === 'CODExtraFee');
        if (codSetting) setCodFee(parseFloat(codSetting.value) || 0);
      } catch {
        setCodFee(20);
      }
    };

    fetchData();
  }, []);

  // ✅ استخراج بيانات المدينة المختارة
  const selectedCityData = useMemo(() => {
    if (!formData.governorate || !formData.city || !zonesData) return null;
    const gov = zonesData.availableGovernorates?.find(
      (g) => g.governorate === formData.governorate
    );
    return gov?.cities?.find((c) => c.city === formData.city) || null;
  }, [formData.governorate, formData.city, zonesData]);

  const selectedShippingCost = selectedCityData?.totalShippingCost || 0;
  const currentCodFee = formData.paymentMethod === 'CashOnDelivery' ? codFee : 0;
  const grandTotal = cartTotal + selectedShippingCost + currentCodFee;

  // ✅ COD = مفيش تقسيط
  //const isInstallmentAvailable = formData.paymentMethod !== 'CashOnDelivery';
  const isInstallmentAvailable = false;


  // ✅ هل في بائعين مش بيشحنوا؟
  const hasUnshippableSellers = zonesData?.hasUnshippableSellers || false;

  // ── Handlers ──

  const handleGovernorateChange = (governorate) => {
    setFormData((prev) => ({ ...prev, governorate, city: '' }));
    if (errors.governorate) setErrors((prev) => ({ ...prev, governorate: '' }));
    if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
  };

  const handleCityChange = (city) => {
    setFormData((prev) => ({ ...prev, city }));
    if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePaymentChange = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
    // ✅ COD → إلغاء التقسيط تلقائياً
    if (method === 'CashOnDelivery') {
      setUseInstallment(false);
      setSelectedPlanId(null);
    }
  };

  const handleInstallmentToggle = (enabled) => {
    setUseInstallment(enabled);
    if (!enabled) setSelectedPlanId(null);
  };

  const handleInstallmentPlanChange = (planId) => {
    setSelectedPlanId(planId);
    if (errors.installmentPlan) setErrors((prev) => ({ ...prev, installmentPlan: '' }));
  };

  // ── Validation ──

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    return phoneRegex.test(phone.trim());
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.shippingAddress.trim())
      newErrors.shippingAddress = 'العنوان مطلوب';

    if (!formData.governorate)
      newErrors.governorate = 'المحافظة مطلوبة';

    if (!formData.city)
      newErrors.city = 'المدينة مطلوبة';

    if (!formData.customerPhoneNumber.trim()) {
      newErrors.customerPhoneNumber = 'رقم التواصل مطلوب';
    } else if (!validatePhoneNumber(formData.customerPhoneNumber)) {
      newErrors.customerPhoneNumber = 'رقم التواصل غير صحيح';
    }

    if (useInstallment && !selectedPlanId)
      newErrors.installmentPlan = 'اختر خطة التقسيط';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ──

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error(showValidationFeedback('كمّل بيانات الشحن المطلوبة الأول'));
      return;
    }

    if (cartItems.length === 0) {
      toast.error('السلة فارغة');
      return;
    }

    if (hasUnshippableSellers) {
      toast.error('بعض المتاجر لا تشحن لأي منطقة، لا يمكن إتمام الطلب');
      return;
    }

    try {
      setLoading(true);

      // ✅ Payload الجديد — بدون shippingOptionId و shippingCity
      const orderPayload = {
        shippingAddress: formData.shippingAddress.trim(),
        governorate: formData.governorate,
        city: formData.city,
        shippingCountry: formData.shippingCountry.trim(),
        customerPhoneNumber: formData.customerPhoneNumber.trim(),
        paymentMethod: formData.paymentMethod,
        orderNotes: formData.orderNotes?.trim() || null,
        installmentPlanId: useInstallment ? selectedPlanId : null,
      };

      const data = await orderService.createOrder(orderPayload);
      await fetchCart();

      const orderId = data.id || data.orderId;

      if (useInstallment && selectedPlanId) {
        toast.success('تم إنشاء الطلب بالتقسيط! ادفع الدفعة الأولى لتأكيد الطلب 📋');
        navigate(`/orders/${orderId}/installments`, { replace: true });
      } else if (formData.paymentMethod !== 'CashOnDelivery') {
        toast.success('تم إنشاء الطلب! يرجى إتمام الدفع 💳');
        navigate(`/orders/${orderId}/payment`, { replace: true });
      } else {
        toast.success('تم إنشاء الطلب بنجاح! 🎉');
        navigate(`/orders/${orderId}`, { replace: true });
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

      {/* ✅ تحذير البائعين اللي مش بيشحنوا */}
      {!zonesLoading && hasUnshippableSellers && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">⚠️</span>
            <div>
              <p className="font-bold text-red-800">لا يمكن إتمام الطلب!</p>
              <p className="text-sm text-red-700 mt-1">
                المتاجر التالية لا تشحن لأي منطقة:{' '}
                <strong>{zonesData?.unshippableSellerNames?.join('، ')}</strong>
              </p>
              <p className="text-xs text-red-600 mt-1">
                يرجى إزالة منتجاتهم من السلة للمتابعة.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── الفورم ── */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <ValidationSummary errors={errors} className="mb-2" />

            {/* 📍 عنوان الشحن */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-bold mb-4">📍 عنوان الشحن</h2>

              <div className="space-y-4">

                {/* العنوان التفصيلي */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان التفصيلي <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    placeholder="الشارع، رقم العمارة، الشقة"
                    aria-invalid={Boolean(errors.shippingAddress)}
                    className={`input-field ${errors.shippingAddress ? 'input-error' : ''}`}
                  />
                  {errors.shippingAddress && (
                    <p className="mt-1 text-sm text-red-500">{errors.shippingAddress}</p>
                  )}
                </div>

                {/* ✅ اختيار المحافظة والمدينة */}
                {zonesLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-10 bg-gray-100 rounded-xl" />
                    <div className="h-10 bg-gray-100 rounded-xl" />
                  </div>
                ) : (
                  <div>
                    {errors.governorate && (
                      <p className="mb-1 text-sm text-red-500">{errors.governorate}</p>
                    )}
                    {errors.city && (
                      <p className="mb-1 text-sm text-red-500">{errors.city}</p>
                    )}
                    <ShippingOptionSelector
                      zonesData={zonesData}
                      selectedGovernorate={formData.governorate}
                      selectedCity={formData.city}
                      onGovernorateChange={handleGovernorateChange}
                      onCityChange={handleCityChange}
                    />
                  </div>
                )}

                {/* الدولة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الدولة
                  </label>
                  <input
                    type="text"
                    name="shippingCountry"
                    value={formData.shippingCountry}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                {/* رقم التواصل */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم التواصل مع مندوب الشحن <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="customerPhoneNumber"
                    value={formData.customerPhoneNumber}
                    onChange={handleChange}
                    placeholder="مثال: 01012345678"
                    dir="ltr"
                    inputMode="tel"
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.customerPhoneNumber)}
                    className={`input-field text-left ${
                      errors.customerPhoneNumber ? 'input-error' : ''
                    }`}
                  />
                  {errors.customerPhoneNumber ? (
                    <p className="mt-1 text-sm text-red-500">{errors.customerPhoneNumber}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      الرقم ده هيظهر للبائع عشان يقدر يرسله لشركة الشحن أو يتواصل معاك المندوب.
                    </p>
                  )}
                </div>
              </div>
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

            {/* ✅ التقسيط — يظهر فقط لو مش COD */}
            {isInstallmentAvailable && (
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">📋 التقسيط</h2>
                  <button
                    type="button"
                    onClick={() => handleInstallmentToggle(!useInstallment)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      useInstallment ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        useInstallment ? 'left-6' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {!useInstallment ? (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-gray-500 text-sm">
                      💡 فعّل التقسيط لتقسيم المبلغ على دفعات
                    </p>
                  </div>
                ) : (
                  <>
                    {errors.installmentPlan && (
                      <p className="mb-3 text-sm text-red-500">{errors.installmentPlan}</p>
                    )}
                    <InstallmentPlanSelector
                      selected={selectedPlanId}
                      onChange={handleInstallmentPlanChange}
                      orderTotal={grandTotal}
                    />
                  </>
                )}
              </div>
            )}

            {/* 📝 ملاحظات */}
            <div className="bg-white rounded-xl border p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📝 ملاحظات (اختياري)
              </label>
              <p className="text-xs text-gray-500 mb-2 leading-5">
                لو المنتج له لون أو مقاس أو أي تفاصيل اختيار، اكتب هنا اللون/المقاس المطلوب أو أي ملاحظة تساعد البائع يجهز طلبك صح.
              </p>
              <textarea
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleChange}
                placeholder="مثال: عايز اللون الأسود مقاس L، أو التغليف يكون هدية..."
                rows={4}
                className="input-field"
              />
            </div>

            {/* زرار التأكيد */}
            <button
              type="submit"
              disabled={loading || cartItems.length === 0 || hasUnshippableSellers}
              className="btn-primary w-full text-base py-3"
            >
              {loading ? (
                'جاري إنشاء الطلب...'
              ) : (
                <>✅ تأكيد الطلب — {formatPrice(grandTotal)}</>
              )}
            </button>
          </form>
        </div>

        {/* ── ملخص الطلب ── */}
        <div>
          <div className="bg-white rounded-xl border p-6 sticky top-20">
            <h3 className="text-lg font-bold mb-4">ملخص الطلب</h3>

            <div className="space-y-3 mb-4">

              {/* المنتجات */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  المنتجات ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                </span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              {/* الشحن الكلي */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">الشحن</span>
                <span className={!formData.city ? 'text-gray-400' : 'text-gray-800'}>
                  {formData.city ? formatPrice(selectedShippingCost) : '—'}
                </span>
              </div>

              {/* ✅ تفاصيل الشحن per seller */}
              {selectedCityData?.sellerShippingDetails?.map((seller) => (
                <div
                  key={seller.sellerId}
                  className="flex justify-between text-xs text-gray-400 pr-3"
                >
                  <span>← {seller.storeName}</span>
                  <span>{formatPrice(seller.shippingCost)}</span>
                </div>
              ))}

              {/* رسوم COD */}
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

            {/* ملاحظة التقسيط */}
            {useInstallment && selectedPlanId && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-bold text-blue-800 mb-1">📋 طلب بالتقسيط</p>
                <p className="text-xs text-blue-700">
                  سيتم تقسيم المبلغ حسب الخطة المختارة. لازم تدفع الدفعة الأولى عشان الطلب يتأكد.
                </p>
              </div>
            )}

            {formData.paymentMethod !== 'CashOnDelivery' && !useInstallment && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                💡 بعد تأكيد الطلب هتنتقل لصفحة الدفع لرفع إيصال التحويل
              </div>
            )}

            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              📞 تأكد من إدخال رقم تواصل صحيح عشان مندوب الشحن يقدر يتواصل معاك.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
