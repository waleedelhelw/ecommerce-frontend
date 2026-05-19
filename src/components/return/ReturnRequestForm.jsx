import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import Input from '../common/Input';
import ValidationSummary from '../common/ValidationSummary';
import ReturnImagesUploader from './ReturnImagesUploader';
import { returnReasonMap } from '../../utils/returnStatusMap';
import { formatPrice } from '../../utils/formatPrice';
import { showValidationFeedback } from '../../utils/formValidation';
import returnService from '../../api/returnService';

const ReturnRequestForm = ({ order }) => {
  const navigate = useNavigate();

  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState({}); // { orderItemId: quantity }
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!order) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">لا توجد بيانات للطلب</p>
      </div>
    );
  }

  // تحديد منتج
  const toggleItem = (item) => {
    setSelectedItems((prev) => {
      const newState = { ...prev };
      if (newState[item.id]) {
        delete newState[item.id];
      } else {
        newState[item.id] = 1; // default quantity
      }
      return newState;
    });
    if (errors.items) setErrors((prev) => ({ ...prev, items: '' }));
  };

  // تغيير الكمية
  const updateQuantity = (itemId, value, maxQty) => {
    const qty = Math.max(1, Math.min(parseInt(value) || 1, maxQty));
    setSelectedItems((prev) => ({ ...prev, [itemId]: qty }));
  };

  // حساب الإجمالى
  const calculateTotal = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, qty]) => {
      const item = order.items?.find((i) => i.id === parseInt(itemId));
      return total + (item ? item.unitPrice * qty : 0);
    }, 0);
  };

  // التحقق من الـ Form
  const validate = () => {
    const newErrors = {};

    if (!reason) {
      newErrors.reason = 'يجب اختيار سبب الإرجاع';
    }

    if (!description || description.length < 10) {
      newErrors.description = 'الوصف مطلوب ولا يقل عن 10 أحرف';
    }

    if (Object.keys(selectedItems).length === 0) {
      newErrors.items = 'يجب اختيار منتج واحد على الأقل';
    }

    if (images.length === 0) {
      newErrors.images = 'يجب رفع صورة واحدة على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error(showValidationFeedback('كمّل بيانات طلب الإرجاع المطلوبة'));
      return;
    }

    try {
      setSubmitting(true);

      const dto = {
        orderId: order.id,
        reason,
        description,
        items: Object.entries(selectedItems).map(([orderItemId, quantity]) => ({
          orderItemId: parseInt(orderItemId),
          quantity,
        })),
        images,
      };

      const result = await returnService.createReturnRequest(dto);
      toast.success('تم إنشاء طلب الإرجاع بنجاح');
      navigate(`/returns/${result.id}`);
    } catch (err) {
      const message =
        err.response?.data?.message || 'فشل فى إنشاء طلب الإرجاع';
      toast.error(message);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <ValidationSummary errors={errors} />

      {/* Order Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <FiInfo className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-blue-900">
          <p className="font-bold mb-1">طلب الإرجاع للأوردر #{order.id}</p>
          <p>اختر المنتجات اللى عايز ترجعها وحدد الكمية لكل منتج</p>
        </div>
      </div>

      {/* اختيار المنتجات */}
      <div className="bg-white border rounded-xl p-5">
        <h3 className="font-bold text-lg mb-4">المنتجات المراد إرجاعها *</h3>

        <div className="space-y-3">
          {order.items?.map((item) => {
            const isSelected = !!selectedItems[item.id];
            const quantity = selectedItems[item.id] || 1;

            return (
              <div
                key={item.id}
                className={`border-2 rounded-lg p-4 transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleItem(item)}
                    className="w-5 h-5 cursor-pointer"
                  />

                  {item.productImageUrl && (
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {item.productName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      الكمية المتاحة: {item.quantity} | السعر:{' '}
                      {formatPrice(item.unitPrice)}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">الكمية:</label>
                      <input
                        type="number"
                        min="1"
                        max={item.quantity}
                        value={quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, e.target.value, item.quantity)
                        }
                        className="w-20 px-3 py-1.5 border rounded-lg text-center"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {errors.items && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <FiAlertCircle size={14} /> {errors.items}
          </p>
        )}

        {/* الإجمالى */}
        {Object.keys(selectedItems).length > 0 && (
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <span className="text-gray-600">إجمالى المبلغ المسترد:</span>
            <span className="text-2xl font-bold text-emerald-600">
              {formatPrice(calculateTotal())}
            </span>
          </div>
        )}
      </div>

      {/* سبب الإرجاع */}
      <div className="bg-white border rounded-xl p-5">
        <h3 className="font-bold text-lg mb-4">سبب الإرجاع *</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(returnReasonMap).map(([key, info]) => (
            <label
              key={key}
              className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                reason === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="reason"
                  value={key}
                  checked={reason === key}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (errors.reason) setErrors((prev) => ({ ...prev, reason: '' }));
                  }}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-1.5">
                    <span>{info.icon}</span>
                    <span>{info.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {info.description}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>

        {errors.reason && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <FiAlertCircle size={14} /> {errors.reason}
          </p>
        )}
      </div>

      {/* الوصف */}
      <div className="bg-white border rounded-xl p-5">
        <Input
          label="وصف تفصيلى للمشكلة *"
          type="textarea"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
          }}
          placeholder="اشرح تفاصيل المشكلة بشكل واضح (مثلاً: المنتج وصل بتاريخ كذا، اكتشفت إن فيه عيب فى ...)"
          error={errors.description}
        />
        <p className="text-xs text-gray-500 -mt-2">
          {description.length} حرف (الحد الأدنى: 10 أحرف)
        </p>
      </div>

      {/* الصور */}
      <div className="bg-white border rounded-xl p-5">
        <ReturnImagesUploader
          images={images}
          onChange={(nextImages) => {
            setImages(nextImages);
            if (errors.images) setErrors((prev) => ({ ...prev, images: '' }));
          }}
          error={errors.images}
        />
      </div>

      {/* تنبيه */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
        <FiAlertCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-orange-900">
          <p className="font-bold mb-1">ملاحظات مهمة:</p>
          <ul className="list-disc list-inside space-y-1 text-orange-800">
            <li>طلب الإرجاع هيتم مراجعته من البائع خلال 24-48 ساعة</li>
            <li>هتوصلك إيميل بقرار البائع (موافقة/رفض)</li>
            <li>لو الموافقة، هتشحن المنتج للبائع وهيتم إرجاع المبلغ بعد الفحص</li>
            <li>الفلوس بترجع بنفس طريقة الدفع الأصلية</li>
          </ul>
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-secondary"
          disabled={submitting}
        >
          إلغاء
        </button>
        <Button type="submit" variant="primary" loading={submitting}>
          إرسال طلب الإرجاع
        </Button>
      </div>
    </form>
  );
};

export default ReturnRequestForm;
