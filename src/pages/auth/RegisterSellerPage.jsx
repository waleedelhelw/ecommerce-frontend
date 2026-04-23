import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerSeller } from '../../api/authService';
import useAuth from '../../hooks/useAuth';
import ErrorMessage from '../../components/common/ErrorMessage';

const RegisterSellerPage = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('كلمة المرور غير متطابقة');
      return;
    }

    try {
      setLoading(true);
      const response = await registerSeller(form);

      if (response.success && response.data) {
        authLogin(response.data);
        navigate('/seller/pending-approval');
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
        {/* العنوان */}
        <div className="text-center mb-6">
          <span className="text-4xl">🏪</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">تسجيل كبائع</h1>
          <p className="text-gray-500 mt-1">أنشئ متجرك وابدأ البيع على منصتنا</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* بيانات شخصية */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">البيانات الشخصية</h3>

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
                placeholder="example@email.com"
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
                placeholder="كلمة المرور"
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

          {/* بيانات المتجر */}
          <div className="bg-green-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-green-700">بيانات المتجر</h3>

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

          {/* زر التسجيل */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
          >
            {loading ? 'جاري التسجيل...' : '🏪 تسجيل كبائع'}
          </button>
        </form>

        {/* روابط */}
        <div className="mt-6 text-center text-sm text-gray-500 space-y-2">
          <p>
            عندك حساب بالفعل؟{' '}
            <Link to="/login" className="text-green-600 hover:underline font-medium">
              تسجيل الدخول
            </Link>
          </p>
          <p>
            عايز تسجل كعميل؟{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              تسجيل عميل
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSellerPage;