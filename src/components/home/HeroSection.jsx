import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiTrendingUp, FiSearch } from 'react-icons/fi';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section
      className="relative bg-gradient-to-br from-purple-700 via-indigo-600 to-purple-900 text-white overflow-hidden"
      aria-label="القسم الترحيبي"
    >
      <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-16 lg:py-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full mb-4">
            <span className="text-sm" aria-hidden="true">🎉</span>
            <span className="text-xs font-medium">أهلاً بك في تسوّق</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight">
            تسوّق بثقة
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-orange-200 to-pink-300 bg-clip-text text-transparent">
              واربح من بيعك
            </span>
          </h1>

          <p className="text-sm sm:text-base text-purple-100/90 mb-6 leading-relaxed max-w-lg mx-auto">
            اكتشف آلاف المنتجات من بائعين موثوقين في مصر، أو افتح متجرك الإلكتروني الخاص وابدأ في البيع وكسب المال بكل سهولة وأمان.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-5">
            <div className="flex items-center bg-white/15 border border-white/20 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-yellow-400/50 focus-within:border-yellow-400/50 transition-all">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منتجات..."
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-white/50 outline-none text-sm"
                aria-label="ابحث في المتجر"
              />
              <button
                type="submit"
                className="flex items-center gap-1 bg-yellow-400 text-purple-900 px-4 py-3 m-1 rounded-lg font-bold hover:bg-yellow-300 transition-all text-sm"
                aria-label="بحث"
              >
                <FiSearch size={16} />
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-lg active:scale-95"
              aria-label="تسوّق الآن - تصفح كل المنتجات"
            >
              <FiShoppingBag size={18} aria-hidden="true" />
              تسوّق الآن
            </Link>
            <Link
              to="/register-seller"
              className="flex items-center justify-center gap-2 border-2 border-white/40 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 hover:border-white/70 transition-all active:scale-95"
              aria-label="افتح متجرك الإلكتروني مجاناً"
            >
              <FiTrendingUp size={18} aria-hidden="true" />
              افتح متجرك
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 sm:gap-10 mt-8 pt-6 border-t border-white/10">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-yellow-300">+1000</div>
              <div className="text-xs text-purple-200 mt-0.5">منتج</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-yellow-300">+50</div>
              <div className="text-xs text-purple-200 mt-0.5">متجر</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-yellow-300">24/7</div>
              <div className="text-xs text-purple-200 mt-0.5">دعم</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
