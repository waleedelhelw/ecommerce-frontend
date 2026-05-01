import { Link } from 'react-router-dom';
import { FiTarget, FiHeart, FiUsers, FiAward, FiTrendingUp, FiShield } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';

const AboutPage = () => {
  // ✅ Organization Schema
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'عن تسوّق',
    description: 'تعرّف على منصة تسوّق - السوق الإلكتروني الأول في مصر. مهمتنا، رؤيتنا، وقيمنا.',
    url: 'https://tasawwaq.vercel.app/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'تسوّق',
      alternateName: 'Tasawwaq',
      url: 'https://tasawwaq.vercel.app',
      logo: 'https://tasawwaq.vercel.app/logo.svg',
      description: 'منصة تسوّق الإلكترونية - السوق الإلكتروني الأول في مصر',
      foundingDate: '2025',
      areaServed: { '@type': 'Country', name: 'Egypt' },
    },
  };

  // ✅ Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://tasawwaq.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'عن تسوّق', item: 'https://tasawwaq.vercel.app/about' },
    ],
  };

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [aboutSchema, breadcrumbSchema],
  };

  const values = [
    { icon: FiShield, title: 'الثقة والأمان', desc: 'نضمن لك تجربة تسوق آمنة 100% مع كل عملية شراء أو بيع' },
    { icon: FiHeart, title: 'خدمة العملاء', desc: 'فريق دعم متخصص متاح على مدار الساعة لخدمتك' },
    { icon: FiTrendingUp, title: 'النمو المستمر', desc: 'نطور المنصة باستمرار لنقدم لك أفضل تجربة تسوق' },
    { icon: FiUsers, title: 'مجتمع موثوق', desc: 'بائعين موثقين ومنتجات مضمونة الجودة' },
  ];

  const stats = [
    { number: '+1000', label: 'منتج متنوع' },
    { number: '+50', label: 'متجر موثوق' },
    { number: '+5000', label: 'عميل سعيد' },
    { number: '100%', label: 'دفع آمن' },
  ];

  return (
    <>
      <SEO
        title="عن تسوّق"
        description="تعرّف على منصة تسوّق - السوق الإلكتروني الأول في مصر. اكتشف رؤيتنا ومهمتنا في توفير تجربة تسوق آمنة وموثوقة لكل المصريين."
        keywords="عن تسوق, من نحن, تسوق مصر, منصة تسوق, متجر الكتروني مصري, شركة تسوق"
        url="/about"
        structuredData={combinedSchema}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'عن تسوّق' }]} />

        {/* Hero */}
        <section className="text-center mb-16 py-12 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            عن تسوّق
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
            منصة التسوق الإلكتروني الأولى في مصر - نربط بين المشترين والبائعين في تجربة تسوق سهلة وآمنة
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <article className="bg-white border rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <FiTarget className="text-purple-600" size={28} aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold mb-3">مهمتنا</h2>
            <p className="text-gray-600 leading-relaxed">
              توفير منصة تسوق إلكتروني موثوقة وسهلة الاستخدام لكل المصريين، تتيح للجميع البيع والشراء بكل أمان وراحة. نسعى لتمكين رواد الأعمال وأصحاب المتاجر الصغيرة من الوصول لعملاء جدد عبر مصر كلها.
            </p>
          </article>

          <article className="bg-white border rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <FiAward className="text-indigo-600" size={28} aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold mb-3">رؤيتنا</h2>
            <p className="text-gray-600 leading-relaxed">
              أن نصبح المنصة الأولى للتجارة الإلكترونية في مصر والشرق الأوسط، وأن نكون الخيار الأول للمشترين والبائعين الباحثين عن تجربة تسوق إلكتروني متميزة وآمنة بأفضل الأسعار.
            </p>
          </article>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 mb-16 text-white">
          <h2 className="text-3xl font-bold text-center mb-8">أرقامنا تتحدث عنا</h2>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <dd className="text-4xl font-extrabold mb-2">{stat.number}</dd>
                <dt className="text-sm text-purple-100">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-2">قيمنا</h2>
          <p className="text-center text-gray-500 mb-10">المبادئ التي نلتزم بها في كل ما نقدمه</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <article key={idx} className="bg-white border rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-purple-600" size={24} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-500">{value.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">انضم إلى عائلة تسوّق</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            ابدأ رحلتك معنا الآن - سواء كنت مشتري تبحث عن أفضل المنتجات، أو بائع تريد توسيع عملك
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="btn-primary px-8 py-3">
              تسوّق الآن
            </Link>
            <Link to="/register-seller" className="btn-outline px-8 py-3">
              افتح متجرك مجاناً
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;