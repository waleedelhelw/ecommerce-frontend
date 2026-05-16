import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ValidationSummary from '../../components/common/ValidationSummary';
import profileService from '../../api/profileService';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiEdit, FiLock, FiMapPin } from 'react-icons/fi';
import { showValidationFeedback } from '../../utils/formValidation';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState({});

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        country: data.country || '',
        postalCode: data.postalCode || '',
      });
    } catch (err) {
      setError('فشل في تحميل الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error(showValidationFeedback('راجع بيانات الملف الشخصي'));
      return;
    }
    try {
      setSaving(true);
      await profileService.updateProfile(formData);
      toast.success('تم تحديث الملف الشخصي بنجاح');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل تحديث الملف الشخصي');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      city: profile?.city || '',
      country: profile?.country || '',
      postalCode: profile?.postalCode || '',
    });
    setErrors({});
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProfile} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'الرئيسية', link: '/' }, { label: 'الملف الشخصي' }]} />
      <h1 className="text-2xl font-bold mb-6">👤 الملف الشخصي</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الكارد الجانبي */}
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser size={40} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-bold">{profile?.name}</h2>
          <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">
              الدور: <span className="font-medium text-gray-700">{user?.role === 'Admin' ? 'مدير' : 'عميل'}</span>
            </p>
          </div>
        </div>

        {/* المعلومات الشخصية */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">المعلومات الشخصية</h2>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="btn-outline text-sm flex items-center gap-2">
                  <FiEdit size={16} /> تعديل
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} noValidate>
                <ValidationSummary errors={errors} className="mb-4" />

                {/* الاسم */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} aria-invalid={Boolean(errors.name)} className={`input-field ${errors.name ? 'input-error' : ''}`} />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* الهاتف */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="01xxxxxxxxx" className="input-field" />
                </div>

                {/* العنوان */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="شارع، مبنى، شقة" className="input-field" />
                </div>

                {/* المدينة والدولة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المدينة</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="القاهرة" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الدولة</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="مصر" className="input-field" />
                  </div>
                </div>

                {/* الرمز البريدي */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">الرمز البريدي</label>
                  <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="12345" className="input-field" />
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="btn-primary">
                    {saving ? 'جاري الحفظ...' : '💾 حفظ التغييرات'}
                  </button>
                  <button type="button" onClick={handleCancel} className="btn-secondary">إلغاء</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiUser className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">الاسم الكامل</p>
                    <p className="font-medium">{profile?.name || 'غير محدد'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiMail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">البريد الإلكتروني</p>
                    <p className="font-medium">{profile?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiPhone className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">رقم الهاتف</p>
                    <p className="font-medium">{profile?.phone || 'غير محدد'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiMapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">العنوان</p>
                    <p className="font-medium">
                      {profile?.address || profile?.city || profile?.country
                        ? `${profile?.address || ''} ${profile?.city ? '- ' + profile.city : ''} ${profile?.country ? '- ' + profile.country : ''} ${profile?.postalCode ? '(' + profile.postalCode + ')' : ''}`.trim()
                        : 'غير محدد'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link to="/change-password" className="mt-4 bg-white rounded-xl border p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors block">
            <FiLock size={20} className="text-gray-400" />
            <div>
              <p className="font-medium">تغيير كلمة المرور</p>
              <p className="text-xs text-gray-500">تحديث كلمة مرور حسابك</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
