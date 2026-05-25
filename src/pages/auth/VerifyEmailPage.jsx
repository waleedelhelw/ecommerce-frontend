import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail, resendVerification } from '../../api/authService';
import useAuth from '../../hooks/useAuth';
import ErrorMessage from '../../components/common/ErrorMessage';

const VerifyEmailPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  const inputRefs = useRef([]);
  const navTimerRef = useRef(null);
  const { login } = useAuth();

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);
  const navigate = useNavigate();
  const location = useLocation();

  // استلام الإيميل من الصفحة السابقة
  const email = location.state?.email || '';
  const role = location.state?.role || 'Customer';

  // لو مفيش إيميل، ارجع للتسجيل
  useEffect(() => {
    if (!email) {
      setRedirecting(true);
      navigate('/register');
    }
  }, [email, navigate]);

  // عداد تنازلي لإعادة الإرسال
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Focus أول input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // التعامل مع كتابة الكود
  const handleChange = (index, value) => {
    // قبول أرقام فقط
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // انتقال تلقائي للخانة التالية
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // لو الكود اكتمل، أرسله تلقائي
    if (value && index === 5) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  // التعامل مع Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // التعامل مع اللصق (Paste)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      handleVerify(pastedData);
    }
  };

  // التحقق من الكود
  const handleVerify = async (fullCode) => {
    setLoading(true);
    setError('');

    try {
      const response = await verifyEmail(email, fullCode);

      if (response.success && response.data) {
        setSuccess('تم تفعيل بريدك الإلكتروني بنجاح! 🎉');

        // تسجيل الدخول تلقائي
        if (response.data.token) {
          login(response.data);

          navTimerRef.current = setTimeout(() => {
            if (role === 'Seller') {
              navigate('/seller/pending-approval');
            } else {
              navigate('/');
            }
          }, 1500);
        }
      } else {
        setError(response.message || 'كود التحقق غير صحيح');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'فشل التحقق، حاول مرة أخرى';
      setError(errorMsg);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // إعادة إرسال الكود
  const handleResend = async () => {
    if (countdown > 0) return;

    setResending(true);
    setError('');

    try {
      const response = await resendVerification(email);
      if (response.success) {
        setSuccess('تم إرسال كود جديد إلى بريدك الإلكتروني ✅');
        setCountdown(60); // انتظر 60 ثانية
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'فشل إرسال الكود');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'فشل إرسال الكود');
    } finally {
      setResending(false);
    }
  };

  // إرسال يدوي
  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('يرجى إدخال الكود المكون من 6 أرقام');
      return;
    }
    handleVerify(fullCode);
  };

  if (redirecting) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
        <div className="text-center py-12">
          <svg className="animate-spin h-10 w-10 mx-auto text-blue-600 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500">جاري التحويل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <span className="text-5xl mb-3 block">📧</span>
        <h1 className="text-2xl font-bold text-gray-900">تأكيد البريد الإلكتروني</h1>
        <p className="text-gray-500 mt-2 text-sm">
          تم إرسال كود تحقق مكون من 6 أرقام إلى
        </p>
        <p className="text-blue-600 font-medium mt-1 text-sm direction-ltr">{email}</p>
      </div>

      {/* رسائل */}
      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-green-700 text-sm font-medium">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* خانات الكود */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6" dir="ltr">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={loading}
              className={`w-11 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all
                ${digit
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-gray-50'
                }
                ${error ? 'border-red-400 bg-red-50' : ''}
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                disabled:opacity-50`}
            />
          ))}
        </div>

        {/* زر التحقق */}
        <button
          type="submit"
          disabled={loading || code.join('').length !== 6}
          className="btn-primary w-full text-base py-3 mb-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              جاري التحقق...
            </span>
          ) : (
            'تأكيد الكود ✅'
          )}
        </button>
      </form>

      {/* إعادة الإرسال */}
      <div className="text-center">
        <p className="text-gray-500 text-sm mb-2">لم يصلك الكود؟</p>
        {countdown > 0 ? (
          <p className="text-gray-400 text-sm">
            إعادة الإرسال بعد <span className="font-bold text-blue-600">{countdown}</span> ثانية
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50"
          >
            {resending ? 'جاري الإرسال...' : '📩 إعادة إرسال الكود'}
          </button>
        )}
      </div>

      {/* نصائح */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <p className="text-xs text-gray-500 font-medium mb-2">💡 نصائح:</p>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• تحقق من مجلد الـ Spam/Junk لو مالقتش الرسالة</li>
          <li>• الكود صالح لمدة 15 دقيقة فقط</li>
          <li>• يمكنك لصق الكود مباشرة (Ctrl+V)</li>
        </ul>
      </div>
    </div>
  );
};

export default VerifyEmailPage;