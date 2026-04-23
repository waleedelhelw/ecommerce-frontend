import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import authService from '../../api/authService';
import toast from 'react-hot-toast';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const ne = {};
    if (!formData.currentPassword) ne.currentPassword = 'كلمة المرور الحالية مطلوبة';
    if (!formData.newPassword) ne.newPassword = 'كلمة المرور الجديدة مطلوبة';
    if (formData.newPassword.length < 6) ne.newPassword = 'يجب أن تكون 6 أحرف على الأقل';
    if (formData.newPassword !== formData.confirmNewPassword) ne.confirmNewPassword = 'كلمتا المرور غير متطابقتين';
    setErrors(ne);
    return Object.keys(ne).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await authService.changePassword({ currentPassword: formData.currentPassword, newPassword: formData.newPassword });
      toast.success('تم تغيير كلمة المرور بنجاح');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل تغيير كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'الرئيسية', link: '/' }, { label: 'الملف الشخصي', link: '/profile' }, { label: 'تغيير كلمة المرور' }]} />
      <h1 className="text-2xl font-bold mb-6">🔑 تغيير كلمة المرور</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 max-w-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الحالية *</label>
          <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className={`input-field ${errors.currentPassword ? 'input-error' : ''}`} />
          {errors.currentPassword && <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة *</label>
          <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className={`input-field ${errors.newPassword ? 'input-error' : ''}`} />
          {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور الجديدة *</label>
          <input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} className={`input-field ${errors.confirmNewPassword ? 'input-error' : ''}`} />
          {errors.confirmNewPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmNewPassword}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
          </button>
          <button type="button" onClick={() => navigate('/profile')} className="btn-secondary">إلغاء</button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
