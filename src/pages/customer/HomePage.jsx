import SEO from '../../components/common/SEO';
import HeroSection from '../../components/home/HeroSection';
import CategoriesSection from '../../components/home/CategoriesSection';
import FeaturedSection from '../../components/home/FeaturedSection';
import NewArrivalsSection from '../../components/home/NewArrivalsSection';
import TopSellersSection from '../../components/home/TopSellersSection';
import WhyUsSection from '../../components/home/WhyUsSection';

const HomePage = () => {
  // ✅ WebSite Schema مع SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'تسوّق',
    alternateName: 'Tasawwaq',
    url: 'https://tasawwaq.vercel.app',
    description: 'منصة التسوق الإلكتروني الأولى. اشترِ من آلاف المنتجات أو افتح متجرك الخاص.',
    inLanguage: 'ar-EG',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://tasawwaq.vercel.app/products?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // ✅ Organization Schema (مهم للـ SEO)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'تسوّق',
    alternateName: 'Tasawwaq',
    url: 'https://tasawwaq.vercel.app',
    logo: 'https://tasawwaq.vercel.app/logo.svg',
    description: 'منصة تسوّق الإلكترونية - السوق الإلكتروني الأول في مصر للتسوق وفتح المتاجر',
    foundingDate: '2025',
    areaServed: {
      '@type': 'Country',
      name: 'Egypt',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: 'EG',
      availableLanguage: ['Arabic', 'English'],
    },
  };

  // ✅ دمج الـ Schemas
  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [websiteSchema, organizationSchema],
  };

  return (
    <>
      <SEO
        title="منصة التسوق الإلكتروني الأولى"
        description="منصة التسوق الإلكتروني الأولى في مصر. اشترِ من آلاف المنتجات بأفضل الأسعار، أو افتح متجرك الخاص واربح من بيع منتجاتك بسهولة وأمان."
        keywords="تسوق, تسوق اونلاين, متجر الكتروني, شراء, بيع, افتح متجرك, تجارة الكترونية, tasawwaq, متجر الكتروني مصر, توصيل لكل مصر"
        url="/"
        structuredData={combinedSchema}
      />

      <div>
        <HeroSection />
        <CategoriesSection />
        <FeaturedSection />
        <NewArrivalsSection />
        <TopSellersSection />
        <WhyUsSection />
      </div>
    </>
  );
};

export default HomePage;