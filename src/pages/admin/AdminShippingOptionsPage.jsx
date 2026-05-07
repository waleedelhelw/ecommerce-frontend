import { useState, useEffect } from 'react';
import { FiEye, FiSearch } from 'react-icons/fi';
import adminShippingService from '../../api/admin/adminShippingService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatPrice } from '../../utils/formatPrice';

const AdminShippingOptionsPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [sellerZones, setSellerZones] = useState([]);
  const [zonesLoading, setZonesLoading] = useState(false);

  // جلب قائمة البائعين (من الكود الموجود مسبقاً في adminOrderService)
  // لكن هنا نركز على الـ zones فقط

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      // ✅ نحتاج endpoint لجلب البائعين مع عدد مناطق الشحن
      // لكن للآن سنستخدم mock أو endpoint موجود
      // الكود أدناه يفترض أن عندنا طريقة للحصول على البائعين
      
      // بديلاً: يمكننا جعل الصفحة تطلب من المستخدم البحث عن بائع معين
      setSellers([]);
    } catch (err) {
      setError('فشل تحميل البائعين');
    } finally {
      setLoading(false);
    }
  };

  const handleViewZones = async (sellerId) => {
    try {
      setZonesLoading(true);
      setSelectedSellerId(sellerId);
      const zones = await adminShippingService.getSellerZones(sellerId);
      setSellerZones(Array.isArray(zones) ? zones : zones?.items || []);
    } catch (err) {
      console.error('فشل تحميل مناطق الشحن:', err);
      setSellerZones([]);
    } finally {
      setZonesLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedSellerId(null);
    setSellerZones([]);
  };

  const filteredSellers = sellers.filter((seller) =>
    seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ إذا كان عندنا بائع مختار، عرض تفاصيل مناطق الشحن
  if (selectedSellerId) {
    const selectedSeller = sellers.find((s) => s.id === selectedSellerId);

    return (
      <div>
        {/* Header مع زرار الرجوع */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleCloseDetails}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              🚚 مناطق الشحن — {selectedSeller?.name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {selectedSeller?.email}
            </p>
          </div>
        </div>

        {/* محتوى مناطق الشحن */}
        {zonesLoading ? (
          <LoadingSpinner />
        ) : sellerZones.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <p className="text-gray-400 mb-4">
              هذا البائع لم يضف أي مناطق شحن حتى الآن
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">
                      المحافظة
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">
                      المدينة
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">
                      تكلفة الشحن
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">
                      أيام التوصيل
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">
                      الحالة
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">
                      تاريخ الإضافة
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sellerZones.map((zone) => (
                    <tr key={zone.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {zone.governorate}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {zone.city}
                      </td>
                      <td className="px-4 py-3 font-medium text-blue-600">
                        {formatPrice(zone.shippingCost)}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {zone.estimatedDays > 0 ? `${zone.estimatedDays} أيام` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            zone.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {zone.isActive ? '✅ مفعلة' : '⭕ معطلة'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(zone.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* إحصائيات */}
            <div className="border-t bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-600">
                📊 إجمالي المناطق: <span className="font-bold text-gray-800">{sellerZones.length}</span>
                {' '} | 
                ✅ مفعل: <span className="font-bold text-green-600">
                  {sellerZones.filter(z => z.isActive).length}
                </span>
                {' '} | 
                ⭕ معطل: <span className="font-bold text-gray-600">
                  {sellerZones.filter(z => !z.isActive).length}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ✅ القائمة الرئيسية — البحث عن بائع
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🚚 مناطق الشحن</h1>
        <p className="text-gray-500 text-sm mt-1">
          عرض ومراقبة مناطق الشحن لكل بائع
        </p>
      </div>

      {/* شريط البحث */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute right-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن بائع باسمه أو بريده..."
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg
                       outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
      </div>

      {/* ملاحظة مهمة */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800">
          💡 <strong>ملاحظة:</strong> هنا يمكنك عرض مناطق الشحن لكل بائع. البائعون يقومون بإضافة ومتابعة مناطقهم من لوحة التحكم الخاصة بهم.
        </p>
      </div>

      {/* جدول البائعين */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchSellers} />
      ) : filteredSellers.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-400">
            {searchTerm ? 'لم يتم العثور على نتائج' : 'لا توجد بائعين'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    اسم البائع
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    البريد الإلكتروني
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    عدد المناطق
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    حالة البائع
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      🏪 {seller.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {seller.email}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {seller.zonesCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          seller.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : seller.status === 'Suspended'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {seller.status === 'Active' && '✅ مفعل'}
                        {seller.status === 'Suspended' && '🔴 معلق'}
                        {seller.status === 'Pending' && '⏳ في الانتظار'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleViewZones(seller.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600
                                   text-white rounded-lg hover:bg-blue-700 transition-colors
                                   text-sm font-medium"
                      >
                        <FiEye size={14} /> عرض المناطق
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* معلومات إضافية */}
      {!loading && !error && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-gray-500 text-sm">إجمالي البائعين</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {sellers.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-gray-500 text-sm">بائعين نشطين</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {sellers.filter(s => s.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white rounded-xl border p-4 text-center">
            <p className="text-gray-500 text-sm">إجمالي مناطق الشحن</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {sellers.reduce((sum, s) => sum + (s.zonesCount || 0), 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShippingOptionsPage;