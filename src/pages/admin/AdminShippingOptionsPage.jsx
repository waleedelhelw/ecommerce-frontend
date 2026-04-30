import { useState, useEffect } from 'react';
import adminShippingService from '../../api/admin/adminShippingService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const AdminShippingOptionsPage = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', estimatedDays: '', isActive: true,
  });

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const data = await adminShippingService.getAll();
      setOptions(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError('فشل تحميل خيارات الشحن');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOptions(); }, []);

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', estimatedDays: '', isActive: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (option) => {
    setFormData({
      name: option.name,
      description: option.description || '',
      price: option.price.toString(),
      estimatedDays: option.estimatedDays.toString(),
      isActive: option.isActive,
    });
    setEditing(option.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      toast.error('الاسم والسعر مطلوبين');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        estimatedDays: parseInt(formData.estimatedDays) || 0,
      };
      if (editing) {
        await adminShippingService.update(editing, payload);
        toast.success('تم التعديل ✅');
      } else {
        await adminShippingService.create(payload);
        toast.success('تم الإضافة ✅');
      }
      resetForm();
      fetchOptions();
    } catch (err) {
      toast.error('فشل العملية');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل تريد حذف خيار الشحن ده؟')) return;
    try {
      await adminShippingService.remove(id);
      toast.success('تم الحذف ✅');
      fetchOptions();
    } catch (err) {
      toast.error('فشل الحذف');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOptions} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🚚 خيارات الشحن</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
        >
          + إضافة خيار شحن
        </button>
      </div>

      {/* الفورم */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 mb-6">
          <h3 className="font-bold mb-4">{editing ? '✏️ تعديل' : '➕ إضافة'} خيار شحن</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="مثال: شحن عادي"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر (ج.م) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عدد أيام التوصيل</label>
              <input
                type="number"
                value={formData.estimatedDays}
                onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="3"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="وصف اختياري"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm text-gray-700">مفعّل</label>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
              {saving ? 'جاري الحفظ...' : editing ? '💾 حفظ التعديلات' : '➕ إضافة'}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 text-sm">
              إلغاء
            </button>
          </div>
        </form>
      )}

      {/* الجدول */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-right p-4 font-medium text-gray-600">الاسم</th>
              <th className="text-right p-4 font-medium text-gray-600">السعر</th>
              <th className="text-right p-4 font-medium text-gray-600">أيام التوصيل</th>
              <th className="text-right p-4 font-medium text-gray-600">الحالة</th>
              <th className="text-right p-4 font-medium text-gray-600">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {options.map((option) => (
              <tr key={option.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-medium">{option.name}</p>
                  {option.description && <p className="text-xs text-gray-400">{option.description}</p>}
                </td>
                <td className="p-4 font-medium">
                  {option.price === 0 ? (
                    <span className="text-green-600">مجاني</span>
                  ) : (
                    formatPrice(option.price)
                  )}
                </td>
                <td className="p-4">{option.estimatedDays} أيام</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${option.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {option.isActive ? 'مفعّل' : 'معطّل'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(option)} className="text-blue-600 hover:underline text-xs">
                      ✏️ تعديل
                    </button>
                    <button onClick={() => handleDelete(option.id)} className="text-red-600 hover:underline text-xs">
                      🗑️ حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminShippingOptionsPage;