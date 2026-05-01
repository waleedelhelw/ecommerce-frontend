import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import { registerSeller } from '../../api/authService';
import ErrorMessage from '../../components/common/ErrorMessage';

const RegisterSellerPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    storeName: '',
    storeDescription: '',
    businessEmail: '',
    businessPhone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('كلمة المرور غير متطابقة');
      return;
    }

    if (form.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    try {
      setLoading(true);
      const response = await registerSeller(form);

      if (response.success) {
        navigate('/verify-email', {
          state: {
            email: form.email,
            role: 'Seller',
          },
        });
      } else {
        setError(response.message || 'حدث خطأ في التسجيل');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(', ') ||
        'حدث خطأ في التسجيل';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Structured Data (FAQ Schema للمميزات)
  const sellerStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'افتح متجرك الإلكتروني على تسوّق',
    description: 'سجّل كبائع على تسوّق وابدأ في بيع منتجاتك بسهولة. منصة موثوقة، عمولة بسيطة، توصيل لكل مصر.',
    provider: {
      '@type': 'Organization',
      name: 'تسوّق',
      url: 'https://tasawwaq.vercel.app',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Egypt',
    },
    audience: {
      '@type': 'BusinessAudience',
      name: 'البائعين والتجار',
    },
  };

  return (
    <>
      <SEO
        title="افتح متجرك الإلكتروني مجاناً - سجّل كبائع"
        description="افتح متجرك الإلكتروني على تسوّق مجاناً وابدأ بيع منتجاتك للآلاف من العملاء في مصر. منصة موثوقة، عمولة بسيطة، أدوات سهلة."
        keywords="افتح متجرك, افتح متجر الكتروني, البيع اونلاين, متجر مجاني, كيفية البيع اونلاين, منصة بائعين, تسجيل كبائع, ربح من البيع اونلاين, متجر الكتروني مصر"
        url="/register-seller"
        structuredData={sellerStructuredData}
      />

      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
          <div className="text-center mb-6">
            <span className="text-4xl">🏪</span>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">افتح متجرك على تسوّق</h1>
            <p className="text-gray-500 mt-1">أنشئ متجرك مجاناً وابدأ البيع لآلاف العملاء</p>
          </div>

          {/* ✅ مميزات للـ SEO + الإقناع */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-green-800 mb-2">🎁 مميزات بيعك على تسوّق:</p>
            <ul className="text-xs text-green-700 space-y-1">
              <li>✅ تسجيل مجاني تماماً</li>
              <li>✅ آلاف العملاء يومياً</li>
              <li>✅ نظام تحويل أرباح آمن</li>
              <li>✅ دعم فني على مدار الساعة</li>
            </ul>
          </div>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h2 className="text-sm font-semibold text-gray-700">البيانات الشخصية</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="الاسم الكامل"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="example@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="01012345678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور *</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="كلمة المرور (6 أحرف على الأقل)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="تأكيد كلمة المرور"
                  required
                />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 space-y-3">
              <h2 className="text-sm font-semibold text-green-700">بيانات المتجر</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المتجر *</label>
                <input
                  type="text"
                  name="storeName"
                  value={form.storeName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="اسم متجرك"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وصف المتجر</label>
                <textarea
                  name="storeDescription"
                  value={form.storeDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="وصف قصير عن متجرك..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد التجاري</label>
                <input
                  type="email"
                  name="businessEmail"
                  value={form.businessEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="store@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">هاتف المتجر</label>
                <input
                  type="tel"
                  name="businessPhone"
                  value={form.businessPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="01098765432"
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-600">
                📧 سيتم إرسال كود تحقق إلى بريدك الإلكتروني لتفعيل حسابك
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
            >
              {loading ? 'جاري التسجيل...' : '🏪 افتح متجرك الآن'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 space-y-2">
            <p>
              عندك حساب بالفعل؟{' '}
              <Link to="/login" className="text-green-600 hover:underline font-medium">
                تسجيل الدخول
              </Link>
            </p>
            <p>
              عايز تسجل كعميل؟{' '}
              <Link to="/register" className="text-purple-600 hover:underline font-medium">
                تسجيل عميل
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterSellerPage;