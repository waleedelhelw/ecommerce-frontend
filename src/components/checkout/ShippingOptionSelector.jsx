import { useMemo } from 'react';
import { formatPrice } from '../../utils/formatPrice';

const ShippingOptionSelector = ({
  zonesData,
  selectedGovernorate,
  selectedCity,
  onGovernorateChange,
  onCityChange,
}) => {
  // ✅ استخراج المحافظات المتاحة
  const governorates = useMemo(() => {
    return zonesData?.availableGovernorates || [];
  }, [zonesData]);

  // ✅ استخراج المدن للمحافظة المختارة
  const cities = useMemo(() => {
    if (!selectedGovernorate) return [];
    const gov = governorates.find((g) => g.governorate === selectedGovernorate);
    return gov?.cities || [];
  }, [selectedGovernorate, governorates]);

  // ✅ بيانات المدينة المختارة
  const selectedCityData = useMemo(() => {
    if (!selectedCity) return null;
    return cities.find((c) => c.city === selectedCity) || null;
  }, [selectedCity, cities]);

  return (
    <div className="space-y-4">

      {/* اختيار المحافظة */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          المحافظة <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedGovernorate || ''}
          onChange={(e) => {
            onGovernorateChange(e.target.value);
            onCityChange('');
          }}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm
                     outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                     bg-white transition-all"
        >
          <option value="">-- اختر المحافظة --</option>
          {governorates.map((gov) => (
            <option key={gov.governorate} value={gov.governorate}>
              {gov.governorate}
            </option>
          ))}
        </select>
      </div>

      {/* اختيار المدينة */}
      {selectedGovernorate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المدينة / المركز <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedCity || ''}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm
                       outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                       bg-white transition-all"
          >
            <option value="">-- اختر المدينة --</option>
            {cities.map((c) => (
              <option key={c.city} value={c.city}>
                {c.city} — {formatPrice(c.totalShippingCost)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ✅ تفاصيل تكلفة الشحن per seller */}
      {selectedCityData && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-blue-800 mb-2">🚚 تفاصيل تكلفة الشحن:</p>

          {selectedCityData.sellerShippingDetails?.map((seller) => (
            <div key={seller.sellerId} className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                🏪 {seller.storeName}
                {seller.estimatedDays > 0 && (
                  <span className="text-xs text-gray-400 mr-1">
                    ({seller.estimatedDays} أيام)
                  </span>
                )}
              </span>
              <span className="font-medium text-blue-700">
                {formatPrice(seller.shippingCost)}
              </span>
            </div>
          ))}

          <div className="border-t border-blue-200 pt-2 flex justify-between items-center">
            <span className="font-bold text-blue-800 text-sm">إجمالي الشحن</span>
            <span className="font-bold text-blue-700">
              {formatPrice(selectedCityData.totalShippingCost)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingOptionSelector;