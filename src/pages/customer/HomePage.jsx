import HeroSection from '../../components/home/HeroSection';
import CategoriesSection from '../../components/home/CategoriesSection';
import FeaturedSection from '../../components/home/FeaturedSection';
import NewArrivalsSection from '../../components/home/NewArrivalsSection';
import TopSellersSection from '../../components/home/TopSellersSection';
import WhyUsSection from '../../components/home/WhyUsSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedSection />
      <NewArrivalsSection />
      <TopSellersSection />
      <WhyUsSection />
    </div>
  );
};

export default HomePage;