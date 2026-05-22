import { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2, FiCopy, FiCheck, FiChevronDown } from 'react-icons/fi';
import { createGuestOrder } from '../../api/seller/sellerOrderService';
import { getMyProducts } from '../../api/seller/sellerProductService';
import { getPaymentMethods } from '../../api/seller/sellerPaymentMethodService';
import { PAYMENT_METHODS, PAYMENT_TARGET_LABELS, SITE_URL } from '../../utils/constants';
import toast from 'react-hot-toast';

const PLATFORM_METHODS = PAYMENT_METHODS.filter((m) => m.value !== 'CashOnDelivery');

const CreateGuestOrderModal = ({ onClose, onSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const [paymentType, setPaymentType] = useState('cod'); // 'cod' | 'electronic'
  const [paymentTarget, setPaymentTarget] = useState('Platform'); // 'Platform' | 'Seller'
  const [platformMethod, setPlatformMethod] = useState('VodafoneCash');
  const [sellerPaymentMethods, setSellerPaymentMethods] = useState([]);
  const [sellerPaymentMethodId, setSellerPaymentMethodId] = useState('');

  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [products, setProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [productsData, pmData] = await Promise.all([
          getMyProducts({ pageSize: 200 }),
          getPaymentMethods(),
        ]);
        setProducts(productsData?.items || productsData || []);
        setSellerPaymentMethods(pmData || []);
      } catch {
        toast.error('فشل في تحميل البيانات');
      }
    };
    init();
  }, []);

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'quantity' ? Math.max(1, parseInt(value) || 1) : value;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error('يرجى إدخال اسم العميل');
      return;
    }
    if (!customerPhone.trim()) {
      toast.error('يرجى إدخال رقم الهاتف');
      return;
    }
    const validItems = items.filter((item) => item.productId);
    if (validItems.length === 0) {
      toast.error('يرجى إضافة منتج واحد على الأقل');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim() || undefined,
        items: validItems.map((item) => ({
          productId: parseInt(item.productId),
          quantity: item.quantity,
        })),
      };

      if (paymentType === 'cod') {
        payload.paymentMethod = 'CashOnDelivery';
      } else if (paymentTarget === 'Platform') {
        payload.paymentMethod = platformMethod;
        payload.paymentTarget = 'Platform';
      } else {
        const selected = sellerPaymentMethods.find(
          (pm) => pm.id === parseInt(sellerPaymentMethodId)
        );
        payload.paymentMethod = selected?.paymentMethod;
        payload.paymentTarget = 'Seller';
        payload.sellerPaymentMethodId = parseInt(sellerPaymentMethodId);
      }

      const data = await createGuestOrder(payload);
      setResult(data);
      toast.success('تم إنشاء الطلب الخارجي بنجاح');
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل في إنشاء الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('تم نسخ الرابط');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('فشل النسخ');
    }
  };

  const handleClose = () => {
    if (result) {
      onSuccess?.();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-800">
            {result ? 'تم إنشاء الطلب' : 'إنشاء طلب خارجي'}
          </h3>
          <button onClick={handleClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <FiX size={20} />
          </button>
        </div>

        {result ? (
          <div className="p-6 text-center space-y-4">
            <div className="text-5xl">✅</div>
            <p className="text-lg font-bold text-green-600">تم إنشاء الطلب الخارجي بنجاح</p>
            <p className="text-gray-500">رقم الطلب: #{result.orderId}</p>

            <div className="bg-gray-50 rounded-xl p-4 border">
              <p className="text-sm text-gray-500 mb-2">رابط التتبع للعميل:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={(() => { const u = result.trackingUrl || result.guestTrackingUrl; return u?.startsWith('http') ? u : `${SITE_URL}${u?.startsWith('/') ? '' : '/'}${u || `track/${result.trackingToken}`}`; })()}
                  className="flex-1 px-3 py-2 bg-white border rounded-lg text-sm text-gray-700 ltr"
                  dir="ltr"
                />
                <button
                  onClick={() => {
                    const u = result.trackingUrl || result.guestTrackingUrl;
                    const url = u?.startsWith('http') ? u : `${SITE_URL}${u?.startsWith('/') ? '' : '/'}${u || `track/${result.trackingToken}`}`;
                    copyToClipboard(url);
                  }}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  const u = result.trackingUrl || result.guestTrackingUrl;
                  const url = u?.startsWith('http') ? u : `${SITE_URL}${u?.startsWith('/') ? '' : '/'}${u || `track/${result.trackingToken}`}`;
                  window.open(result.whatsAppShareUrl || `https://wa.me/${(result.customerPhoneNumber || '').replace(/[^0-9]/g, '').replace(/^0/, '20') || ''}?text=${encodeURIComponent(url)}`, '_blank');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                مشاركة عبر واتساب
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم العميل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="أحمد علي"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="01001234567"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العنوان <span className="text-gray-400">(اختياري)</span>
              </label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="القاهرة، مصر"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                طريقة الدفع
              </label>

              {/* Level 1: COD vs Electronic */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setPaymentType('cod')}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    paymentType === 'cod'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  💵 الدفع عند الاستلام
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType('electronic')}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    paymentType === 'electronic'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  💳 دفع إلكتروني
                </button>
              </div>

              {paymentType === 'electronic' && (
                <>
                  {/* Level 2: Platform vs Seller */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setPaymentTarget('Platform')}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                        paymentTarget === 'Platform'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      🏛️ {PAYMENT_TARGET_LABELS.Platform.label}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentTarget('Seller')}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                        paymentTarget === 'Seller'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      🏪 {PAYMENT_TARGET_LABELS.Seller.label}
                    </button>
                  </div>

                  {/* Level 3: specific method */}
                  {paymentTarget === 'Platform' ? (
                    <select
                      value={platformMethod}
                      onChange={(e) => setPlatformMethod(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {PLATFORM_METHODS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={sellerPaymentMethodId}
                      onChange={(e) => setSellerPaymentMethodId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">-- اختر وسيلة دفع --</option>
                      {sellerPaymentMethods.map((pm) => {
                        const methodInfo = PAYMENT_METHODS.find(
                          (m) => m.value === pm.paymentMethod
                        );
                        const display = pm.bankName
                          ? `${pm.bankName} - ${pm.accountIdentifier}`
                          : pm.accountIdentifier;
                        return (
                          <option key={pm.id} value={pm.id}>
                            {methodInfo?.icon} {methodInfo?.label || pm.paymentMethod} — {display}
                          </option>
                        );
                      })}
                      {sellerPaymentMethods.length === 0 && (
                        <option value="" disabled>
                          لا توجد وسائل دفع — أضفها في إعدادات الدفع
                        </option>
                      )}
                    </select>
                  )}
                </>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">المنتجات</label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  <FiPlus size={14} /> إضافة منتج
                </button>
              </div>

              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">-- اختر منتج --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      className="w-20 px-3 py-2 border rounded-lg text-sm text-center focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      disabled={items.length === 1}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
              >
                {submitting ? 'جارٍ الإنشاء...' : 'إنشاء الطلب'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateGuestOrderModal;
