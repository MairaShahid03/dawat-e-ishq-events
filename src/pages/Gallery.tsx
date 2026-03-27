import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";

const GALLERY_FOLDERS = [
  { name: "baraat", label: "Baraat" },
  { name: "birthday", label: "Birthday" },
  { name: "dua-e-khair", label: "Dua-e-Khair" },
  { name: "mayoun", label: "Mayoun" },
  { name: "mehndi", label: "Mehndi" },
  { name: "nikkah", label: "Nikkah" },
  { name: "qawali-night", label: "Qawali Night" },
  { name: "engagement", label: "Engagement" },
  { name: "others", label: "Others" },
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryImages, setCategoryImages] = useState<Record<string, string[]>>({});
  const [folderImages, setFolderImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [folderLoading, setFolderLoading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Load first image from each folder for category cards
  useEffect(() => {
    const loadCategoryThumbs = async () => {
      setLoading(true);
      const thumbs: Record<string, string[]> = {};

      await Promise.all(
        GALLERY_FOLDERS.map(async (folder) => {
          const { data } = await supabase.storage
            .from("gallery-images")
            .list(folder.name, { limit: 1, sortBy: { column: "name", order: "asc" } });

          if (data && data.length > 0 && data[0].name) {
            const { data: urlData } = supabase.storage
              .from("gallery-images")
              .getPublicUrl(`${folder.name}/${data[0].name}`);
            thumbs[folder.name] = [urlData.publicUrl];
          }
        })
      );

      setCategoryImages(thumbs);
      setLoading(false);
    };
    loadCategoryThumbs();
  }, []);

  // Load all images from selected folder
  const openCategory = async (folderName: string) => {
    setSelectedCategory(folderName);
    setFolderLoading(true);

    const { data } = await supabase.storage
      .from("gallery-images")
      .list(folderName, { limit: 100, sortBy: { column: "name", order: "asc" } });

    if (data) {
      const urls = data
        .filter((f) => f.name && !f.name.startsWith("."))
        .map((f) => {
          const { data: urlData } = supabase.storage
            .from("gallery-images")
            .getPublicUrl(`${folderName}/${f.name}`);
          return urlData.publicUrl;
        });
      setFolderImages(urls);
    }
    setFolderLoading(false);
  };

  const navigateLightbox = (dir: number) => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev + dir + folderImages.length) % folderImages.length;
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 bg-noir">
        <div className="container mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3"
          >
            Our Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4"
          >
            Gallery
          </motion.h1>
          <div className="gold-divider" />
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            {!selectedCategory ? (
              <motion.div
                key="categories"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-gold" size={40} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GALLERY_FOLDERS.map((folder, i) => {
                      const thumb = categoryImages[folder.name]?.[0];
                      return (
                        <motion.button
                          key={folder.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          onClick={() => openCategory(folder.name)}
                          className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-border hover:border-gold/30 transition-all duration-500"
                        >
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={folder.label}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-muted-foreground text-sm">No images yet</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="font-heading text-xl text-ivory font-bold">{folder.label}</h3>
                            <p className="text-gold text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              View Gallery →
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="folder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  onClick={() => { setSelectedCategory(null); setFolderImages([]); }}
                  className="flex items-center gap-2 text-gold hover:text-gold-light font-body mb-8 transition-colors"
                >
                  <ArrowLeft size={18} /> Back to Categories
                </button>

                <h2 className="font-heading text-2xl md:text-3xl text-foreground font-bold mb-8">
                  {GALLERY_FOLDERS.find((f) => f.name === selectedCategory)?.label}
                </h2>

                {folderLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-gold" size={40} />
                  </div>
                ) : folderImages.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground">No images in this category yet.</p>
                  </div>
                ) : (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {folderImages.map((url, i) => (
                      <motion.div
                        key={url}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => setLightboxIndex(i)}
                      >
                        <img
                          src={url}
                          alt={`Gallery image ${i + 1}`}
                          className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/30 transition-colors duration-300" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-noir/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-6 right-6 text-ivory/70 hover:text-gold transition-colors z-10"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={28} />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/50 hover:text-gold transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
            >
              <ChevronLeft size={40} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory/50 hover:text-gold transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
            >
              <ChevronRight size={40} />
            </button>
            <img
              src={folderImages[lightboxIndex]}
              alt="Full view"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Gallery;
