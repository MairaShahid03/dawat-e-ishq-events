import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryShowcase from "@/components/CategoryShowcase";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <CategoryShowcase />
    <GallerySection />
    <TestimonialsSection />
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Index;
