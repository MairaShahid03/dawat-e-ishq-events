import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  event: string;
  text: string;
  rating: number;
  image?: string;
  role?: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Ayesha & Bilal",
    event: "Wedding — Baraat & Walima",
    text: "Mehfil-e-Ishq made our wedding a fairy tale. Every detail was perfect, from the floral arrangements to the lighting. Our guests still talk about it!",
    rating: 5,
    role: "Bride & Groom",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    id: "2",
    name: "Fatima Khan",
    event: "Ramadan Iftar Gathering",
    text: "The most beautifully organized iftar we've ever hosted. The décor, the ambiance, the food — everything was beyond our expectations.",
    rating: 5,
    role: "Event Organizer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    id: "3",
    name: "Haris & Sana",
    event: "Mehndi Night",
    text: "Our mehndi was absolutely magical. The team understood our vision perfectly and brought it to life with such elegance and creativity.",
    rating: 5,
    role: "Couple",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  },
  {
    id: "4",
    name: "Zainab & Ahmed",
    event: "Nikkah Ceremony",
    text: "Exceptional service from start to finish. The attention to detail and professionalism was unmatched. Highly recommended!",
    rating: 5,
    role: "Bride & Groom",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
];

const PremiumTestimonialsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const navigate = (dir: number) => {
    setCurrent((p) => (p + dir + testimonials.length) % testimonials.length);
    setAutoPlay(false);
  };

  const t = testimonials[current];

  return (
    <section className="section-padding bg-noir relative overflow-hidden">
      {/* Subtle animated background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">
            Client Stories
          </p>
          <h2 className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4">
            What Our Clients Say
          </h2>
          <div className="gold-divider" />
        </motion.div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-2xl p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-gold/30 flex-shrink-0"
                  >
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>

                {/* Testimonial Content */}
                <div className="flex-1">
                  {/* Quote Icon */}
                  <Quote className="text-gold/40 mb-4" size={40} />

                  {/* Testimonial Text */}
                  <p className="text-ivory/80 font-body text-lg md:text-xl leading-relaxed italic mb-6">
                    "{t.text}"
                  </p>

                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <Star
                          size={16}
                          className="text-gold fill-gold"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Client Info */}
                  <div>
                    <h4 className="text-gold font-heading text-lg font-semibold">
                      {t.name}
                    </h4>
                    <p className="text-ivory/60 text-sm font-body">{t.role}</p>
                    <p className="text-ivory/50 text-sm font-body mt-1">
                      {t.event}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-10">
            {/* Previous Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-3 rounded-full border border-gold/30 text-ivory/50 hover:text-gold hover:border-gold/60 transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </motion.button>

            {/* Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => {
                    setCurrent(i);
                    setAutoPlay(false);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-gold w-8 h-2"
                      : "bg-ivory/20 w-2 h-2 hover:bg-ivory/40"
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(1)}
              className="p-3 rounded-full border border-gold/30 text-ivory/50 hover:text-gold hover:border-gold/60 transition-all duration-300"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>

          {/* Auto-play Toggle */}
          <div className="text-center mt-8">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="text-ivory/50 hover:text-gold text-sm font-body transition-colors"
            >
              {autoPlay ? "⏸ Pause" : "▶ Play"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumTestimonialsCarousel;
