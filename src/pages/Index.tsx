import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, TrendingUp, Star } from "lucide-react";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

import heroMehndi from "@/assets/hero-mehndi.jpg";
import heroBaraat from "@/assets/hero-baraat.jpg";
import heroIftar from "@/assets/hero-iftar.jpg";

import { THEMES } from "@/lib/eventData";

import PremiumTestimonialsCarousel from "@/components/PremiumTestimonialsCarousel";
import GuestInvitationSystem from "@/components/GuestInvitationSystem";
import InteractiveVenueMap from "@/components/InteractiveVenueMap";
import MoodBoardCreator from "@/components/MoodBoardCreator";
import AIDecorPreviewGenerator from "@/components/AIDecorPreviewGenerator";

const highlights = [
  { src: heroMehndi, label: "Mehndi Celebrations" },
  { src: heroBaraat, label: "Grand Baraat" },
  { src: heroIftar, label: "Ramadan Setups" },
];

const trendingEvents = [
  { name: "Royal Gold Wedding", bookings: 142, trend: "+28%", theme: "royal-gold" },
  { name: "Mughal Theme Baraat", bookings: 98, trend: "+15%", theme: "mughal" },
  { name: "Floral Pastel Nikkah", bookings: 87, trend: "+22%", theme: "floral-pastel" },
  { name: "Arabian Nights Walima", bookings: 76, trend: "+12%", theme: "arabian-nights" },
];

const popularPackages = [
  { name: "Full Event Planning", price: "PKR 300,000+", popularity: 95 },
  { name: "Mehndi + Baraat + Walima", price: "PKR 500,000+", popularity: 88 },
  { name: "Destination Wedding", price: "PKR 800,000+", popularity: 72 },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Introduction */}
      <section className="section-padding bg-noir">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">
              About Us
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold mb-6">
              Mehfil-e-Ishq
            </h2>
            <div className="gold-divider mb-6" />
            <p className="text-muted-foreground font-body text-lg leading-relaxed">
              Mehfil-e-Ishq is a premium event planning company based in Karachi,
              specializing in weddings, Ramadan events, and luxury celebrations.
              We craft unforgettable moments with elegance, tradition, and meticulous attention to detail.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="section-padding bg-noir">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">
              Our Expertise
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-ivory font-bold">
              What We Do Best
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-heading text-xl text-ivory font-bold">
                    {item.label}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="section-padding bg-noir">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">
              What's Hot
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold">
              Trending Events
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Extra Components */}
      <PremiumTestimonialsCarousel />
      <GuestInvitationSystem />
      <InteractiveVenueMap />
      <MoodBoardCreator />
      <AIDecorPreviewGenerator />

      {/* Contact */}
      <section className="section-padding bg-noir">
        <div className="container mx-auto text-center max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold font-heading text-sm uppercase mb-3">
              Get in Touch
            </p>
            <h2 className="font-heading text-3xl text-ivory font-bold mb-6">
              Contact Us
            </h2>

            <a href="tel:03282681668" className="text-ivory block">
              📞 0328-2681668
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;