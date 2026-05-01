import { Link } from 'react-router-dom';
import { FiHome, FiSearch, FiShoppingBag } from 'react-icons/fi';
import SEO from '../../components/common/SEO';

const NotFoundPage = () => {
  return (
    <>
      <SEO
        title="الصفحة غير موجودة - 404"
        description="الصفحة التي تبحث عنها غير موجودة. عُد للصفحة الرئيسية أو ابحث عن المنتجات."
        url="/404"
        noindex={true}
      />

      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="text-9xl mb-4">🔍</div>

          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            404
          </h1>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">الصفحة غير موجودة</h2>

          <p className="text-gray-500 mb-8">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها لمكان آخر.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="flex items-center gap-2 btn-primary"
            >
              <FiHome size={18} />
              العودة للرئيسية
            </Link>

            <Link
              to="/products"
              className="flex items-center gap-2 btn-outline"
            >
              <FiShoppingBag size={18} />
              تصفّح المنتجات
            </Link>
          </div>

          {/* اقتراحات */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 font-medium">جرّب البحث في:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/categories" className="text-sm text-purple-600 hover:text-purple-700 hover:underline">
                التصنيفات
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/sellers" className="text-sm text-purple-600 hover:text-purple-700 hover:underline">
                المتاجر
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/products" className="text-sm text-purple-600 hover:text-purple-700 hover:underline">
                كل المنتجات
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;