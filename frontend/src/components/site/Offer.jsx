import React from "react";
import { Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import { site } from "@/data/site";

export default function Offer() {
  const scroll = () => document.querySelector("#reservation")?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="offer" data-testid="offer-section" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] p-10 md:p-16 lg:p-20 bg-gradient-to-br from-brand-primary via-[#8B1E1E] to-brand-accent text-white shadow-2xl grain">
            <div className="absolute inset-0 opacity-30" aria-hidden>
              <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-brand-secondary/40 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
            </div>
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 overline text-brand-secondary">
                  <Sparkles size={14} /> Limited Time
                </span>
                <div className="font-display text-6xl md:text-7xl lg:text-8xl leading-none mt-4">
                  {site.offer.title}
                </div>
                <div className="font-display italic text-2xl md:text-3xl mt-3 text-brand-secondary">
                  {site.offer.subtitle}
                </div>
              </div>
              <div className="md:pl-8 md:border-l border-white/20">
                <p className="text-white/85 text-lg leading-relaxed">
                  {site.offer.description}
                </p>
                <button
                  onClick={scroll}
                  data-testid="offer-reserve-btn"
                  className="mt-8 inline-flex items-center gap-2 bg-white text-brand-primary hover:bg-brand-secondary hover:text-brand-ink px-8 py-4 rounded-full font-medium tracking-wide uppercase text-sm transition-all hover:-translate-y-0.5 shadow-xl"
                >
                  Reserve Now
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
