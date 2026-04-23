import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../api/authService';
import useAuth from '../../hooks/useAuth';
import ErrorMessage from '../../components/common/ErrorMessage';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [apiErrors, setApiErrors] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
    setApiErrors([]);
  };

  const validate = () => {
    const ne = {};
    if (!formData.name.trim()) ne.name = 'الاسم مطلوب';
    if (!formData.email.trim()) ne.email = 'البريد الإلكتروني مطلوب';
    if (!formData.password) ne.password = 'كلمة المرور مطلوبة';
    else if (formData.password.length < 6) ne.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (formData.password !== formData.confirmPassword) ne.confirmPassword = 'كلمتا المرور غير متطابقتين';
    setErrors(ne);
    return Object.keys(ne).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');
    setApiErrors([]);

    try {
      const response = await registerApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone,
      });

      if (response.success && response.data) {
        // تسجيل الدخول تلقائياً بعد التسجيل
        login(response.data);
        navigate('/');
      } else {
        if (response.errors && Array.isArray(response.errors)) {
          setApiErrors(response.errors);
        } else {
          setApiError(response.message || 'فشل إنشاء الحساب');
        }
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(', ') ||
        'فشل إنشاء الحساب، حاول مرة أخرى';
      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <span className="text-4xl mb-2 block">🏪</span>
        <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
        <p className="text-gray-500 mt-1">انضم إلينا وابدأ التسوق</p>
      </div>

      {/* أخطاء API */}
      {apiError && <ErrorMessage message={apiError} />}

      {apiErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-bold mb-2">❌ فشل التسجيل:</p>
          <ul className="list-disc list-inside space-y-1">
            {apiErrors.map((err, index) => (
              <li key={index} className="text-red-600 text-sm">{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* الاسم */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="أحمد محمد"
            className={`input-field ${errors.name ? 'input-error' : ''}`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* البريد */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className={`input-field ${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* الهاتف */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="01012345678"
            className="input-field"
          />
        </div>

        {/* كلمة المرور */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`input-field ${errors.password ? 'input-error' : ''}`}
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>

        {/* تأكيد كلمة المرور */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-base py-3"
        >
          {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
        </button>
      </form>

      {/* روابط */}
      <div className="mt-6 space-y-3 text-center text-sm">
        <p className="text-gray-500">
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="text-blue-600 font-medium">
            تسجيل الدخول
          </Link>
        </p>

        {/* 🆕 لينك تسجيل البائع */}
        <div className="pt-3 border-t">
          <p className="text-gray-500">
            عايز تبيع على منصتنا؟{' '}
            <Link to="/register-seller" className="text-green-600 hover:text-green-700 font-medium">
              🏪 سجّل كبائع
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;