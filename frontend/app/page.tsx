import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import KeyInitiativesSection from "@/components/home/KeyInitiativesSection";
import UpcomingEventsSection from "@/components/home/UpcomingEventsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <KeyInitiativesSection />
        <UpcomingEventsSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}
