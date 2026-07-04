import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { useReviews } from "@/hooks/useSiteData";

export default function Testimonials() {
  const { data: reviews } = useReviews();
  const allReviews = reviews || [];
  const [i, setI] = useState(0);
  const total = allReviews.length;

  useEffect(() => {
    if (!total) return;
    const t = setInterval(() => setI((v) => (v + 1) % total), 5500);
    return () => clearInterval(t);
  }, [total]);

  if (!total) return null;
  const t = allReviews[i];

  return (
    <section id="Reviews" data-testid="Reviews-section" className="py-24 md:py-32 bg-muted/40 relative overflow-hidden">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-[0.04] text-brand-primary">
        <Quote size={240} />
      </div>
      <div className="max-w-5xl mx-auto px-6 md:px-10 relative">
        <SectionHeading overline="What Our Guests Say" subtitle="Read what our customers love about our food, service, and welcoming atmosphere." />

        <div className="relative mt-8">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
              data-testid="testimonial-card"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} size={20} className="fill-brand-secondary text-brand-secondary" />
                ))}
              </div>
              <p className="font-display italic text-2xl md:text-3xl lg:text-4xl leading-snug tracking-tight text-balance">
                “{t.review}”
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <img
                  src={t.img}
                  alt={t.name}
                  loading="lazy"
                  className="h-14 w-14 rounded-full object-cover border-2 border-brand-primary"
                />
                <div className="text-left">
                  <div className="font-medium">{t.name}</div>
                  <div className="overline text-muted-foreground">Verified Guest</div>
                </div>
              </div>
            </motion.blockquote>
          </AnimatePresence>

          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setI((v) => (v - 1 + total) % total)}
              data-testid="testimonial-prev"
              aria-label="Previous testimonial"
              className="h-11 w-11 rounded-full border border-border grid place-items-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {allReviews.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  aria-label={`Go to testimonial ${k + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    k === i ? "bg-brand-primary w-8" : "bg-border w-2"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setI((v) => (v + 1) % total)}
              data-testid="testimonial-next"
              aria-label="Next testimonial"
              className="h-11 w-11 rounded-full border border-border grid place-items-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
