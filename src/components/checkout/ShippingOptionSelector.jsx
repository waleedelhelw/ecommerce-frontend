import { useState, useEffect } from 'react';
import { formatPrice } from '../../utils/formatPrice';
import shippingService from '../../api/shippingService';

const ShippingOptionSelector = ({ selected, onChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await shippingService.getShippingOptions();
        const list = Array.isArray(data) ? data : data?.items || [];
        setOptions(list);
        // لو مفيش اختيار → اختار أول واحد
        if (!selected && list.length > 0) {
          onChange(list[0].id);
        }
      } catch (err) {
        console.error('فشل تحميل خيارات الشحن:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (options.length === 0) {
    return <p className="text-gray-500 text-sm">لا توجد خيارات شحن متاحة</p>;
  }

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.id}
          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
            selected === option.id
              ? 'border-blue-500 bg-blue-50 shadow-sm'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <input
            type="radio"
            name="shippingOption"
            value={option.id}
            checked={selected === option.id}
            onChange={() => onChange(option.id)}
            className="w-4 h-4 text-blue-600"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{option.name}</span>
              {option.price === 0 && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  مجاني
                </span>
              )}
            </div>
            {option.description && (
              <p className="text-sm text-gray-500 mt-1">{option.description}</p>
            )}
            {option.estimatedDays > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                ⏰ التوصيل خلال {option.estimatedDays} أيام عمل
              </p>
            )}
          </div>
          <div className="text-left">
            <span className={`font-bold text-lg ${option.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
              {option.price === 0 ? 'مجاني' : formatPrice(option.price)}
            </span>
          </div>
        </label>
      ))}
    </div>
  );
};

export default ShippingOptionSelector;