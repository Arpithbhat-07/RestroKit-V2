import React from "react";
import { Quote } from "lucide-react";
import Reveal from "./Reveal";
import { site } from "@/data/site";

export default function Chef() {
  return (
    <section id="chef" data-testid="chef-section" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 -right-32 w-96 h-96 rounded-full bg-brand-secondary/10 blur-3xl" aria-hidden />
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 items-center gap-16">
        <Reveal className="relative flex justify-center lg:justify-start">
          <div className="relative">
            <div className="h-80 w-80 md:h-[420px] md:w-[420px] rounded-full overflow-hidden border-8 border-background shadow-2xl">
              <img
                src={site.chef.image}
                alt={site.chef.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 md:-right-8 bg-brand-primary text-white px-6 py-4 rounded-2xl shadow-xl">
              <div className="font-display text-2xl">22+</div>
              <div className="overline text-xs opacity-80">Years</div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="overline text-brand-primary flex items-center gap-3">
              <span className="h-px w-8 bg-brand-primary" /> Meet the Chef
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 tracking-tight leading-[1.05]">
              {site.chef.name}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="overline text-muted-foreground mt-3">{site.chef.experience}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 relative pl-8 border-l-2 border-brand-primary/30">
              <Quote className="absolute -left-3 top-0 text-brand-primary bg-background" size={20} />
              <p className="text-lg leading-relaxed text-muted-foreground italic">
                {site.chef.story}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-8 font-display italic text-2xl text-brand-primary">
              — Arjun M.
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
