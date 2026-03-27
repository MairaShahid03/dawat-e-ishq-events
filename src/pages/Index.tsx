import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import heroMehndi from "@/assets/hero-mehndi.jpg";
import heroBaraat from "@/assets/hero-baraat.jpg";
import heroIftar from "@/assets/hero-iftar.jpg";

const highlights = [
  { src: heroMehndi, label: "Mehndi Celebrations" },
  { src: heroBaraat, label: "Grand Baraat" },
  { src: heroIftar, label: "Ramadan Setups" },
];

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />

    {/* Introduction */}
    <section className="section-padding bg-background">
      <div className="container mx-auto text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">About Us</p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold mb-6">
            Dawat-e-Ishq
          </h2>
          <div className="gold-divider mb-6" />
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            Dawat-e-Ishq is a premium event planning company based in Karachi, specializing in
            weddings, Ramadan events, and luxury celebrations. We craft unforgettable moments
            with elegance, tradition, and meticulous attention to every detail.
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
          <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">Our Expertise</p>
          <h2 className="font-heading text-3xl md:text-4xl text-ivory font-bold">What We Do Best</h2>
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
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading text-xl text-ivory font-bold">{item.label}</h3>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/gallery" className="btn-luxury-outline text-ivory border-ivory/30 hover:bg-ivory/10 hover:text-ivory">
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>

    {/* Contact */}
    <section id="contact" className="section-padding bg-background">
      <div className="container mx-auto text-center max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">Get in Touch</p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold mb-6">Contact Us</h2>
          <div className="gold-divider mb-8" />

          <div className="space-y-4">
            <a
              href="tel:03282681668"
              className="flex items-center justify-center gap-3 text-foreground hover:text-gold transition-colors font-body text-lg"
            >
              <Phone size={20} className="text-gold" />
              0328-2681668
            </a>

            <a
              href="https://wa.me/923282681668"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 btn-luxury text-base"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>

            <a
              href="https://instagram.com/dawateishq"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gold hover:text-gold-light transition-colors font-body"
            >
              @dawateishq on Instagram
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
    <WhatsAppButton />
  </div>
);

export default Index;
