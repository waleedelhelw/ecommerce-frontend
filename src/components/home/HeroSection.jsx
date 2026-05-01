import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTrendingUp } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-l from-purple-600 via-indigo-600 to-purple-800 text-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-2xl">
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full mb-6">
            <span className="text-2xl">🎉</span>
            <span className="text-sm font-medium">أهلاً بك في تسوّق</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold mb-4 leading-tight">
            تسوّق بثقة <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              واربح من بيعك
            </span>
            🛍️
          </h1>

          <p className="text-lg text-purple-100 mb-8 leading-relaxed">
            اكتشف آلاف المنتجات من بائعين موثوقين، أو افتح متجرك الخاص وابدأ في البيع وكسب المال بكل سهولة.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="flex items-center gap-2 bg-white text-purple-700 px-8 py-3.5 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <FiShoppingBag size={20} />
              تسوّق الآن
            </Link>
            <Link
              to="/register-seller"
              className="flex items-center gap-2 border-2 border-white text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-all hover:-translate-y-0.5"
            >
              <FiTrendingUp size={20} />
              افتح متجرك
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/20">
            <div>
              <p className="text-3xl font-bold">+1000</p>
              <p className="text-sm text-purple-200">منتج متنوع</p>
            </div>
            <div>
              <p className="text-3xl font-bold">+50</p>
              <p className="text-sm text-purple-200">متجر موثوق</p>
            </div>
            <div>
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-sm text-purple-200">دعم متواصل</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;