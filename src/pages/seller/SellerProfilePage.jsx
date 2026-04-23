import { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import { getSellerProfile, updateSellerProfile } from '../../api/seller/sellerProfileService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatPrice } from '../../utils/formatPrice';
import { sellerStatusMap, getStatusInfo } from '../../utils/orderStatusMap';

const SellerProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    storeName: '',
    storeDescription: '',
    logoUrl: '',
    bannerUrl: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    businessCity: '',
    businessCountry: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getSellerProfile();
      setProfile(data);
      setForm({
        storeName: data.storeName || '',
        storeDescription: data.storeDescription || '',
        logoUrl: data.logoUrl || '',
        bannerUrl: data.bannerUrl || '',
        businessEmail: data.businessEmail || '',
        businessPhone: data.businessPhone || '',
        businessAddress: data.businessAddress || '',
        businessCity: data.businessCity || '',
        businessCountry: data.businessCountry || '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل بيانات المتجر');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');

    try {
      setSaving(true);
      await updateSellerProfile(form);
      setSuccessMsg('تم تحديث بيانات المتجر بنجاح');
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحديث البيانات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const status = getStatusInfo(sellerStatusMap, profile?.status);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ملف المتجر</h1>
        <p className="text-gray-500 mt-1">عرض وتعديل بيانات متجرك</p>
      </div>

      {/* معلومات سريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">الحالة</p>
          <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
            {status.icon} {status.label}
          </span>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">نسبة العمولة</p>
          <p className="text-lg font-bold text-gray-800">{profile?.commissionRate || 0}%</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">التقييم</p>
          <p className="text-lg font-bold text-gray-800">
            ⭐ {profile?.rating || 0} ({profile?.totalRatings || 0})
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">الرصيد</p>
          <p className="text-lg font-bold text-green-600">{formatPrice(profile?.balance || 0)}</p>
        </div>
      </div>

      {/* رسائل */}
      {error && <ErrorMessage message={error} />}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          ✅ {successMsg}
        </div>
      )}

      {/* نموذج التعديل */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* بيانات المتجر */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">بيانات المتجر</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المتجر</label>
              <input
                type="text"
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">وصف المتجر</label>
              <textarea
                name="storeDescription"
                value={form.storeDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رابط اللوجو</label>
              <input
                type="url"
                name="logoUrl"
                value={form.logoUrl}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رابط البانر</label>
              <input
                type="url"
                name="bannerUrl"
                value={form.bannerUrl}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* بيانات التواصل */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">بيانات التواصل</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد التجاري</label>
              <input
                type="email"
                name="businessEmail"
                value={form.businessEmail}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الهاتف التجاري</label>
              <input
                type="tel"
                name="businessPhone"
                value={form.businessPhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
              <input
                type="text"
                name="businessAddress"
                value={form.businessAddress}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المدينة</label>
              <input
                type="text"
                name="businessCity"
                value={form.businessCity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الدولة</label>
              <input
                type="text"
                name="businessCountry"
                value={form.businessCountry}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* زر الحفظ */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            <FiSave size={18} />
            {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerProfilePage;