import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import SEO from '../../components/common/SEO';
import { login as loginApi, googleLogin as googleLoginApi } from '../../api/authService';
import useAuth from '../../hooks/useAuth';
import ErrorMessage from '../../components/common/ErrorMessage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const { login, getRedirectPath } = useAuth();
  const navigate = useNavigate();

  // ── helpers ──
  const getRedirect = (userData) => {
    switch (userData.role) {
      case 'SuperAdmin': return '/admin';
      case 'Seller':
        if (userData.sellerStatus === 'Approved')  return '/seller/dashboard';
        if (userData.sellerStatus === 'Suspended') return '/seller/suspended';
        if (userData.sellerStatus === 'Rejected')  return '/seller/rejected';
        return '/seller/pending-approval';
      default: return '/';
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email    = 'البريد الإلكتروني مطلوب';
    if (!password)     newErrors.password = 'كلمة المرور مطلوبة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Email Login ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const response = await loginApi(email, password);
      if (response.success && response.data) {
        login(response.data);
        navigate(getRedirect(response.data));
      } else {
        if (response.message?.includes('غير مفعّل')) {
          navigate('/verify-email', { state: { email } });
          return;
        }
        setApiError(response.message || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'فشل تسجيل الدخول، تحقق من البيانات';
      if (errorMsg.includes('غير مفعّل')) {
        navigate('/verify-email', { state: { email } });
        return;
      }
      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ── Google Login ──
  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setGoogleLoading(true);
      setApiError('');
      const response = await googleLoginApi(tokenResponse.access_token);
      if (response.success && response.data) {
        login(response.data);
        navigate(getRedirect(response.data));
      } else {
        setApiError(response.message || 'فشل تسجيل الدخول بـ Google');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'فشل تسجيل الدخول بـ Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setApiError('فشل تسجيل الدخول بـ Google'),
  });

  return (
    <>
      <SEO
        title="تسجيل الدخول"
        description="سجّل الدخول إلى حسابك على تسوّق للوصول لطلباتك، مفضلتك، وسلتك."
        url="/login"
        noindex={true}
      />

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* ── الشريط العلوي ── */}
        <div className="h-2 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />

        <div className="p-8">

          {/* ── الهيدر ── */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                            bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg mb-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-800">مرحباً بعودتك</h1>
            <p className="text-gray-400 text-sm mt-1">سجّل دخولك للوصول لحسابك في تسوّق</p>
          </div>

          {/* ── API Error ── */}
          {apiError && <ErrorMessage message={apiError} />}

          {/* ── زرار Google Custom ── */}
          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3
                       py-3 px-4 rounded-xl
                       bg-white border-2 border-gray-200
                       hover:border-gray-300 hover:bg-gray-50 hover:shadow-md
                       disabled:opacity-60 disabled:cursor-not-allowed
                       transition-all duration-300 group mb-5"
          >
            {googleLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm font-semibold text-gray-500">
                  جاري الاتصال بـ Google...
                </span>
              </>
            ) : (
              <>
                {/* Google SVG Logo */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>

                <span className="text-sm font-semibold text-gray-700
                                 group-hover:text-gray-900 transition-colors">
                  تسجيل الدخول بواسطة Google
                </span>
              </>
            )}
          </button>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              أو بالبريد الإلكتروني
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* ── الفورم ── */}
          <form onSubmit={handleSubmit} noValidate>

            {/* البريد الإلكتروني */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                    setApiError('');
                  }}
                  placeholder="example@gmail.com"
                  className={`input-field pr-9 ${errors.email ? 'input-error' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* كلمة المرور */}
            <div className="mb-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: '' }));
                    setApiError('');
                  }}
                  placeholder="••••••••"
                  className={`input-field pr-9 ${errors.password ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* نسيت كلمة المرور */}
            <div className="text-left mb-6">
              <Link to="/forgot-password"
                className="text-xs text-purple-500 hover:text-purple-700 transition-colors">
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white text-sm
                         bg-gradient-to-r from-purple-600 to-pink-500
                         hover:from-purple-700 hover:to-pink-600
                         disabled:opacity-60 disabled:cursor-not-allowed
                         shadow-md hover:shadow-lg
                         transition-all duration-300
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  تسجيل الدخول
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* ── الروابط الأسفل ── */}
          <div className="mt-6 pt-5 border-t border-gray-100 space-y-3 text-center">
            <p className="text-sm text-gray-500">
              ليس لديك حساب؟{' '}
              <Link to="/register"
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                إنشاء حساب جديد
              </Link>
            </p>
            <div className="flex items-center justify-center gap-2 text-sm
                            bg-green-50 border border-green-100 rounded-xl py-2.5 px-4">
              <svg className="w-4 h-4 text-green-600 shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-gray-500">
                عايز تبيع؟{' '}
                <Link to="/register-seller"
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                  سجّل كبائع الآن
                </Link>
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default LoginPage;