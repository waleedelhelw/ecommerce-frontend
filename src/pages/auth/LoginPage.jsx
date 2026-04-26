import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { login as loginApi, googleLogin as googleLoginApi } from '../../api/authService';
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
        login(response.data);

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
        // ✅ لو البريد مش مفعّل، حوّله لصفحة التحقق
        if (response.message?.includes('غير مفعّل')) {
          navigate('/verify-email', {
            state: { email: email },
          });
          return;
        }
        setApiError(response.message || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'فشل تسجيل الدخول، تحقق من البيانات';

      // ✅ لو البريد مش مفعّل
      if (errorMsg.includes('غير مفعّل')) {
        navigate('/verify-email', {
          state: { email: email },
        });
        return;
      }

      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setApiError('');
      const response = await googleLoginApi(credentialResponse.credential);

      if (response.success && response.data) {
        login(response.data);

        const userData = response.data;
        let redirectPath = '/';

        switch (userData.role) {
          case 'SuperAdmin':
            redirectPath = '/admin';
            break;
          case 'Seller':
            redirectPath = userData.sellerStatus === 'Approved'
              ? '/seller/dashboard'
              : '/seller/pending-approval';
            break;
          default:
            redirectPath = '/';
        }

        navigate(redirectPath);
      } else {
        setApiError(response.message || 'فشل تسجيل الدخول بـ Google');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'فشل تسجيل الدخول بـ Google');
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

      {apiError && <ErrorMessage message={apiError} />}

      {/* ✅ Google Login Button */}
      <div className="mb-6">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setApiError('فشل تسجيل الدخول بـ Google')}
          text="signin_with"
          shape="rectangular"
          width="100%"
          locale="ar"
        />
      </div>

      {/* فاصل */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-sm text-gray-400">أو ادخل بالبريد</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: '' }));
              setApiError('');
            }}
            placeholder="example@gmail.com"
            className={`input-field ${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
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
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3">
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>

      <div className="mt-6 space-y-3 text-center text-sm">
        <p className="text-gray-500">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            إنشاء حساب جديد
          </Link>
        </p>
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