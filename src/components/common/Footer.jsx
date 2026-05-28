import { Link } from 'react-router-dom';
import {
  FiShoppingBag,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiTwitter
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // ✅ روابط السوشيال ميديا - عدّلها بلينكاتك الحقيقية
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/tasawwaq',
      icon: FiFacebook,
      label: 'تابعنا على فيسبوك'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/tasawwaq',
      icon: FiInstagram,
      label: 'تابعنا على انستجرام'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/tasawwaq',
      icon: FiTwitter,
      label: 'تابعنا على تويتر'
    },
  ];

  return (
    <footer
      className="bg-gray-900 text-gray-300 mt-auto"
      role="contentinfo"
      aria-label="تذييل الصفحة"
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* About */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 mb-4"
              aria-label="تسوّق - الصفحة الرئيسية"
            >
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md"
                aria-hidden="true"
              >
                <FiShoppingBag className="text-white" size={22} />
              </div>
              <span className="text-2xl font-extrabold text-white">تسوّق</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              منصة التسوق الإلكتروني الأولى في مصر. اشترِ من آلاف المنتجات أو افتح متجرك الخاص واربح من بيع منتجاتك.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="روابط سريعة">
            <h2 className="text-white font-bold mb-4 text-base">روابط سريعة</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-purple-400 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-purple-400 transition-colors">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-purple-400 transition-colors">
                  التصنيفات
                </Link>
              </li>
              <li>
                <Link to="/sellers" className="hover:text-purple-400 transition-colors">
                  المتاجر
                </Link>
              </li>
              <li>
                <Link
                  to="/register-seller"
                  className="hover:text-purple-400 transition-colors"
                >
                  <span aria-hidden="true">🏪</span> افتح متجرك
                </Link>
              </li>
            </ul>
          </nav>

          {/* ✅ Account & Legal */}
          <nav aria-label="حسابي والصفحات القانونية">
            <h2 className="text-white font-bold mb-4 text-base">حسابي</h2>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <Link to="/profile" className="hover:text-purple-400 transition-colors">
                  الملف الشخصي
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-purple-400 transition-colors">
                  طلباتي
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-purple-400 transition-colors">
                  المفضلة
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-purple-400 transition-colors">
                  السلة
                </Link>
              </li>
            </ul>

            {/* ✅ Legal Links - مهم جداً للـ SEO */}
            <h3 className="text-white font-bold mb-3 text-sm">معلومات</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-purple-400 transition-colors">
                  عن تسوّق
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-purple-400 transition-colors">
                  مميزات تسوّق
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-purple-400 transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-purple-400 transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-purple-400 transition-colors">
                  الأسئلة الشائعة
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-white font-bold mb-4 text-base">تواصل معنا</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:info@tasawwaq.com"
                  className="flex items-center gap-2 hover:text-purple-400 transition-colors"
                  aria-label="راسلنا عبر البريد الإلكتروني"
                >
                  <FiMail size={14} className="text-purple-400" aria-hidden="true" />
                  <span>info@tasawwaq.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+201234567890"
                  className="flex items-center gap-2 hover:text-purple-400 transition-colors"
                  aria-label="اتصل بنا"
                  dir="ltr"
                >
                  <FiPhone size={14} className="text-purple-400" aria-hidden="true" />
                  <span>+20 123 456 7890</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiMapPin size={14} className="text-purple-400" aria-hidden="true" />
                <address className="not-italic">القاهرة، مصر</address>
              </li>
            </ul>

            {/* ✅ Help & Shipping */}
            <h3 className="text-white font-bold mb-3 mt-6 text-sm">مساعدة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="hover:text-purple-400 transition-colors">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-purple-400 transition-colors">
                  الشحن والتوصيل
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-purple-400 transition-colors">
                  سياسة الإرجاع
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>
            © {currentYear}{' '}
            <Link
              to="/"
              className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
            >
              تسوّق
            </Link>
            . جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;