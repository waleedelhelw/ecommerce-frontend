import useScrollReveal from '../../hooks/useScrollReveal';
import SEO from '../../components/common/SEO';
import HeroSection from '../../components/home/HeroSection';
import CategoriesSection from '../../components/home/CategoriesSection';
import FeaturedSection from '../../components/home/FeaturedSection';
import NewArrivalsSection from '../../components/home/NewArrivalsSection';
import TopSellersSection from '../../components/home/TopSellersSection';
import WhyUsSection from '../../components/home/WhyUsSection';
import NewsletterSection from '../../components/home/NewsletterSection';

const RevealSection = ({ children, className = '', delay = '0s' }) => {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: delay }}>
      {children}
    </div>
  );
};

const HomePage = () => {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'تسوّق',
    alternateName: 'Tasawwaq',
    url: 'https://www.tasawwaq.store',
    description: 'منصة التسوق الإلكتروني الأولى. اشترِ من آلاف المنتجات أو افتح متجرك الخاص.',
    inLanguage: 'ar-EG',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.tasawwaq.store/products?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'تسوّق',
    alternateName: 'Tasawwaq',
    url: 'https://www.tasawwaq.store',
    logo: 'https://www.tasawwaq.store/logo.svg',
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

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [websiteSchema, organizationSchema],
  };

  return (
    <>
      <SEO
        title="تسوّق — منصة التسوق الإلكتروني الأولى في مصر | Tasawwaq"
        description="منصة التسوق الإلكتروني الأولى في مصر. اشترِ من آلاف المنتجات بأفضل الأسعار من بائعين موثوقين، أو افتح متجرك الخاص واربح من بيع منتجاتك بسهولة وأمان."
        keywords="تسوق, تسوق اونلاين, متجر الكتروني, شراء, بيع, افتح متجرك, تجارة الكترونية, tasawwaq, متجر الكتروني مصر, توصيل لكل مصر, منتجات مصرية"
        url="/"
        structuredData={combinedSchema}
      />

      <div className="overflow-x-hidden">
        <HeroSection />

        <RevealSection>
          <CategoriesSection />
        </RevealSection>

        <RevealSection delay="0.1s">
          <FeaturedSection />
        </RevealSection>

        <RevealSection delay="0.2s">
          <NewArrivalsSection />
        </RevealSection>

        <RevealSection delay="0.1s">
          <TopSellersSection />
        </RevealSection>

        <RevealSection delay="0.2s">
          <WhyUsSection />
        </RevealSection>

        <RevealSection>
          <NewsletterSection />
        </RevealSection>
      </div>
    </>
  );
};

export default HomePage;
