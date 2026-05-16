import { Link } from 'react-router-dom';
import {
  FiUserPlus, FiPackage, FiDollarSign, FiTrendingUp,
  FiCheck, FiShield, FiUsers, FiTarget, FiAward, FiHeadphones
} from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';

const HowToSellPage = () => {
  const steps = [
    { num: '1', icon: FiUserPlus, title: 'سجّل كبائع', desc: 'أنشئ حسابك كبائع مجاناً وأدخل بيانات متجرك (الاسم، الوصف، الفئة)' },
    { num: '2', icon: FiCheck, title: 'انتظر الموافقة', desc: 'فريقنا هيراجع طلبك خلال 24-48 ساعة ويفعّل متجرك' },
    { num: '3', icon: FiPackage, title: 'أضف منتجاتك', desc: 'ارفع صور منتجاتك، اكتب الوصف، حدد السعر والكمية وابدأ البيع' },
    { num: '4', icon: FiDollarSign, title: 'اربح من بيعك', desc: 'استلم طلباتك، شحن المنتجات، واستلم أرباحك مباشرة في حسابك' },
  ];

  const benefits = [
    { icon: FiShield, title: 'منصة موثوقة', desc: 'منصة آمنة 100% بآلاف العملاء النشطين' },
    { icon: FiUsers, title: 'وصول لعملاء جدد', desc: 'اوصل لآلاف العملاء في كل محافظات مصر' },
    { icon: FiDollarSign, title: 'مجاني تماماً', desc: 'فتح المتجر وإضافة المنتجات مجاني، عمولة بسيطة فقط على المبيعات' },
    { icon: FiTarget, title: 'أدوات تسويقية', desc: 'لوحة تحكم متكاملة لإدارة منتجاتك وطلباتك ومتابعة مبيعاتك' },
    { icon: FiHeadphones, title: 'دعم متواصل', desc: 'فريق دعم متخصص لمساعدة البائعين على مدار الساعة' },
    { icon: FiAward, title: 'بناء سمعة قوية', desc: 'نظام تقييمات يساعدك تبني ثقة مع عملائك وتزيد مبيعاتك' },
  ];

  // ✅ HowTo Schema
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'كيف تفتح متجر إلكتروني على تسوّق',
    description: 'دليل خطوة بخطوة لفتح متجرك الإلكتروني على منصة تسوّق وبدء البيع',
    totalTime: 'PT24H',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'EGP', value: '0' },
    step: steps.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.title,
      text: s.desc,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://tasawwaq.store' },
      { '@type': 'ListItem', position: 2, name: 'افتح متجرك', item: 'https://tasawwaq.store/how-to-sell' },
    ],
  };

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [howToSchema, breadcrumbSchema],
  };

  return (
    <>
      <SEO
        title="افتح متجرك الإلكتروني مجاناً"
        description="دليلك الكامل لفتح متجر إلكتروني في مصر مجاناً على تسوّق. ابدأ البيع اونلاين في 4 خطوات بسيطة واربح من منتجاتك."
        keywords="افتح متجر الكتروني, كيف أفتح متجر, البيع اونلاين, متجر مجاني, ربح من البيع, تجارة الكترونية مصر, افتح متجرك"
        url="/how-to-sell"
        structuredData={combinedSchema}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'افتح متجرك' }]} />

        {/* Hero */}
        <section className="text-center mb-16 py-12 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-2xl">
          <div className="inline-block bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span aria-hidden="true">🎉</span> مجاني تماماً
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
            افتح متجرك الإلكتروني <br />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              في 4 خطوات بس
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4 mb-6">
            ابدأ رحلتك في التجارة الإلكترونية مع تسوّق - وصّل منتجاتك لآلاف العملاء في كل محافظات مصر
          </p>
          <Link
            to="/register-seller"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg"
          >
            <FiTrendingUp size={20} aria-hidden="true" />
            ابدأ الآن مجاناً
          </Link>
        </section>

        {/* Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-2">كيف تبدأ؟</h2>
          <p className="text-center text-gray-500 mb-10">4 خطوات بسيطة لفتح متجرك</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.num}
                  className="relative bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {step.num}
                  </div>
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mt-2">
                    <Icon className="text-purple-600" size={28} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-2">ليه تختار تسوّق؟</h2>
          <p className="text-center text-gray-500 mb-10">مميزات تجعلنا الخيار الأفضل لبائعين مصر</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={idx}
                  className="bg-white border rounded-xl p-6 hover:shadow-md hover:border-purple-200 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-purple-600" size={24} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Pricing/Commission */}
        <section className="mb-16 bg-gray-50 rounded-2xl p-8 lg:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">شفافية كاملة في الرسوم</h2>
            <p className="text-gray-600 mb-8">
              مفيش رسوم خفية أو مفاجآت. ادفع فقط عند البيع
            </p>

            <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="mb-4">
                <span className="text-5xl font-extrabold text-purple-600">0</span>
                <span className="text-2xl font-bold text-gray-700"> ج.م</span>
              </div>
              <p className="text-gray-500 mb-6">للتسجيل وفتح المتجر</p>

              <ul className="text-right space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <FiCheck className="text-green-500 flex-shrink-0" aria-hidden="true" />
                  <span>فتح متجر مجاني تماماً</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <FiCheck className="text-green-500 flex-shrink-0" aria-hidden="true" />
                  <span>إضافة عدد غير محدود من المنتجات</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <FiCheck className="text-green-500 flex-shrink-0" aria-hidden="true" />
                  <span>لوحة تحكم متكاملة</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <FiCheck className="text-green-500 flex-shrink-0" aria-hidden="true" />
                  <span>عمولة بسيطة على المبيعات فقط</span>
                </li>
              </ul>

              <Link
                to="/register-seller"
                className="block bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
              >
                ابدأ الآن
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Quick Links */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-2">عندك أسئلة؟</h2>
          <p className="text-center text-gray-500 mb-8">
            شوف الأسئلة الشائعة أو تواصل معانا مباشرة
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/faq" className="btn-outline px-6 py-3">
              الأسئلة الشائعة
            </Link>
            <Link to="/contact" className="btn-outline px-6 py-3">
              تواصل معنا
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 lg:p-12 text-white text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            جاهز تبدأ رحلتك في البيع؟
          </h2>
          <p className="text-purple-100 mb-6 max-w-xl mx-auto">
            انضم لآلاف البائعين على تسوّق وابدأ في كسب المال من منتجاتك اليوم
          </p>
          <Link
            to="/register-seller"
            className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-3.5 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg"
          >
            <FiTrendingUp size={20} aria-hidden="true" />
            افتح متجرك الآن
          </Link>
        </section>
      </div>
    </>
  );
};

export default HowToSellPage;