import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { useGallery } from "@/hooks/useSiteData";

export default function Gallery() {
  const { data: gallery } = useGallery();
  const images = gallery || [];
  const [open, setOpen] = useState(null);
  const next = () => setOpen((i) => (i + 1) % images.length);
  const prev = () => setOpen((i) => (i - 1 + images.length) % images.length);

  return (
    <section id="gallery" data-testid="gallery-section" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeading
          overline="Gallery"
          title="A glimpse of our coastal flavours."
          subtitle="From signature Mangalorean dishes to our warm dining space, every picture captures the authentic taste and hospitality we proudly serve."
        />

        <Reveal>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 masonry">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setOpen(i)}
                data-testid={`gallery-item-${i}`}
                className="mb-4 md:mb-6 block w-full overflow-hidden rounded-2xl group relative"
              >
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/90 grid place-items-center p-4"
            onClick={() => setOpen(null)}
            data-testid="gallery-lightbox"
          >
            <button
              className="absolute top-6 right-6 h-12 w-12 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={() => setOpen(null)}
              data-testid="lightbox-close"
              aria-label="Close"
            >
              <X />
            </button>
            <button
              className="absolute left-4 md:left-8 h-12 w-12 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous"
            >
              <ChevronLeft />
            </button>
            <motion.img
              key={open}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              src={images[open]}
              alt="Preview"
              className="max-h-[85vh] max-w-[92vw] rounded-2xl shadow-2xl"
            />
            <button
              className="absolute right-4 md:right-8 h-12 w-12 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next"
            >
              <ChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
