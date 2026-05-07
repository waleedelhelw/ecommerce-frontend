import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiDownload, FiUpload } from 'react-icons/fi';
import sellerShippingService from '../../api/seller/sellerShippingService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const SellerShippingZonesPage = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // فورم إضافة/تعديل منطقة واحدة
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' أو 'edit'
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [formData, setFormData] = useState({
    governorate: '',
    city: '',
    shippingCost: '',
    estimatedDays: '',
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});

  // فورم البلك
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkData, setBulkData] = useState('');
  const [bulkErrors, setBulkErrors] = useState('');

  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingZoneId, setDeletingZoneId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchZones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sellerShippingService.getMyZones();
      setZones(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تحميل مناطق الشحن');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  // ── فورم إضافة/تعديل منطقة واحدة ──

  const resetForm = () => {
    setFormData({
      governorate: '',
      city: '',
      shippingCost: '',
      estimatedDays: '',
      isActive: true,
    });
    setFormErrors({});
    setEditingZoneId(null);
    setFormMode('add');
    setShowForm(false);
  };

  const handleEditZone = (zone) => {
    setFormData({
      governorate: zone.governorate,
      city: zone.city,
      shippingCost: zone.shippingCost.toString(),
      estimatedDays: zone.estimatedDays.toString(),
      isActive: zone.isActive,
    });
    setEditingZoneId(zone.id);
    setFormMode('edit');
    setShowForm(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.governorate.trim())
      errors.governorate = 'المحافظة مطلوبة';

    if (!formData.city.trim())
      errors.city = 'المدينة مطلوبة';

    if (!formData.shippingCost || parseFloat(formData.shippingCost) < 0)
      errors.shippingCost = 'تكلفة الشحن مطلوبة وصحيحة';

    if (formData.estimatedDays && isNaN(parseInt(formData.estimatedDays)))
      errors.estimatedDays = 'عدد الأيام يجب أن يكون رقم';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        governorate: formData.governorate.trim(),
        city: formData.city.trim(),
        shippingCost: parseFloat(formData.shippingCost),
        estimatedDays: parseInt(formData.estimatedDays) || 0,
        isActive: formData.isActive,
      };

      if (formMode === 'edit') {
        await sellerShippingService.updateZone(editingZoneId, payload);
        toast.success('تم تحديث منطقة الشحن ✅');
      } else {
        await sellerShippingService.createZone(payload);
        toast.success('تم إضافة منطقة شحن جديدة ✅');
      }

      resetForm();
      fetchZones();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  // ── فورم البلك (إضافة متعددة) ──

  const parseBulkCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    const zones = [];

    // تخطي السطر الأول (الهيدر)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map((p) => p.trim());
      if (parts.length < 4) continue;

      zones.push({
        governorate: parts[0],
        city: parts[1],
        shippingCost: parseFloat(parts[2]),
        estimatedDays: parseInt(parts[3]) || 0,
      });
    }

    return zones;
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();

    if (!bulkData.trim()) {
      setBulkErrors('الرجاء إدخال البيانات');
      return;
    }

    try {
      setBulkErrors('');
      const parsedZones = parseBulkCSV(bulkData);

      if (parsedZones.length === 0) {
        setBulkErrors('لم يتم العثور على أي بيانات صحيحة');
        return;
      }

      setSaving(true);
      await sellerShippingService.createZonesBulk(parsedZones);
      toast.success(`تم إضافة ${parsedZones.length} منطقة شحن ✅`);

      setBulkData('');
      setShowBulkForm(false);
      fetchZones();
    } catch (err) {
      setBulkErrors(err.response?.data?.message || 'فشل إضافة المناطق');
    } finally {
      setSaving(false);
    }
  };

  // ── حذف منطقة ──

  const handleDeleteClick = (zone) => {
    setDeletingZoneId(zone.id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingZoneId) return;

    try {
      setDeleteLoading(true);
      await sellerShippingService.deleteZone(deletingZoneId);
      toast.success('تم حذف منطقة الشحن ✅');
      setShowDeleteDialog(false);
      setDeletingZoneId(null);
      fetchZones();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل الحذف');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── تحميل نموذج CSV ──

  const downloadTemplate = () => {
    const csvContent = `المحافظة,المدينة,تكلفة الشحن,عدد الأيام
القاهرة,مدينة نصر,25,2
القاهرة,المعادي,30,2
الجيزة,المهندسين,35,3
الإسكندرية,سيدي بشر,60,4`;

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent)
    );
    element.setAttribute('download', 'shipping-zones-template.csv');
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success('تم تحميل النموذج');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchZones} />;

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🚚 مناطق الشحن</h1>
          <p className="text-gray-500 text-sm mt-1">
            إدارة المناطق التي تشحن إليها
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700
                       font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <FiPlus size={16} /> إضافة منطقة
          </button>
          <button
            onClick={() => setShowBulkForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700
                       font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <FiUpload size={16} /> إضافة متعددة
          </button>
        </div>
      </div>

      {/* ── فورم إضافة/تعديل منطقة واحدة ── */}
      {showForm && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {formMode === 'edit' ? '✏️ تعديل منطقة شحن' : '➕ إضافة منطقة شحن جديدة'}
            </h2>
            <button
              onClick={resetForm}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={20} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* المحافظة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المحافظة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.governorate}
                  onChange={(e) => {
                    setFormData({ ...formData, governorate: e.target.value });
                    if (formErrors.governorate)
                      setFormErrors((p) => ({ ...p, governorate: '' }));
                  }}
                  placeholder="مثال: القاهرة"
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none
                             focus:ring-2 focus:ring-blue-400 transition-all
                             ${formErrors.governorate ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                {formErrors.governorate && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.governorate}</p>
                )}
              </div>

              {/* المدينة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المدينة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (formErrors.city) setFormErrors((p) => ({ ...p, city: '' }));
                  }}
                  placeholder="مثال: مدينة نصر"
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none
                             focus:ring-2 focus:ring-blue-400 transition-all
                             ${formErrors.city ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                {formErrors.city && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.city}</p>
                )}
              </div>

              {/* تكلفة الشحن */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تكلفة الشحن (ج.م) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.shippingCost}
                  onChange={(e) => {
                    setFormData({ ...formData, shippingCost: e.target.value });
                    if (formErrors.shippingCost)
                      setFormErrors((p) => ({ ...p, shippingCost: '' }));
                  }}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none
                             focus:ring-2 focus:ring-blue-400 transition-all
                             ${formErrors.shippingCost ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                {formErrors.shippingCost && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.shippingCost}</p>
                )}
              </div>

              {/* عدد أيام التوصيل */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عدد أيام التوصيل
                </label>
                <input
                  type="number"
                  value={formData.estimatedDays}
                  onChange={(e) => {
                    setFormData({ ...formData, estimatedDays: e.target.value });
                    if (formErrors.estimatedDays)
                      setFormErrors((p) => ({ ...p, estimatedDays: '' }));
                  }}
                  placeholder="2"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none
                             focus:ring-2 focus:ring-blue-400 transition-all
                             ${formErrors.estimatedDays ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                {formErrors.estimatedDays && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.estimatedDays}</p>
                )}
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700 cursor-pointer">
                المنطقة مفعلة
              </label>
            </div>

            {/* أزرار */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700
                           disabled:opacity-50 font-medium text-sm transition-colors"
              >
                {saving
                  ? 'جاري الحفظ...'
                  : formMode === 'edit'
                    ? '💾 حفظ التعديلات'
                    : '➕ إضافة المنطقة'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg
                           hover:bg-gray-300 font-medium text-sm transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── فورم البلك (إضافة متعددة) ── */}
      {showBulkForm && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              📤 إضافة مناطق متعددة
            </h2>
            <button
              onClick={() => {
                setShowBulkForm(false);
                setBulkData('');
                setBulkErrors('');
              }}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={20} className="text-gray-500" />
            </button>
          </div>

          {/* تعليمات */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 font-medium mb-2">📋 كيفية الاستخدام:</p>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>استخدم ملف CSV بصيغة: المحافظة، المدينة، تكلفة الشحن، عدد الأيام</li>
              <li>السطر الأول هو الهيدر (العناوين)</li>
              <li>يمكنك تحميل نموذج جاهز من الزرار أسفل</li>
              <li>كل سطر = منطقة شحن واحدة</li>
            </ul>
          </div>

          <form onSubmit={handleBulkSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البيانات بصيغة CSV
              </label>
              <textarea
                value={bulkData}
                onChange={(e) => {
                  setBulkData(e.target.value);
                  if (bulkErrors) setBulkErrors('');
                }}
                placeholder={`المحافظة,المدينة,تكلفة الشحن,عدد الأيام
القاهرة,مدينة نصر,25,2
القاهرة,المعادي,30,2
الجيزة,المهندسين,35,3`}
                rows={6}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                           outline-none focus:ring-2 focus:ring-blue-400 font-mono"
              />
              {bulkErrors && (
                <p className="mt-1 text-xs text-red-500">{bulkErrors}</p>
              )}
            </div>

            {/* أزرار */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700
                           disabled:opacity-50 font-medium text-sm transition-colors"
              >
                {saving ? 'جاري الإضافة...' : '📤 إضافة المناطق'}
              </button>
              <button
                type="button"
                onClick={downloadTemplate}
                className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700
                           font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <FiDownload size={16} /> تحميل نموذج
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBulkForm(false);
                  setBulkData('');
                  setBulkErrors('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg
                           hover:bg-gray-300 font-medium text-sm transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── الجدول ── */}
      {zones.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-400 mb-4">لم تقم بإضافة أي مناطق شحن حتى الآن</p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700
                       font-medium text-sm inline-flex items-center gap-2"
          >
            <FiPlus size={16} /> إضافة منطقة الآن
          </button>
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
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {zones.map((zone) => (
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
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditZone(zone)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg
                                     transition-colors"
                          title="تعديل"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(zone)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg
                                     transition-colors"
                          title="حذف"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* إحصائيات */}
          <div className="border-t bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-600">
              📊 إجمالي المناطق: <span className="font-bold text-gray-800">{zones.length}</span>
              {' '} | 
              ✅ مفعل: <span className="font-bold text-green-600">
                {zones.filter(z => z.isActive).length}
              </span>
              {' '} | 
              ⭕ معطل: <span className="font-bold text-gray-600">
                {zones.filter(z => !z.isActive).length}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingZoneId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="حذف منطقة شحن"
        message="هل أنت متأكد من حذف هذه المنطقة؟ سيتم حذف جميع البيانات المرتبطة بها."
        confirmText={deleteLoading ? 'جاري الحذف...' : 'نعم، احذف'}
        danger
      />
    </div>
  );
};

export default SellerShippingZonesPage;