import { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { ParallaxHero } from '../components/ParallaxHero';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { SubscriptionsSection } from '../components/sections/SubscriptionsSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { CTASection } from '../components/sections/CTASection';
import { FAQSection } from '../components/sections/FAQSection';
import { LocationSection } from '../components/sections/LocationSection';
import { TattooSection } from '../components/sections/TattooSection';
import { Footer } from '../components/sections/Footer';

export const Home = () => {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, []);

  return (
    <div className="bg-bg-darkest min-h-screen text-[#0B0908] selection:bg-[#5E308A] selection:text-white relative">
      {/* Root-Level Navbar to ensure it never gets trapped in any parent stacking context */}
      <Navbar />

      <main className="w-full overflow-hidden">
        <ParallaxHero />
        <AboutSection />
        <ServicesSection />
        <SubscriptionsSection />
        <TestimonialsSection />
        <CTASection />
        <FAQSection />
        <LocationSection />
        <TattooSection />
      </main>
      <Footer />
    </div>
  );
};
