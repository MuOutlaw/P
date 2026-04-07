import Navbar from "./_components/Navbar.tsx";
import HeroSection from "./_components/HeroSection.tsx";
import CategoriesSection from "./_components/CategoriesSection.tsx";
import FeaturesSection from "./_components/FeaturesSection.tsx";
import StatsSection from "./_components/StatsSection.tsx";
import HowItWorksSection from "./_components/HowItWorksSection.tsx";
import TestimonialsSection from "./_components/TestimonialsSection.tsx";
import CtaSection from "./_components/CtaSection.tsx";
import Footer from "./_components/Footer.tsx";

export default function Index() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
