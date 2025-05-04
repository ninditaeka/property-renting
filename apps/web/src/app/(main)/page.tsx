import { Header } from '@/components/Header';
import HeroSection from '@/components/LandingPage/HeroSection';
import { Footer } from '@/components/Footer';
import FormSearch from '@/components/LandingPage/FormSearch';
import PropertyTypes from '@/components/LandingPage/PropertyTypes';
import PopularExplore from '@/components/LandingPage/PopularExplore';
import Promotion from '@/components/LandingPage/Promotion';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FormSearch containerClassName={'w-4/6'} />
      <Promotion />
      <PropertyTypes />
      <PopularExplore />
    </main>
  );
}
