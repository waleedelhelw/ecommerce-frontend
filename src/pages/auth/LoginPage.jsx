import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../api/authService';
import useAuth from '../../hooks/useAuth';
import ErrorMessage from '../../components/common/ErrorMessage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const { login, getRedirectPath } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!password) newErrors.password = 'كلمة المرور مطلوبة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      const response = await loginApi(email, password);

      if (response.success && response.data) {
        // حفظ البيانات في الـ Context
        login(response.data);

        // التوجيه بناءً على الـ Role
        const userData = response.data;
        let redirectPath = '/';

        switch (userData.role) {
          case 'SuperAdmin':
            redirectPath = '/admin';
            break;
          case 'Seller':
            if (userData.sellerStatus === 'Approved') {
              redirectPath = '/seller/dashboard';
            } else if (userData.sellerStatus === 'Pending') {
              redirectPath = '/seller/pending-approval';
            } else if (userData.sellerStatus === 'Suspended') {
              redirectPath = '/seller/suspended';
            } else if (userData.sellerStatus === 'Rejected') {
              redirectPath = '/seller/rejected';
            } else {
              redirectPath = '/seller/pending-approval';
            }
            break;
          case 'Customer':
          default:
            redirectPath = '/';
            break;
        }

        navigate(redirectPath);
      } else {
        setApiError(response.message || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(', ') ||
        'فشل تسجيل الدخول، تحقق من البيانات';
      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <span className="text-4xl mb-2 block">🏪</span>
        <h1 className="text-2xl font-bold text-gray-900">تسجيل الدخول</h1>
        <p className="text-gray-500 mt-1">أدخل بياناتك للوصول لحسابك</p>
      </div>

      {/* خطأ API */}
      {apiError && <ErrorMessage message={apiError} />}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: '' }));
              setApiError('');
            }}
            placeholder="example@email.com"
            className={`input-field ${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: '' }));
              setApiError('');
            }}
            placeholder="••••••••"
            className={`input-field ${errors.password ? 'input-error' : ''}`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-base py-3"
        >
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>

      {/* روابط */}
      <div className="mt-6 space-y-3 text-center text-sm">
        <p className="text-gray-500">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            إنشاء حساب جديد
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

export default LoginPage;