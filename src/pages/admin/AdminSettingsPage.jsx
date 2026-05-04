import { useState, useEffect } from 'react';
import adminSettingsService from '../../api/admin/adminSettingsService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import toast from 'react-hot-toast';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editValues, setEditValues] = useState({});

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await adminSettingsService.getSettings();
      const list = Array.isArray(data) ? data : data?.items || [];
      setSettings(list);
      const values = {};
      list.forEach((s) => {
        values[s.key] = s.value;
      });
      setEditValues(values);
    } catch (err) {
      setError('فشل تحميل الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updates = settings.map((s) => ({
        key: s.key,
        value: editValues[s.key] ?? s.value, // ✅ تم التعديل - كان || وده كان بيتجاهل الصفر
      }));
      await adminSettingsService.updateSettings(updates);
      toast.success('تم حفظ الإعدادات ✅');
      fetchSettings();
    } catch (err) {
      toast.error('فشل حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSettings} />;

  // تجميع حسب الفئة
  const categories = settings.reduce((acc, s) => {
    const cat = s.category || 'أخرى';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const categoryLabels = {
    Payment: '💳 الدفع',
    Commission: '💰 العمولات',
    Delivery: '🚚 التوصيل',
    Payout: '🏦 السحب',
    General: '⚙️ عام',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">⚙️ إعدادات المنصة</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {saving ? 'جاري الحفظ...' : '💾 حفظ التغييرات'}
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {categoryLabels[category] || category}
            </h2>
            <div className="space-y-4">
              {items.map((setting) => (
                <div key={setting.key} className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {setting.description || setting.key}
                    </label>
                    <p className="text-xs text-gray-400">{setting.key}</p>
                  </div>
                  <input
                    type="text"
                    value={editValues[setting.key] ?? ''} // ✅ تم التعديل - كان || وده كان بيتجاهل الصفر
                    onChange={(e) =>
                      setEditValues({ ...editValues, [setting.key]: e.target.value })
                    }
                    className="w-64 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSettingsPage;