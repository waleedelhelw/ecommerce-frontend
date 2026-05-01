import { Link } from 'react-router-dom';
import { FiShoppingBag, FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
                <FiShoppingBag className="text-white" size={22} />
              </div>
              <span className="text-2xl font-extrabold text-white">تسوّق</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              منصة التسوق الإلكتروني الأولى. اشترِ من آلاف المنتجات أو افتح متجرك الخاص واربح من بيع منتجاتك.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors">
                <FiFacebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors">
                <FiInstagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors">
                <FiTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-purple-400 transition-colors">الرئيسية</Link></li>
              <li><Link to="/products" className="hover:text-purple-400 transition-colors">المنتجات</Link></li>
              <li><Link to="/categories" className="hover:text-purple-400 transition-colors">التصنيفات</Link></li>
              <li><Link to="/sellers" className="hover:text-purple-400 transition-colors">المتاجر</Link></li>
              <li><Link to="/register-seller" className="hover:text-purple-400 transition-colors">افتح متجرك 🏪</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-bold mb-4">حسابي</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/profile" className="hover:text-purple-400 transition-colors">الملف الشخصي</Link></li>
              <li><Link to="/orders" className="hover:text-purple-400 transition-colors">طلباتي</Link></li>
              <li><Link to="/wishlist" className="hover:text-purple-400 transition-colors">المفضلة</Link></li>
              <li><Link to="/cart" className="hover:text-purple-400 transition-colors">السلة</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <FiMail size={14} className="text-purple-400" />
                <span>info@tasawwaq.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone size={14} className="text-purple-400" />
                <span>01234567890</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMapPin size={14} className="text-purple-400" />
                <span>القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} <span className="text-purple-400 font-semibold">تسوّق</span>. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;