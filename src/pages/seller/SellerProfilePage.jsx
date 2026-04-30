import { useState, useEffect } from 'react';
import { FiSave, FiUpload, FiX } from 'react-icons/fi';
import { getSellerProfile, updateSellerProfile, updatePayoutInfo } from '../../api/seller/sellerProfileService';
import { uploadImage } from '../../utils/cloudinary';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatPrice } from '../../utils/formatPrice';
import { sellerStatusMap, getStatusInfo } from '../../utils/orderStatusMap';
import toast from 'react-hot-toast';

const SellerProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPayout, setSavingPayout] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('store'); // store | payout

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

  // ✅ بيانات السحب البنكية
  const [payoutForm, setPayoutForm] = useState({
    bankName: '',
    bankAccountNumber: '',
    bankAccountHolder: '',
    walletNumber: '',
    walletProvider: '',
    instaPayAccount: '',
    preferredPayoutMethod: '',
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
      setPayoutForm({
        bankName: data.bankName || '',
        bankAccountNumber: data.bankAccountNumber || '',
        bankAccountHolder: data.bankAccountHolder || '',
        walletNumber: data.walletNumber || '',
        walletProvider: data.walletProvider || '',
        instaPayAccount: data.instaPayAccount || '',
        preferredPayoutMethod: data.preferredPayoutMethod || '',
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

  const handlePayoutChange = (e) => {
    const { name, value } = e.target;
    setPayoutForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('يرجى اختيار صورة فقط'); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error('حجم الصورة يجب أن لا يتجاوز 2 ميجابايت'); return; }
    try {
      setLogoUploading(true);
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, logoUrl: url }));
      toast.success('تم رفع اللوجو بنجاح');
    } catch { toast.error('فشل رفع الصورة'); }
    finally { setLogoUploading(false); }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('يرجى اختيار صورة فقط'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت'); return; }
    try {
      setBannerUploading(true);
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, bannerUrl: url }));
      toast.success('تم رفع البانر بنجاح');
    } catch { toast.error('فشل رفع الصورة'); }
    finally { setBannerUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');
    try {
      setSaving(true);
      await updateSellerProfile(form);
      setSuccessMsg('تم تحديث بيانات المتجر بنجاح');
      toast.success('تم الحفظ ✅');
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحديث البيانات');
    } finally {
      setSaving(false);
    }
  };

  // ✅ حفظ بيانات السحب
  const handlePayoutSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingPayout(true);
      await updatePayoutInfo(payoutForm);
      toast.success('تم تحديث بيانات السحب بنجاح ✅');
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تحديث بيانات السحب');
    } finally {
      setSavingPayout(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const status = getStatusInfo(sellerStatusMap, profile?.status);

  const PAYOUT_METHODS = [
    { value: 'VodafoneCash', label: '📱 فودافون كاش' },
    { value: 'EtisalatCash', label: '📱 إتصالات كاش' },
    { value: 'OrangeCash', label: '📱 أورانج كاش' },
    { value: 'InstaPay', label: '🏦 إنستاباي' },
    { value: 'BankTransfer', label: '🏦 تحويل بنكي' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إعدادات المتجر</h1>
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

      {/* ✅ Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('store')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'store'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏪 بيانات المتجر
        </button>
        <button
          onClick={() => setActiveTab('payout')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'payout'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏦 بيانات السحب
        </button>
      </div>

      {/* رسائل */}
      {error && <ErrorMessage message={error} />}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          ✅ {successMsg}
        </div>
      )}

      {/* ✅ Tab: بيانات المتجر */}
      {activeTab === 'store' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* صور المتجر */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📷 صور المتجر</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* لوجو */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">لوجو المتجر</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                  {form.logoUrl ? (
                    <div className="relative inline-block">
                      <img src={form.logoUrl} alt="لوجو" className="w-32 h-32 object-cover rounded-xl mx-auto" />
                      <button type="button" onClick={() => setForm((p) => ({ ...p, logoUrl: '' }))} className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <FiX size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <FiUpload className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-500">اختر صورة اللوجو</p>
                    </div>
                  )}
                  <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg cursor-pointer hover:bg-green-100 text-sm font-medium">
                    <FiUpload size={16} />
                    {logoUploading ? 'جاري الرفع...' : 'رفع صورة'}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={logoUploading} className="hidden" />
                  </label>
                </div>
              </div>
              {/* بانر */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">بانر المتجر</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                  {form.bannerUrl ? (
                    <div className="relative inline-block w-full">
                      <img src={form.bannerUrl} alt="بانر" className="w-full h-32 object-cover rounded-xl" />
                      <button type="button" onClick={() => setForm((p) => ({ ...p, bannerUrl: '' }))} className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <FiX size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <FiUpload className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-500">اختر صورة البانر</p>
                    </div>
                  )}
                  <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg cursor-pointer hover:bg-green-100 text-sm font-medium">
                    <FiUpload size={16} />
                    {bannerUploading ? 'جاري الرفع...' : 'رفع صورة'}
                    <input type="file" accept="image/*" onChange={handleBannerUpload} disabled={bannerUploading} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* بيانات المتجر */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🏪 بيانات المتجر</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المتجر</label>
                <input type="text" name="storeName" value={form.storeName} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">وصف المتجر</label>
                <textarea name="storeDescription" value={form.storeDescription} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          </div>

          {/* بيانات التواصل */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📞 بيانات التواصل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد التجاري</label>
                <input type="email" name="businessEmail" value={form.businessEmail} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الهاتف التجاري</label>
                <input type="tel" name="businessPhone" value={form.businessPhone} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <input type="text" name="businessAddress" value={form.businessAddress} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المدينة</label>
                <input type="text" name="businessCity" value={form.businessCity} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الدولة</label>
                <input type="text" name="businessCountry" value={form.businessCountry} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving || logoUploading || bannerUploading} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium">
              <FiSave size={18} />
              {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>
        </form>
      )}

      {/* ✅ Tab: بيانات السحب */}
      {activeTab === 'payout' && (
        <form onSubmit={handlePayoutSubmit} className="space-y-6">
          {/* طريقة السحب المفضلة */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">💰 طريقة السحب المفضلة</h2>
            <p className="text-sm text-gray-500 mb-4">اختر الطريقة اللي تحب تستلم بيها أرباحك</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PAYOUT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    payoutForm.preferredPayoutMethod === method.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredPayoutMethod"
                    value={method.value}
                    checked={payoutForm.preferredPayoutMethod === method.value}
                    onChange={handlePayoutChange}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="font-medium text-sm">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* بيانات المحفظة الإلكترونية */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📱 بيانات المحفظة الإلكترونية</h2>
            <p className="text-sm text-gray-500 mb-4">لو بتفضل تستلم على محفظة إلكترونية</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مزود المحفظة</label>
                <select
                  name="walletProvider"
                  value={payoutForm.walletProvider}
                  onChange={handlePayoutChange}
                  className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">اختر...</option>
                  <option value="VodafoneCash">فودافون كاش</option>
                  <option value="EtisalatCash">إتصالات كاش</option>
                  <option value="OrangeCash">أورانج كاش</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم المحفظة</label>
                <input
                  type="tel"
                  name="walletNumber"
                  value={payoutForm.walletNumber}
                  onChange={handlePayoutChange}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* بيانات إنستاباي */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🏦 إنستاباي</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">حساب إنستاباي</label>
              <input
                type="text"
                name="instaPayAccount"
                value={payoutForm.instaPayAccount}
                onChange={handlePayoutChange}
                placeholder="username@instapay"
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* بيانات الحساب البنكي */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🏦 الحساب البنكي</h2>
            <p className="text-sm text-gray-500 mb-4">لو بتفضل تستلم بتحويل بنكي</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم البنك</label>
                <input
                  type="text"
                  name="bankName"
                  value={payoutForm.bankName}
                  onChange={handlePayoutChange}
                  placeholder="مثال: البنك الأهلي المصري"
                  className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الحساب</label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  value={payoutForm.bankAccountNumber}
                  onChange={handlePayoutChange}
                  placeholder="رقم الحساب البنكي"
                  className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم صاحب الحساب</label>
                <input
                  type="text"
                  name="bankAccountHolder"
                  value={payoutForm.bankAccountHolder}
                  onChange={handlePayoutChange}
                  placeholder="الاسم كما هو في البنك"
                  className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingPayout}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              <FiSave size={18} />
              {savingPayout ? 'جاري الحفظ...' : '💾 حفظ بيانات السحب'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SellerProfilePage;