import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏪</span>
              <span className="text-xl font-bold text-white">متجرنا</span>
            </div>
            <p className="text-sm text-gray-400">
              متجرك الإلكتروني المفضل لأفضل المنتجات بأفضل الأسعار
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">الرئيسية</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">المنتجات</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">التصنيفات</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-bold mb-4">حسابي</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/profile" className="hover:text-white transition-colors">الملف الشخصي</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">طلباتي</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">المفضلة</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-2 text-sm">
              <li>📧 info@store.com</li>
              <li>📱 01234567890</li>
              <li>📍 القاهرة، مصر</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} متجرنا. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;