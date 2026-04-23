import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-l from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            أفضل المنتجات <br />
            بأفضل الأسعار 🎯
          </h1>
          <p className="text-lg text-blue-100 mb-8">
            اكتشف مجموعتنا المميزة من المنتجات عالية الجودة مع شحن سريع وخدمة عملاء ممتازة
          </p>
          <div className="flex gap-4">
            <Link to="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
              تسوق الآن
            </Link>
            <Link to="/categories" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
              اكتشف المزيد
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;