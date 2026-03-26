import { motion } from "framer-motion";
import heroMehndi from "@/assets/hero-mehndi.jpg";
import heroBaraat from "@/assets/hero-baraat.jpg";
import heroWalima from "@/assets/hero-walima.jpg";
import heroIftar from "@/assets/hero-iftar.jpg";
import catBirthday from "@/assets/cat-birthday.jpg";
import catShower from "@/assets/cat-shower.jpg";

const images = [
  { src: heroMehndi, alt: "Mehndi Celebration", category: "Wedding" },
  { src: heroBaraat, alt: "Grand Baraat", category: "Wedding" },
  { src: heroWalima, alt: "Elegant Walima", category: "Wedding" },
  { src: heroIftar, alt: "Iftar Gathering", category: "Ramadan" },
  { src: catBirthday, alt: "Birthday Celebration", category: "Birthday" },
  { src: catShower, alt: "Bridal Shower", category: "Shower" },
];

const GallerySection = () => (
  <section id="gallery" className="section-padding bg-background">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">Our Portfolio</p>
        <h2 className="font-heading text-3xl md:text-5xl text-noir font-bold mb-4">Featured Gallery</h2>
        <div className="gold-divider" />
      </motion.div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="break-inside-avoid group relative rounded-xl overflow-hidden"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/40 transition-colors duration-300 flex items-end">
              <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-gold text-xs tracking-wider uppercase">{img.category}</span>
                <p className="text-ivory font-heading text-lg">{img.alt}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default GallerySection;
