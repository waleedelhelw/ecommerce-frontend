import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTrendingUp } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section
      className="relative bg-gradient-to-l from-purple-600 via-indigo-600 to-purple-800 text-white overflow-hidden"
      aria-label="القسم الترحيبي"
    >
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-10 right-10 w-52 h-52 sm:w-72 sm:h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 sm:w-96 sm:h-96 bg-pink-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-12 sm:py-16 lg:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 sm:px-4 py-1.5 rounded-full mb-5 sm:mb-6">
            <span className="text-xl sm:text-2xl" aria-hidden="true">🎉</span>
            <span className="text-xs sm:text-sm font-medium">أهلاً بك في تسوّق</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold mb-4 leading-tight">
            تسوّق بثقة <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              واربح من بيعك
            </span>
            <span aria-hidden="true">🛍️</span>
          </h1>

          <p className="text-sm sm:text-lg text-purple-100 mb-6 sm:mb-8 leading-relaxed">
            اكتشف آلاف المنتجات من بائعين موثوقين في مصر، أو افتح متجرك الإلكتروني الخاص وابدأ في البيع وكسب المال بكل سهولة وأمان.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 bg-white text-purple-700 px-6 sm:px-8 py-3.5 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              aria-label="تسوّق الآن - تصفح كل المنتجات"
            >
              <FiShoppingBag size={20} aria-hidden="true" />
              تسوّق الآن
            </Link>
            <Link
              to="/register-seller"
              className="flex items-center justify-center gap-2 border-2 border-white text-white px-6 sm:px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-all hover:-translate-y-0.5"
              aria-label="افتح متجرك الإلكتروني مجاناً"
            >
              <FiTrendingUp size={20} aria-hidden="true" />
              افتح متجرك
            </Link>
          </div>

          <dl className="grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:gap-6 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/20">
            <div>
              <dt className="text-xs sm:text-sm text-purple-200 order-2">منتج متنوع</dt>
              <dd className="text-2xl sm:text-3xl font-bold">+1000</dd>
            </div>
            <div>
              <dt className="text-xs sm:text-sm text-purple-200 order-2">متجر موثوق</dt>
              <dd className="text-2xl sm:text-3xl font-bold">+50</dd>
            </div>
            <div>
              <dt className="text-xs sm:text-sm text-purple-200 order-2">دعم متواصل</dt>
              <dd className="text-2xl sm:text-3xl font-bold">24/7</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;