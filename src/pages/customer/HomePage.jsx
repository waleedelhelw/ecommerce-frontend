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
  return (
    <>
      <SEO
        title="تسوّق — سوق مفتوح للبيع والشراء"
        description="تسوّق - سوق مفتوح للبيع والشراء. اشترِ من آلاف المنتجات بأفضل الأسعار من بائعين موثوقين، أو افتح متجرك الخاص واربح من بيع منتجاتك بسهولة وأمان."
        keywords="تسوق, تسوق اونلاين, متجر الكتروني, شراء, بيع, افتح متجرك, تجارة الكترونية, tasawwaq, متجر الكتروني مصر, توصيل لكل مصر, منتجات مصرية"
        url="/"
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
